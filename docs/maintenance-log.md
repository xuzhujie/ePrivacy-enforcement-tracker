# 维护日志

## 2026-11-20

- 建立独立 ePrivacy 案件登记，保留 Cookie、电子营销、终端标识符和移动 App 主题。
- 按 Légifrance 决定拆分 COSMOSPACE / TELEMAQUE 的 ePrivacy 罚款份额；SOLOCAL / CALOGA 仍因金额未拆分留在复核队列。
- 新增意大利 Garante Privacy 对 Meta 的 €805m Article 122 终端相册访问处罚，补充移动 App / 设备信息覆盖。
- 新增 `amountAllocation`、来源官方域名校验、CSV 字段和来源巡检脚本。
- 将 4 个已失效的 CNIL PDF 地址切换为对应的 Légifrance 决定页；首次 live source check 共 28 个来源，17 个可达、11 个被官方站点以 403 保护、0 个确认失效。
- App SDK 仍不做推测性标注；待官方决定明确指明 SDK 后再新增该主题案件。

## 维护规则

每次案件更新都应记录：官方 URL、决定编号、法律依据、金额范围、证据级别、`DATA_AS_OF` 和是否进入复核队列。自动来源巡检发现不可达 URL 时，只触发维护动作，不改变法律依据或金额归属。
