# 贸证贯通真实风格考试单据数据替换报告

生成日期：2026-09-15

## 结论

本次保留原有企业端、银行端、TEG-ESE、CAV、Trusted Decision Gate、经办—复核—Mock入账流程，仅替换 Case 输入数据与证据来源。原始考试图片按交易资料归并为 9 笔 Trade Case；每笔均生成了 Case Manifest、Ground Truth、模拟 MT103 文本、机器可读 SWIFT JSON 和 Mock 外部数据。

## Case 清单

| Case | 来源 | 金额 | 币种 | 出口商/收款人 | 进口商/付款人 | 单据 | 状态 |
|---|---:|---:|---|---|---|---:|---|
| CASE_2011_001 | 苏州_2011 | 32,800 | USD | SUZHOU IMPORT & EXPORT TRADE CORPORATION | TANJIN-DAIEI CO., LTD. | 2 | GOLDEN_CASE |
| CASE_2012_001 | 12年 | 192,000 | USD | DAYU CUTTING TOOLS I/E CORP | FAR EASTERN TRADING COMPANY LIMITED | 3 | FAST_REVIEW |
| CASE_2013_001 | 13年 | 240,000 | USD | TIANJIN TECHSUN CO., LTD. | VESTE BEYAS ESYE SAN. TICAS | 3 | PARTIAL |
| CASE_2014_001 | 14年 | 27,500 | USD | SHANGHAI ANDYS TRADING CO., LTD. | HAZZE AB HOLDING | 3 | PARTIAL |
| CASE_2015_001 | 15年 | 153,000 | USD | SHENZHEN ESHOW CO., LTD. | MARCO FOERSTER GMBH | 3 | PARTIAL |
| CASE_2016_001 | 2016 | 79,960 | USD | SUNSHINE TRADING CORP. | JOYFAIR TRADING CORP. | 4 | PARTIAL |
| CASE_2017_001 | 2017 | 96,000 | GBP | SHANGHAI GUANGDA CO., LTD. | JOYFAIR TRADING CORP. | 3 | PARTIAL |
| CASE_2018_001 | 2018 | 75,780 | USD | SHANGHAI CHENGYUAN TRADING CO., LTD. | MATHILDE EUROPE GMBH | 3 | PARTIAL |
| CASE_2019_001 | 2019 | 153,000 / Invoice 180,000 | USD | TIANJIN ESHOW CO., LTD. | MARCO FOERSTER GMBH | 3 | CONFLICT |

## 来源与边界

- 原始图片保存在 `data/datasets/trade_cases/raw/source_materials/`，并复制到对应 Case 的 `original/` 目录；页面证据查看优先引用 2011、2012、2019 三笔主展示 Case 的原始扫描件。
- `source.type` 统一标记为 `international_business_document_exam`；这些是考试题风格材料，不是银行真实客户数据。
- SWIFT 报文是根据 Case 贸易事实生成的 `MT103` 模拟数据，统一标记 `SIMULATED FOR DEMO`，不代表真实 SWIFT 已接通。
- 风险、海关和外部物流数据保存在每笔 Case 的 `generated/mock_external_data.json`，明确标记为 synthetic；页面只展示银行风险系统 Mock 结果。
- 2019 Case 保留原始题目中的 USD 153,000 与商业发票 USD 180,000 差异，进入补件/人工复核路径，没有通过改前端隐藏冲突。

## 替换范围

已修改或新增：

- `core/engine.mjs`：将主 Demo 的三笔 Case、付款事件、证据引用替换为 2011、2012、2019 资料；其余 6 笔保存在完整数据集供复核与扩展。
- `data/swift/case_2011_pacs008.xml`、`case_2012_pacs008.xml`、`case_2019_pacs008.xml`：兼容原系统 pacs.008 解析入口的合成报文。
- `public/demo-documents/trade-cases/`：页面可直接查看的原始扫描件。
- `data/datasets/trade_cases/`：9 笔 Case 的原始文件、Manifest、Ground Truth、模拟 SWIFT 与 Mock 外部数据。
- `scripts/build_trade_dataset.mjs`：可重复生成 Case 结构化产物。
- `scripts/validate_trade_dataset.mjs` 与 `docs/DATA_CONSISTENCY_CHECK.json`：自动一致性检查。

未修改：页面布局、视觉系统、原有银行策略、TEG-ESE/CAV算法组件和人工最终确认边界。没有删除原系统核心功能；旧示例文件仍保留在基线副本中，但不再作为主 Case 的页面证据。

## 验收结果

- Case ID 唯一：通过。
- 9 笔 Case 均有原始文件目录：通过。
- 9 笔 Case 均有合法 JSON Manifest、Ground Truth、SWIFT normalized JSON 和 Mock 外部数据：通过。
- 模拟 SWIFT 金额、币种、付款方、收款方、附言均与对应 Case 保持一致：通过。
- 2019 预期金额冲突被显式记录：通过。
- `npm run lint`：通过，0 error；保留 2 个原始扫描件 `<img>` 性能提示。
- `npm test`：通过，13/13；
- `npm run build`：通过，生产构建完成；
- `node scripts/validate_trade_dataset.mjs`：通过，9/9 Case、全部一致性检查通过。
