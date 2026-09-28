import { compareEntityNames, normalizeEntityName } from "./intelligent-domain/entity-normalizer.mjs";
import { trustedDecisionGate } from "./trusted-control-domain/decisionGate.mjs";

export const company = {
  name: "苏州进出口贸易有限公司（演示主体）",
  englishName: "SUZHOU IMPORT & EXPORT TRADE CORPORATION",
  account: "6222 **** 2011",
};

export const demoPayments = [
  { paymentId: "PMT-2011-001", uetr: "SIM-2011-TX0522-001", receivedAt: "2011-06-20 10:15", debtorName: "TANJIN-DAIEI CO., LTD.", debtorBank: "FUJI BANK · SIMULATED", debtorCountry: "日本", creditorName: company.name, creditorAccount: company.account, amount: 32800, currency: "USD", remittanceInfo: "INV TX0522 / CONTRACT TXT264 / BLACK TEA", paymentNetwork: "SWIFT · MT103（模拟）", paymentStatus: "PENDING_REVIEW" },
  { paymentId: "PMT-2012-001", uetr: "SIM-2012-X118-001", receivedAt: "2012-05-18 09:40", debtorName: "FAR EASTERN TRADING COMPANY LIMITED", debtorBank: "DEMO BANK NEW YORK", debtorCountry: "美国", creditorName: "DAYU CUTTING TOOLS I/E CORP", creditorAccount: "6222 **** 2012", amount: 192000, currency: "USD", remittanceInfo: "INV X118 / CONTRACT MK007 / CUTTING TOOLS", paymentNetwork: "SWIFT · MT103（模拟）", paymentStatus: "PENDING_REVIEW" },
  { paymentId: "PMT-2019-001", uetr: "SIM-2019-EXP2019033-001", receivedAt: "2019-05-30 11:20", debtorName: "MARCO FOERSTER GMBH", debtorBank: "DEMO BANK HAMBURG", debtorCountry: "德国", creditorName: "天津易秀有限公司", creditorAccount: "6222 **** 2019", amount: 153000, currency: "USD", remittanceInfo: "INV EXP2019033 / CONTRACT EXP0905033 / RT628", paymentNetwork: "SWIFT · MT103（模拟）", paymentStatus: "PENDING_REVIEW" },
];

export const demoCases = [
  { id: "TT-IN-2011-001", paymentId: "PMT-2011-001", datasetId: "CASE_2011_001", evidencePrefix: "case_2011", customerName: company.name, customerType: "新客户", purpose: "货物贸易", amount: 32800, currency: "USD", route: "FOCUSED_REVIEW", status: "FOCUSED_REVIEW", issue: "付款方名称需与贸易单据主体关系确认", documents: ["商业发票 TX0522", "装箱单 TXT264"], historical: false, riskStatus: "CLEAR", contractParty: "SUZHOU IMPORT & EXPORT TRADE CORPORATION", service: "BLACK TEA", country: "日本", goods: "BLACK TEA" },
  { id: "TT-IN-2012-001", paymentId: "PMT-2012-001", datasetId: "CASE_2012_001", evidencePrefix: "case_2012", customerName: "天津大宇切削工具进出口公司", purpose: "货物贸易", amount: 192000, currency: "USD", route: "FAST_REVIEW", status: "FAST_REVIEW", issue: "无", documents: ["商业发票 X118", "保险单 ABX999", "原产地证明 IB012345678"], historical: false, riskStatus: "CLEAR", contractParty: "DAYU CUTTING TOOLS I/E CORP", service: "CUTTING TOOLS", country: "美国", goods: "CUTTING TOOLS" },
  { id: "TT-IN-2019-001", paymentId: "PMT-2019-001", datasetId: "CASE_2019_001", evidencePrefix: "case_2019", customerName: "天津易秀有限公司", purpose: "货物贸易", amount: 153000, currency: "USD", route: "SUPPLEMENT_REQUIRED", status: "SUPPLEMENT_REQUIRED", issue: "考试题目金额USD 153,000与商业发票USD 180,000不一致", documents: ["商业发票 EXP2019033", "装运通知 EXP2019033"], historical: false, riskStatus: "CLEAR", invoiceAmount: 180000, contractParty: "TIANJIN ESHOW CO., LTD.", service: "RT628 PORTABLE WALKIE TALKIE", country: "德国", goods: "RT628 PORTABLE WALKIE TALKIE" },
];

