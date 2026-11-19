import { cases } from '../src/data/cases.ts'
import { getDashboardMetrics } from '../src/data/dashboardMetrics.ts'
import { validateCaseDataset } from '../src/data/dataQuality.ts'

const report = validateCaseDataset(cases)
const metrics = getDashboardMetrics(cases)

console.log(`ePrivacy dataset: ${report.caseCount} cases, ${report.sourceCount} source records`)
console.log(`Included total: €${metrics.eprivacyFineTotal.toLocaleString('en-US')} across ${metrics.eprivacyCaseCount} cases`)
console.log(`Review queue: ${report.reviewCaseCount} cases; errors: ${report.errorCount}; warnings: ${report.warningCount}`)

for (const issue of report.issues) {
  console.log(`${issue.severity.toUpperCase()} ${issue.caseId} ${issue.field}: ${issue.message}`)
}

if (report.errorCount > 0) process.exitCode = 1
