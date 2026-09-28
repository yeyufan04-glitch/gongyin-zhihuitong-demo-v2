# 工银智汇通 2.1 定向界面重构清单

## 审计范围

| 现有组件或文件 | 当前页面/职责 | 处理方式 |
| --- | --- | --- |
| `app/components/SystemRuntime21.tsx` | 系统运行页；车辆总览、放射节点、节点抽屉 | 修改：替换为CAV技术迁移双轨、Case运行链和审计黑匣子；移除中央汽车和放射布局。 |
| `app/components/DemoApp.tsx` 的 `BankReview` | 经办与复核Case详情 | 修改：由统一的两列审核布局承接；人工操作迁至页面底部并按角色分离。 |
| `app/components/DemoApp.tsx` 的 `EvidenceSidePanel`、`XmlViewer`、`PdfViewer`、`SystemEvidence` | 右侧证据查看 | 修改：抽取为统一证据状态和单证/比对视图；右侧不再承载人工动作。 |
| `app/components/DemoApp.tsx` 的旧 `action-card` | 经办、复核、Mock入账混放在右侧 | 移动/替换：经办操作、复核操作分别放到底部；入账改为复核通过后的确认弹窗。 |
| `core/runtime/runtimePipeline.mjs`、`core/trusted-control-domain/auditLedger.mjs` | 运行节点和审计日志 | 保留：继续作为当前Case运行与可信日志的数据来源。 |
| `public/demo-documents/*.pdf` | 合同、Invoice、补件单据 | 保留：继续以原件引用方式呈现；页面文案改为“证据定位”，不再以bbox作为业务文案。 |

## 明确保留

- 企业待办、动态材料、历史材料复用、补件、风险系统、智汇报告、到账资金安排。
- 三个演示Case、重置演示、可信控制、Audit Ledger与Hash Chain。
- 原始SWIFT XML、合同、Invoice、风险系统数据和既有业务路由规则。

## 明确移除或不再使用

- 系统运行页的“中央汽车 + 八条放射线 + 八张卡片”主布局。
- 经办/复核页右侧证据列中的经办、复核和Mock入账常驻卡片。
- 面向业务人员展示的“bbox高亮”技术文案。

## 验收重点

1. 经办/复核遵循“左边判断，右边看证据，下面做决定”。
2. 系统运行遵循“上面解释技术迁移，下面证明Case实际如何运行”。
3. AI只提供证据支持和辅助判断，可信闸门与人工保留最终业务控制权。