export const historicalDocuments = [];

export const aiClaims = [
  { id: "CLM-001", type: "FACT", claim: "模拟SWIFT金额与商业发票TX0522金额一致", status: "SUPPORTED", confidence: 0.98, evidenceIds: ["case_2011-swift-amount", "case_2011-invoice-amount"], modelVersion: "Mock Document AI · Demo Calibration Dataset" },
  { id: "CLM-002", type: "SEMANTIC", claim: "TANJIN-DAIEI与贸易单据进口商主体一致", status: "SUPPORTED", confidence: 0.96, evidenceIds: ["case_2011-swift-payer", "case_2011-contract-party"], modelVersion: "Mock Semantic Engine · Synthetic Benchmark" },
  { id: "CLM-003", type: "RELATION", claim: "汇款附言与BLACK TEA贸易背景存在关联", status: "SUPPORTED", confidence: 0.92, evidenceIds: ["case_2011-swift-remittance", "case_2011-contract-service"], modelVersion: "Mock Semantic Engine · Synthetic Benchmark" },
];

export const rules = [
  { ruleId: "AMOUNT_MATCH", label: "金额一致性", result: "PASS", detail: "USD 32,800.00 = USD 32,800.00", evidenceIds: ["case_2011-swift-amount", "case_2011-invoice-amount"] },
  { ruleId: "CURRENCY_MATCH", label: "币种一致性", result: "PASS", detail: "USD = USD", evidenceIds: ["case_2011-swift-amount", "case_2011-invoice-amount"] },
  { ruleId: "CREDITOR_MATCH", label: "收款企业", result: "PASS", detail: company.name, evidenceIds: ["case_2011-swift-beneficiary", "case_2011-contract-party"] },
  { ruleId: "CONTRACT_VALIDITY", label: "贸易日期", result: "PASS", detail: "2010-06-01发票 · 2010-06-20装运", evidenceIds: ["case_2011-invoice-date", "case_2011-swift-settlement-date"] },
  { ruleId: "DOCUMENT_COMPLETENESS", label: "材料完整性", result: "PASS", detail: "2 / 2 · 发票与装箱单已提供", evidenceIds: ["case_2011-material-rules", "case_2011-invoice-amount"] },
  { ruleId: "RISK_SCREENING", label: "风险系统协查", result: "CLEAR", detail: "银行风险系统未返回风险预警", evidenceIds: ["case_2011-risk-result"] },
];

