# 维护日志

## 2026-11-20

- 建立独立 ePrivacy 案件登记，保留 Cookie、电子营销、终端标识符和移动 App 主题。
- 按 Légifrance 决定拆分 COSMOSPACE / TELEMAQUE 的 ePrivacy 罚款份额；SOLOCAL / CALOGA 仍因金额未拆分留在复核队列。
- 新增意大利 Garante Privacy 对 Meta 的 €805m Article 122 终端相册访问处罚，补充移动 App / 设备信息覆盖。
- 新增 `amountAllocation`、来源官方域名校验、CSV 字段和来源巡检脚本。
- 将 4 个已失效的 CNIL PDF 地址切换为对应的 Légifrance 决定页；当前 live source check 共 30 个来源，19 个可达、11 个被官方站点以 403 保护、0 个确认失效。
- 首次 GitHub Actions 运行暴露 Node 22 不支持 `--test tests` 目录导入，已改为显式 `tests/*.test.ts`，避免本地 Node 26 与 CI 行为分叉。
- 新增 Garante Foodinho / Glovo 的官方 GDPR-only SDK 参考记录；它显示在 App SDK 主题中，但明确排除在 ePrivacy 计数和金额之外。
- 上线后优化：将人工证据核验与自动 URL 可达性分离；当前快照为 30 个来源、19 个可达、11 个 403 待复核、0 个确认失效。
- 完成 11 个 403 来源、12 条案件—来源关联的逐条审计：未发现可安全替换且能代表同一官方决定的稳定地址，因此保留原 URL 和人工 `verified` 状态；详见 [`docs/source-audit-2026-11-20.md`](source-audit-2026-11-20.md)。
- 完成 App SDK + ePrivacy 官方执法检索：目前仅有 CNIL SDK 合规指引和 Garante Foodinho / Glovo GDPR-only SDK 决定，没有新增可计入 ePrivacy 的 SDK 处罚；不作法律依据推断，不改变总额。
- 补充跨视图筛选摘要、`⌘ / Ctrl K` 搜索快捷键、证据抽屉 Escape/焦点返回和中英文机构/国家筛选显示。
- CI 改用 `package-lock.json` 与 `npm ci`，来源巡检会更新 `public/source-status.json` 并保留 Actions artifact。

## 维护规则

每次案件更新都应记录：官方 URL、决定编号、法律依据、金额范围、证据级别、`DATA_AS_OF` 和是否进入复核队列。自动来源巡检发现不可达 URL 时，只触发维护动作，不改变法律依据或金额归属。
