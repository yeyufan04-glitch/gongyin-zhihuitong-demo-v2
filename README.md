# 工银智汇通2.1

本版本以“工银智汇通2”完整业务链为基线，保留企业端、银行经办、银行复核、动态材料、风险协查、智汇报告与到账资金安排；重点升级材料原件联动和浅色多车可信运行视图。全部资料为合成演示数据，不连接真实银行生产系统。

企业国际汇款智能作业平台竞赛PoC。

## 这版解决什么问题

工银智汇通2把企业网银、银行国际业务工作台和技术运行后台分开：业务页面只办业务，`系统运行`页面展示一笔汇入背后的报文解析、文档AI、实体规范化、银行风险系统协查、可信决策闸门和审计留痕。

主Case：武汉励功数字服务有限公司收到ABC GLOBAL LTD汇入的USD 80,000.00。历史合同主体为ABC GLOBAL LIMITED，系统规范化后认为高度匹配，但保留1项人工确认，最终路由为重点复核。

## 演示流程

1. 企业端进入“跨境汇入”，确认资金属于企业并选择“服务贸易”。
2. 在“材料中心”引用有效历史合同，使用演示文件提交本次Invoice。
3. 点击“提交银行审核”，切换“系统运行”，点击“回放”展示完整运行链路。
4. 切换“银行经办”，打开主Case，逐项点击金额、付款方、风险系统协查等结果，右侧查看原始XML、PDF坐标高亮或风险系统返回。
5. 主Case先由经办确认，再由复核岗确认，最后生成Mock入账结果。
6. 切回企业端查看处理进度和“智汇报告”。

## 三个Case

| Case | 场景 | 路由 |
| --- | --- | --- |
| `TT-IN-20260910-001` | USD 80,000；付款方LTD与合同LIMITED的主体名称差异 | 重点复核 |
| `TT-IN-20260910-002` | USD 30,000；软件服务材料与信息一致 | 快速复核 |
| `TT-IN-20260910-003` | USD 120,000；Invoice为USD 102,000，形成金额冲突 | 待客户补件 |

## 关键技术边界

- 原始支付来源是`data/swift/case_00x_pacs008.xml`，格式为`pacs.008.001.08`风格的CBPR+核心结构；Demo未声称通过SWIFT生产Usage Guideline完整验证。
- `Pacs008Parser`从XML提取付款人、收款人、金额、币种、附言、结算日期和UETR，原始XML是Source of Truth。
- AI只做事实抽取、实体规范化和语义关系判断，不输出“无风险”“允许入账”等业务结论。
- 风险结果来自`RiskScreeningProvider`。主Case页面显示“银行风险系统未返回风险预警”，不是“AI判断该交易无风险”。
- 风险系统返回`ALERT`时，`TrustedDecisionGate`输出`RISK_HANDOFF_REQUIRED`并阻断正常入账路径。
- 所有一致、匹配、完整、CLEAR和语义结果都绑定`EvidenceReference`。
- `AuditLedger`使用SHA-256链式校验；这是Demo层面的篡改检测机制，生产环境仍需接入银行受控审计存储、WORM或等价设施。
- “工银隐私舱”在Demo中展示Hash、受控存储状态与生产TEE接口预留，不把接口预留伪称为已启用TEE。
- 没有真实银行核心、真实SWIFT网络、真实风险名单、真实CIPS或真实结售汇执行。

## 运行

```bash
npm install
npm run dev
```

检查工程：

```bash
npm run lint
npm test
npm run build
```

## 目录

- `app/components/DemoApp.tsx`：企业端、银行端、系统运行后台与证据侧栏。
- `core/payment/`：pacs.008解析器。
- `core/intelligent-domain/`：实体规范化、风险适配器与智能作业逻辑。
- `core/trusted-control-domain/`：可信闸门与审计Hash Chain。
- `core/runtime/`：21个运行节点和日志种子。
- `data/swift/`：三笔合成pacs.008 XML原始报文。
- `data/mock-risk/`：明确标注的Synthetic Demo Risk Data。
- `public/demo-documents/`：合同、正常Invoice和金额冲突Invoice。