export const evidenceReferences = [
  { id: "case_2011-swift-amount", sourceId: "case_2011_mt103.txt", sourceType: "SWIFT_MT103_SIMULATED", label: "模拟SWIFT · 结算金额", locator: { type: "TEXT", line: 3 }, sourceText: ":32A:110620USD32800,00" },
  { id: "case_2011-swift-payer", sourceId: "case_2011_mt103.txt", sourceType: "SWIFT_MT103_SIMULATED", label: "模拟SWIFT · 付款人", locator: { type: "TEXT", line: 4 }, sourceText: "TANJIN-DAIEI CO., LTD." },
  { id: "case_2011-swift-beneficiary", sourceId: "case_2011_mt103.txt", sourceType: "SWIFT_MT103_SIMULATED", label: "模拟SWIFT · 收款人", locator: { type: "TEXT", line: 5 }, sourceText: company.englishName },
  { id: "case_2011-swift-remittance", sourceId: "case_2011_mt103.txt", sourceType: "SWIFT_MT103_SIMULATED", label: "模拟SWIFT · 附言", locator: { type: "TEXT", line: 6 }, sourceText: "INV TX0522 / CONTRACT TXT264 / BLACK TEA" },
  { id: "case_2011-swift-settlement-date", sourceId: "case_2011_mt103.txt", sourceType: "SWIFT_MT103_SIMULATED", label: "模拟SWIFT · 结算日期", locator: { type: "TEXT", line: 3 }, sourceText: "2010-06-20" },
  { id: "case_2011-invoice-amount", sourceId: "commercial_invoice.jpg", sourceType: "ORIGINAL_SCAN", sourcePath: "/demo-documents/trade-cases/2011/commercial_invoice.jpg", label: "商业发票 TX0522 · 总金额", locator: { type: "IMAGE", page: 1 }, sourceText: "TOTAL USD 32,800.00" },
  { id: "case_2011-contract-party", sourceId: "packing_list.jpg", sourceType: "ORIGINAL_SCAN", sourcePath: "/demo-documents/trade-cases/2011/packing_list.jpg", label: "装箱单 TXT264 · 进口商", locator: { type: "IMAGE", page: 1 }, sourceText: "TANJIN-DAIEI CO., LTD." },
  { id: "case_2011-contract-service", sourceId: "commercial_invoice.jpg", sourceType: "ORIGINAL_SCAN", sourcePath: "/demo-documents/trade-cases/2011/commercial_invoice.jpg", label: "商业发票 · 货物", locator: { type: "IMAGE", page: 1 }, sourceText: "BLACK TEA · 330KGS" },
  { id: "case_2011-invoice-date", sourceId: "commercial_invoice.jpg", sourceType: "ORIGINAL_SCAN", sourcePath: "/demo-documents/trade-cases/2011/commercial_invoice.jpg", label: "商业发票 · 日期", locator: { type: "IMAGE", page: 1 }, sourceText: "JUNE 1, 2010" },
  { id: "case_2011-material-rules", sourceId: "dataset-rules.json", sourceType: "SYSTEM_RULE", label: "动态材料规则 · 货物贸易", locator: { type: "JSON", jsonPath: "$.cases.CASE_2011_001.expected_document_types" }, sourceText: "商业发票 + 装箱单" },
  { id: "case_2011-risk-result", sourceId: "BANK_RISK_MOCK", sourceType: "RISK_SYSTEM", label: "银行风险系统返回", locator: { type: "JSON", jsonPath: "$.riskScreening.CASE_2011_001.status" }, sourceText: "CLEAR · 未触发预警" },
  { id: "case_2012-swift-amount", sourceId: "case_2012_mt103.txt", sourceType: "SWIFT_MT103_SIMULATED", label: "模拟SWIFT · 结算金额", locator: { type: "TEXT", line: 3 }, sourceText: ":32A:120518USD192000,00" },
  { id: "case_2012-swift-payer", sourceId: "case_2012_mt103.txt", sourceType: "SWIFT_MT103_SIMULATED", label: "模拟SWIFT · 付款人", locator: { type: "TEXT", line: 4 }, sourceText: "FAR EASTERN TRADING COMPANY LIMITED" },
  { id: "case_2012-invoice-amount", sourceId: "commercial_invoice.png", sourceType: "ORIGINAL_SCAN", sourcePath: "/demo-documents/trade-cases/2012/commercial_invoice.png", label: "商业发票 X118 · 总金额", locator: { type: "IMAGE", page: 1 }, sourceText: "USD192,000.00" },
  { id: "case_2012-contract-party", sourceId: "certificate_of_origin.png", sourceType: "ORIGINAL_SCAN", sourcePath: "/demo-documents/trade-cases/2012/certificate_of_origin.png", label: "原产地证明 · 出口商", locator: { type: "IMAGE", page: 1 }, sourceText: "DAYU CUTTING TOOLS I/E CORP" },
  { id: "case_2012-risk-result", sourceId: "BANK_RISK_MOCK", sourceType: "RISK_SYSTEM", label: "银行风险系统返回", locator: { type: "JSON", jsonPath: "$.riskScreening.CASE_2012_001.status" }, sourceText: "CLEAR · 未触发预警" },
  { id: "case_2019-swift-amount", sourceId: "case_2019_mt103.txt", sourceType: "SWIFT_MT103_SIMULATED", label: "模拟SWIFT · 题目金额", locator: { type: "TEXT", line: 3 }, sourceText: ":32A:190530USD153000,00" },
  { id: "case_2019-invoice-amount", sourceId: "commercial_invoice.jpg", sourceType: "ORIGINAL_SCAN", sourcePath: "/demo-documents/trade-cases/2019/commercial_invoice.jpg", label: "商业发票 EXP2019033 · 总金额", locator: { type: "IMAGE", page: 1 }, sourceText: "USD 180,000.00" },
  { id: "case_2019-swift-payer", sourceId: "case_2019_mt103.txt", sourceType: "SWIFT_MT103_SIMULATED", label: "模拟SWIFT · 付款人", locator: { type: "TEXT", line: 4 }, sourceText: "MARCO FOERSTER GMBH" },
  { id: "case_2019-risk-result", sourceId: "BANK_RISK_MOCK", sourceType: "RISK_SYSTEM", label: "银行风险系统返回", locator: { type: "JSON", jsonPath: "$.riskScreening.CASE_2019_001.status" }, sourceText: "CLEAR · 未触发预警" },
];

