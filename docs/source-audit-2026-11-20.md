# 2026-11-20 来源巡检与 App SDK 覆盖审计

本次维护分为两条线：复核自动来源巡检中的 HTTP 403，以及检索“App SDK + ePrivacy 法律依据”的官方执法记录。审计目标是改善可追溯性，不因自动化客户端的可达性差异改变案件的法律依据、金额口径或证据级别。

## 1. 来源巡检结论

本次快照来自 [`public/source-status.json`](../public/source-status.json)，历史记录来自 [`public/source-status-history.json`](../public/source-status-history.json)：

- 32 个去重后的官方来源 URL；
- 20 个返回 2xx；
- 12 个返回 HTTP 403，均标记为 `needs_review`；
- 0 个被确认失效或无法连接；
- 12 个 URL 对应 13 条案件—来源关联；
- 历史文件保留最近 12 次去重后的自动巡检快照，本轮为第 2 次快照。

HTTP 403 是自动化可达性状态，不是人工证据状态。涉及的案件来源仍保持 `verificationStatus = verified`，因为官方页面、决定编号和案件事实已经在人工核验中确认。当前 403 来源分为两组：

| 官方站点 | 403 URL 数 | 案件—来源关联 | 涉及内容 | 处理决定 |
| --- | ---: | ---: | --- | --- |
| CNIL | 3 | 4 | Orange 罚款与结案；COSMOSPACE / TELEMAQUE 公告 | 保留 CNIL 原始 URL，不用镜像替换 |
| Légifrance | 9 | 9 | Google、Amazon、Facebook、COSMOSPACE、TELEMAQUE、SOLOCAL、CALOGA 决定页及 SOLOCAL 结案决定 | 保留决定编号 URL，不用不稳定 PDF 替换 |

逐条复核得到的结果：

1. CNIL 页面在浏览器搜索和官方站内结果中仍可定位；当前自动化 HTTP 客户端受到站点级访问保护。Orange 的原始公告和后续结案公告分别保留，避免把结案状态与原始处罚事实混在一起。参见 [Orange 罚款公告](https://www.cnil.fr/en/advertisements-inserted-among-emails-orange-fined-eu50-million) 和 [Orange 结案公告](https://www.cnil.fr/en/closure-injunction-issued-against-orange)。
2. COSMOSPACE / TELEMAQUE 的 CNIL 公告和 Légifrance 决定页分别承载监管机构事实与决定原文，不能仅因其中一个自动返回 403 就删除或合并。参见 [CNIL 公告](https://www.cnil.fr/en/online-clairvoyance-cosmospace-and-telemaque-fined-eu250000-and-eu150000)。
3. 对 Légifrance URL 尝试了常见的主机、尾斜杠和浏览器 User-Agent 变体，仍无法得到稳定的自动化 2xx；搜索结果中出现的若干 CNIL PDF 路径在直接探测时返回 404。因此没有把 404 或不确定是否对应同一决定的地址写入数据。
4. Google 2020 案件已有可达的 [Conseil d'État 官方说明](https://www.conseil-etat.fr/site/Pages-internationales/english/news/advertising-cookies-google-fined-100-million)，其 Légifrance 决定页继续作为决定级来源保留。SOLOCAL 和 CALOGA 的 CNIL 公告目前可达，决定页仍作为原始决定入口保留在复核链路中。
5. AEPD 2023 年度报告确认 `PS/00051/2023`、Article 22(2) LSSI 和 €5,000，但本轮没有验证到可稳定访问的 AEPD 直接决定文本；Massimo Dutti 继续保留在年度报告复核队列。参见 [AEPD 2023 年度报告](https://www.aepd.es/memorias/memoria-aepd-2023.pdf)。

### 维护动作

- 不替换这 12 个 URL，不降低人工证据级别，也不修改金额和法律依据。
- 看板继续把 `verified`（人工证据）与 `needs_review`（自动可达性）分开展示。
- 后续复核优先使用浏览器或官方文档下载核对原文；一旦出现稳定且确认属于同一决定的官方地址，再补充或替换来源。
- 来源巡检继续按周运行；403 只能触发维护动作，不能自动把案件变成失效或排除。`source-monitor.yml` 同步更新最新快照与有界历史文件。

## 2. App SDK + ePrivacy 回填检索

本次检索只接受官方监管机构的执法决定、官方案件公告或官方处罚登记，并要求原文同时满足：

1. 明确描述 SDK、软件开发工具包或由 SDK 读取的设备信息 / 终端标识符；
2. 明确列出 ePrivacy 转化规则或等效的终端访问、Cookie、电子营销法律依据；
3. 有足够证据把案件事实与处罚金额对应到该法律依据。

截至本次审计，没有发现满足全部条件的新处罚，因此不新增 ePrivacy App SDK 案件，也不调整 ePrivacy 总额。已确认的边界如下：

- [CNIL《移动应用建议》](https://www.cnil.fr/sites/default/files/2025-04/recommandation-applications-mobiles-modifiee.pdf) 讨论 SDK、Article 82 与 GDPR 同意要求，但它是合规指引，不是处罚决定，不能作为案件记录。
- [Garante 对 Foodinho / Glovo 的决定](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/10105535) 明确提到 SDK / API、GPS 和终端信息，并处以 €5,000,000；官方依据是 GDPR，当前 `EP-2024-006` 因此作为 GDPR-only App SDK 参考记录展示，但 `trackerTreatment = excluded`，不计入 ePrivacy 总额。
- Garante 的 Meta 终端相册案件使用 Article 122，但官方决定没有明确称其为 SDK；当前继续标记为 `device_identifiers`，不把它反推为 App SDK 案件。
- CNIL / Légifrance 的 `SAN-2026-012` 已确认 SOLOCAL 2025 年整改禁令结案；该后续动作已补入登记库，但不改变原 €900,000 混合依据罚款仍未拆分的状态。参见 [SOLOCAL 结案决定](https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000054886539)。

### 回填规则

后续只有在官方原文同时给出 SDK 事实和 ePrivacy 法律依据时，才新增或修改 `app_sdk` + `gdprTreatment = excluded` 的 ePrivacy 记录。仅有 App API、后台定位、设备权限或一般移动 App 描述时，仍需保持主题与法律依据的精确边界。

## 3. 本轮数据影响

本次是来源与覆盖审计，没有安全的案件新增或金额重分类：

- ePrivacy 纳入案件：17 条；
- 复核队列：3 条；
- ePrivacy 纳入金额：€1,684,350,500；
- 案件来源记录：34 条（新增 SOLOCAL 结案公告与决定）；
- `DATA_AS_OF` 保持 `2026-11-20`。

下次维护触发条件：CNIL / Légifrance 403 页面出现稳定官方替代入口，或监管机构发布同时满足 SDK 与 ePrivacy 条件的新决定。
