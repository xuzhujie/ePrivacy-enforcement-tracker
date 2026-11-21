# ePrivacy Tracker 数据维护约定

本登记库把“官方案件存在”与“是否计入 ePrivacy 总额”拆成两个判断。数据更新时间写在 `src/data/cases.ts` 的 `DATA_AS_OF`，当前数据截至 2026-11-21。

## 计入口径

只有同时满足以下条件的记录才进入总额、按主题统计和年度罚款图：

1. `trackerTreatment = included`；
2. `evidenceStatus = verified`；
3. `gdprTreatment = excluded`，或决定原文明确拆出 ePrivacy 金额且 `amountAllocation = exact`；
4. 至少一项 `legalBases.family = eprivacy`。

如果一项官方决定同时涉及 GDPR、法国《数据保护法》Article 82、电子营销规则或其他依据，保留案件，但只有在决定原文明确拆出 ePrivacy 份额时，才把该份额写入 `fineEur`，并把全文金额写入 `totalDecisionAmountEur`、把 `amountAllocation` 设为 `exact`。没有官方拆分时，`fineEur` 必须为 `null`，`amountAllocation` 设为 `unresolved`，并写明 `reviewReason`。这样不会因为监管机构相同就把案件误算进 GDPR 或 ePrivacy。

`amountAllocation` 的含义是：`exact` 表示 `fineEur` 是官方决定明确归属于 ePrivacy 的金额；`combined` 表示官方金额属于同一组 ePrivacy 依据但没有进一步拆分；`unresolved` 表示混合依据金额尚未能安全归属；`not_applicable` 表示没有可计入的行政罚款。

## 来源与证据状态

- `primary_decision`：官方决定、判决或决定 PDF；
- `authority_announcement`：监管机构官网的案件公告；
- `authority_register`：监管机构处罚登记；
- `annual_report`：年度报告或汇总表，默认进入复核队列，直到找到直接决定文本。

每个来源都要有官方 URL、`lastCheckedAt` 和 `verificationStatus`。这里的 `lastCheckedAt` 表示人工证据核验日期；自动 URL 可达性单独记录在 `public/source-status.json`，最近 12 次去重快照记录在 `public/source-status-history.json`，不会覆盖人工证据状态。看板会在每条来源旁边分别显示人工证据与自动可达性。当前数据校验接受 CNIL、Conseil d'État、爱尔兰 DPC、AEPD、Légifrance、意大利 Garante Privacy 和 EUR-Lex 等官方域名；新增机构时应同时更新 `src/data/dataQuality.ts` 的允许域名。

## 更新流程

1. 从监管机构官网、决定 PDF 或官方登记开始，不以新闻稿或媒体报道作为唯一案件来源。
2. 在 `src/data/cases.ts` 新增或更新案件、法律依据、事件、来源和证据备注。
3. 如果金额覆盖多项法律依据，不做未经官方支持的拆分；使用 `fineScopeNote` 解释金额边界。
4. 运行 `npm run data:check`，确认没有错误；警告必须在复核原因或来源状态中有解释。
5. 运行 `npm test && npm run lint && npm run build`。
6. 预览界面，确认筛选器、证据抽屉、来源登记和 JSON/CSV 导出仍能反映新的字段。

## 持续集成与发布

`.github/workflows/quality-and-pages.yml` 在 Pull Request 和 `main` 分支 push 时执行数据质量检查、测试、lint 和构建；`main` 通过质量门后，会把 `dist` 发布到 GitHub Pages。部署前会生成当前 `public/source-status.json` 及有界 `public/source-status-history.json`，但来源可达性告警不会改变案件证据或金额归属。仓库需要在 GitHub 的 Pages 设置中选择 GitHub Actions 作为来源，并为工作流保留 Pages 写入权限。

GitHub Actions 工作流也支持定期来源检查：`source-monitor.yml` 每周检查登记库里的官方 URL，并在手动触发时生成来源状态报告和 Pages 快照。来源失效只会触发维护告警，不会自动把案件升级为已核验；新增或无法拆分的案件仍必须显式进入 `needs_review` 队列。HTTP 403 记录为可达性待复核，不作为确认失效。2026-11-21 的专项审计确认，当前 12 个 403 URL 均仍对应已人工核验的官方 CNIL / Légifrance 证据；AEPD `PS/00051/2023` 已补挂可访问的直接决定，详见 [`docs/source-audit-2026-11-21.md`](source-audit-2026-11-21.md)。

## 建议维护节奏

- 每月检查一次 CNIL、DPC、AEPD 和其他已纳入机构的 enforcement / cookies / direct marketing 页面；
- 对 `needs_review` 队列优先寻找直接决定文本，再把 `fineEur`、`evidenceStatus` 和 `trackerTreatment` 改为已核验状态；
- 每次发布同时保留 `DATA_AS_OF`、官方来源 URL 和决定编号，方便回溯；
- 依赖安装使用提交的 `package-lock.json` 与 `npm ci`，不要用未锁定的 `npm install` 替代；
- 若案件只有刑事追诉、捐赠替代罚金或禁令后续，应保留案件，但不要把非罚款金额冒充行政罚款。

## 当前覆盖与已知空白

当前数据覆盖 Cookie、电子营销、终端标识符和移动 App 相关记录。意大利 Garante 的 Meta 案件补充了“App 读取终端相册信息”的 ePrivacy 执法，但官方决定没有称其为 SDK，因此仍只标记 `device_identifiers`。另有一条 Garante Foodinho / Glovo 决定明确描述 SDK 读取设备信息、位置和标识符，但其法律依据是 GDPR；它可作为 App SDK 参考展示，`trackerTreatment = excluded`，不计入 ePrivacy 总额。新增 ePrivacy App SDK 案件时，仍需要官方文本明确说明 SDK、设备信息或终端标识符的读取行为，并确认实际法律依据属于 ePrivacy。

本轮官方检索没有发现同时满足“明确 SDK 事实”和“明确 ePrivacy 法律依据”的新增处罚；FNAC Darty 和 Meta 的已入库记录仍分别保持“App API/标识符”和“终端相册访问”边界，不反推为 SDK。CNIL 的移动应用建议属于合规指引，不作为执法案件纳入；后续仍按上述双重条件回填。
