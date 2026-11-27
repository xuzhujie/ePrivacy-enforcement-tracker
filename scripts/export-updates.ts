// 导出最近更新的执法案件为 public/data/updates.json，
// 供九号舆情工作台（妙搭应用）通过 raw.githubusercontent.com 机读消费。
import { mkdirSync, writeFileSync } from 'node:fs'
import { cases, DATA_AS_OF } from '../src/data/cases'

const ITEM_LIMIT = 8
const SUMMARY_LIMIT = 200

const items = cases
  .slice()
  .sort((left, right) => (right.latestDate ?? right.decisionDate).localeCompare(left.latestDate ?? left.decisionDate))
  .slice(0, ITEM_LIMIT)
  .map((item) => ({
    title: item.title.en,
    link: item.sources[0]?.url ?? '',
    date: item.latestDate ?? item.decisionDate,
    summary: `${item.summary.en}${item.fineEur ? ` · ePrivacy 罚款 €${item.fineEur.toLocaleString('en-US')}` : ''}`.slice(0, SUMMARY_LIMIT),
  }))

const payload = {
  updated_at: DATA_AS_OF,
  source: 'eprivacy-enforcement-tracker src/data/cases.ts',
  items,
}

mkdirSync('public/data', { recursive: true })
writeFileSync('public/data/updates.json', JSON.stringify(payload, null, 2) + '\n')
console.log(`exported ${items.length} items to public/data/updates.json`)