// 兼容既有页面事件入口；内容仍指向本次替换后的主Case证据，不保留旧业务事实。
evidenceReferences.push(
  { id: "case_001-swift-amount", sourceId: "case_2011_pacs008.xml", sourceType: "SWIFT_MT103_SIMULATED", label: "兼容入口 · 模拟SWIFT金额", locator: { type: "TEXT", line: 3 }, sourceText: ":32A:110620USD32800,00" },
  { id: "case_001-swift-payer", sourceId: "case_2011_pacs008.xml", sourceType: "SWIFT_MT103_SIMULATED", label: "兼容入口 · 模拟SWIFT付款人", locator: { type: "TEXT", line: 4 }, sourceText: "TANJIN-DAIEI CO., LTD." },
  { id: "case_001-swift-remittance", sourceId: "case_2011_pacs008.xml", sourceType: "SWIFT_MT103_SIMULATED", label: "兼容入口 · 模拟SWIFT附言", locator: { type: "TEXT", line: 6 }, sourceText: "INV TX0522 / CONTRACT TXT264 / BLACK TEA" },
  { id: "case_001-risk-result", sourceId: "BANK_RISK_MOCK", sourceType: "RISK_SYSTEM", label: "兼容入口 · 银行风险系统", locator: { type: "JSON", jsonPath: "$.riskScreening.CASE_2011_001.status" }, sourceText: "CLEAR · 未触发预警" },
);

export function normalizeName(value) { return normalizeEntityName(value).replace(/\s/g, ""); }
export function createCase(payment) { return { id: payment.paymentId.replace("PMT", "TT-IN"), paymentId: payment.paymentId, status: "AWAITING_CUSTOMER", audit: [{ id: "LEDGER-001", caseId: payment.paymentId, timestamp: payment.receivedAt, actor: "SYSTEM", module: "PAYMENT_GATEWAY", action: "收到pacs.008报文" }] }; }
export function routeCase({ missing = false, conflict = false, modelLow = false, semanticOnly = false, riskAlert = false } = {}) { if (riskAlert) return "RISK_HANDOFF_REQUIRED"; if (conflict || modelLow) return "FULL_REVIEW"; if (missing) return "SUPPLEMENT_REQUIRED"; if (semanticOnly) return "FOCUSED_REVIEW"; return "FAST_REVIEW"; }
export { compareEntityNames, trustedDecisionGate };
