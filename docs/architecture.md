# 技术架构说明

## 业务对象

汇入报文 → Case → 证据引用 → 确定性规则 → 银行风险系统结果 → 可信决策门 → 经办/复核 → 演示入账 → 审计账本。

系统的核心对象是 `Inbound Payment Case`，不是单个PDF。每个Case绑定原始 `pacs.008.001.08` 报文、企业确认、资金性质、动态材料要求、合同与Invoice、风险系统结果、人工动作、演示入账与审计账本。

`core/payment/pacs008Parser.mjs`从原始XML解析出结构化字段；页面不直接伪造金额、付款方或汇款用途。后续接入真实报文总线时，可替换报文来源而不改变页面的业务对象。

## 可信AI审核链

1. 报文与材料取证：从原始XML、PDF和风险系统结果生成统一 `EvidenceReference`。
2. 规则核验：金额、币种、收款主体、合同有效期、材料完整性等交给确定性规则。
3. 语义任务：主体名称、用途和合同关系只输出关系、可信度和证据，不输出批准结论。
4. 风险交接：`RiskScreeningProvider`只负责接入银行风险系统结果；风险系统未返回结果时阻断后续决策。
5. 可信分流：由确定性规则与风险系统结果共同决定 `FAST_REVIEW`、`FOCUSED_REVIEW`、`SUPPLEMENT_REQUIRED` 或 `RISK_HANDOFF_REQUIRED`。

## 真实模式边界

`core/intelligent-domain/risk-adapter.mjs`提供银行风险系统适配边界。当前使用全量合成风险数据，`CLEAR` 只表示演示用风险系统没有返回预警，不表示客户无风险，也不等于银行审批通过。模型输出治理标记为 `NOT_ALLOWED_BUSINESS_DECISION`，禁止AI输出入账、通过、审批或批准支付等业务决定。

## Maker-Checker

经办确认后状态进入 `APPROVED_BY_OPERATOR`，复核确认后才允许生成PostingInstruction。演示入账按钮只在复核完成后可用，并明确提示未连接真实核心系统。
