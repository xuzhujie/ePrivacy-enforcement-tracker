# 2026-11-21 来源巡检与证据复核

本轮维护完成两项动作：用联网环境刷新官方来源可达性，并复核 Massimo Dutti 的 AEPD 一手决定。来源可达性只用于维护提醒，不改变人工证据状态、法律依据或金额归属。

## 1. 来源巡检

2026-11-21 联网快照来自 [`public/source-status.json`](../public/source-status.json)，历史记录来自 [`public/source-status-history.json`](../public/source-status-history.json)：

- 33 个去重后的官方来源 URL；
- 21 个返回 2xx；
- 12 个返回 HTTP 403，标记为 `needs_review`；
- 0 个确认失效或无法连接；
- 历史文件当前保留 4 个真实快照（上限为 12 个；早期快照的去重合并仍由解析器负责）。

12 个 403 仍集中在 CNIL 与 Légifrance。没有发现可以安全替换、且能确认代表同一决定的稳定官方地址，因此继续保留原 URL；403 不会自动把人工 `verified` 改成 `needs_review`。

## 2. Massimo Dutti 证据闭环

新增并核验官方决定：[AEPD PS/00051/2023](https://www.aepd.es/documento/ps-00051-2023.pdf)。该 24 页决定明确：

- 案件主体为 `GRUPO MASSIMO DUTTI, S.A.`，程序号为 `EXP202210347 (PS/00051/2023)`；
- 违法依据为西班牙 LSSI Article 22(2)；
- AEPD 认定用户撤回同意后仍无法拒绝已接受的非必要第三方 Cookie；
- 决定最终处以 €5,000 罚款。

因此案件从 `annual_report` / `needs_review` 升级为 `primary_decision` / `verified` / `included`。原有 AEPD 2023 年度报告仍保留作为补充来源；没有新增 GDPR 法律依据，也没有进行任何未经官方支持的金额拆分。

## 3. 当前数据影响

- ePrivacy 纳入案件：18 条；
- 复核队列：2 条（SOLOCAL、CALOGA）；
- ePrivacy 纳入金额：€1,684,355,500；
- 案件来源记录：35 条；
- 去重来源 URL：33 条；
- `DATA_AS_OF`：2026-11-21。

App SDK / 终端信息检索没有新增可安全纳入的 `app_sdk` 案件。FNAC Darty 的官方公告仍明确为移动 App API 与用户标识符，Meta 的 Garante 决定明确为 App 读取终端相册信息；两者都不被反推为具体 SDK。
