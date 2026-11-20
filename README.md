# ePrivacy｜独立执法 Tracker

一个按实际法律依据登记 ePrivacy 执法的双语看板，覆盖：

- Cookie 与其他终端追踪器
- 移动 App 读取设备信息与终端标识符
- App SDK（仅在官方文本明确提及 SDK 时标记）
- 电子邮件、短信等电子营销

案件可以与 GDPR 数据底座共用，但只有明确基于 ePrivacy 转化规则的部分才进入 ePrivacy 总额。混合 GDPR / ePrivacy 决定保留完整决定金额，并通过 `amountAllocation` 区分已拆分、合计、未解决和不适用。

## 本地运行

```bash
npm ci
npm run dev
```

质量门：

```bash
npm run data:check
npm test
npm run lint
npm run build
```

官方来源巡检：

```bash
npm run sources:check -- --output public/source-status.json --history-output public/source-status-history.json
```

来源巡检只报告 URL 可达性，不会自动把复核案件升级为已核验；金额归属和法律依据仍需人工阅读官方原文。

看板会把人工证据状态与自动 URL 可达性分开显示。`403` 只表示自动检查需要复核，不等于官方决定失效或案件证据被排除。
`public/source-status-history.json` 保存最近 12 次去重后的巡检快照；部署后的来源登记会把最新自动结果显示在每条人工证据状态旁边。
总览中的“待复核案件”入口会打开独立 review queue，当前筛选也会写入 URL（例如 `?review=needs_review`），便于分享和复核。

## 数据与维护

- 主数据：[`src/data/cases.ts`](src/data/cases.ts)
- 数据校验：[`src/data/dataQuality.ts`](src/data/dataQuality.ts)
- 维护约定：[`docs/data-maintenance.md`](docs/data-maintenance.md)
- 维护日志：[`docs/maintenance-log.md`](docs/maintenance-log.md)
- 最近一次来源与 App SDK 覆盖审计：[`docs/source-audit-2026-11-20.md`](docs/source-audit-2026-11-20.md)
- 来源巡检：[`scripts/check-sources.ts`](scripts/check-sources.ts)

当前数据截至 `2026-11-20`。App SDK 现在包含一条官方明确提及 SDK 的 GDPR-only 参考记录，但该记录不计入 ePrivacy 处罚总额；没有官方明确文字时，仍不把普通移动 App API 或终端访问推断为 SDK。

## CI / GitHub Pages

每次 Pull Request 和 `main` 分支 push 会执行数据校验、测试、lint 和构建；`main` 通过质量门后由 [`quality-and-pages.yml`](.github/workflows/quality-and-pages.yml) 发布 GitHub Pages。每周来源巡检由 [`source-monitor.yml`](.github/workflows/source-monitor.yml) 执行，并保留 JSON 报告为 Actions artifact。

依赖安装使用已提交的 `package-lock.json` 与 `npm ci`。来源巡检会更新 `public/source-status.json` 与有界历史文件，下一次 Pages 发布会把最近巡检摘要带到看板中。

首次发布前，在仓库 Settings → Pages 中选择 **GitHub Actions** 作为来源。默认 Pages 地址为：

`https://xuzhujie.github.io/ePrivacy-enforcement-tracker/`
