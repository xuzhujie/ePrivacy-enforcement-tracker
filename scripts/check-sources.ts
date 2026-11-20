import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { cases } from '../src/data/cases.ts'
import { buildSourceMonitorReport, classifySourceStatus, getSourceUrls, parseSourceMonitorArgs, type SourceCheckResult } from '../src/lib/sourceMonitoring.ts'
import { appendSourceStatusHistory, readSourceStatusHistory } from '../src/lib/sourceStatus.ts'

const timeoutMs = 15_000
const { outputPath, historyPath } = parseSourceMonitorArgs(process.argv.slice(2))

async function checkSource(url: string): Promise<SourceCheckResult> {
  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'user-agent': 'ePrivacy-enforcement-tracker-source-monitor/1.0' },
    })

    if (response.status === 403 || response.status === 405) {
      await response.body?.cancel()
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
        headers: { 'user-agent': 'ePrivacy-enforcement-tracker-source-monitor/1.0' },
      })
    }

    await response.body?.cancel()
    return {
      url,
      statusCode: response.status,
      finalUrl: response.url,
      status: classifySourceStatus(response.status),
    }
  } catch (error) {
    return {
      url,
      statusCode: null,
      error: error instanceof Error ? error.message : String(error),
      status: 'unreachable',
    }
  }
}

const urls = getSourceUrls(cases)
const results = await Promise.all(urls.map(checkSource))
const report = buildSourceMonitorReport(results)
console.log(JSON.stringify(report, null, 2))

if (outputPath) {
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

if (historyPath) {
  let history = []
  try {
    history = readSourceStatusHistory(JSON.parse(await readFile(historyPath, 'utf8')))
  } catch {
    history = []
  }
  await mkdir(dirname(historyPath), { recursive: true })
  const snapshots = appendSourceStatusHistory(history, report)
  await writeFile(historyPath, `${JSON.stringify({ snapshots }, null, 2)}\n`, 'utf8')
}

if (report.blockingCount > 0) process.exitCode = 1
