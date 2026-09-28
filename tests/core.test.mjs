import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createCase, demoCases, demoPayments, evidenceReferences, routeCase, trustedDecisionGate } from "../core/engine.mjs";
import { parsePacs008Xml } from "../core/payment/pacs008Parser.mjs";
import { compareEntityNames, normalizeEntityName } from "../core/intelligent-domain/entity-normalizer.mjs";
import { MockBankRiskProvider } from "../core/intelligent-domain/risk-adapter.mjs";
import { buildAuditLedger, verifyAuditChain } from "../core/trusted-control-domain/auditLedger.mjs";
import { checkAmount, checkContractValidity, checkDocumentCompleteness } from "../core/rules/ruleEngine.mjs";
import { entityMatch } from "../core/semantic/tasks.mjs";
import { resolveDocumentProfile } from "../core/rules/documentRules.mjs";

test("主Case从真实pacs.008 XML解析付款人、金额、币种、附言和UETR", async () => {
  const xml = await readFile("data/swift/case_2011_pacs008.xml", "utf8");
  const parsed = parsePacs008Xml(xml, "case_2011_pacs008.xml");
  assert.equal(parsed.messageDefinition, "");
  assert.equal(parsed.payerName, "TANJIN-DAIEI CO., LTD.");
  assert.equal(parsed.amount, 32800);
  assert.equal(parsed.currency, "USD");
  assert.equal(parsed.remittanceInfo, "INV TX0522 / CONTRACT TXT264 / BLACK TEA");
  assert.equal(parsed.uetr, "SIM-2011-TX0522-001");
});

test("支付事件创建新的业务Case", () => { const result = createCase(demoPayments[0]); assert.equal(result.status, "AWAITING_CUSTOMER"); assert.equal(result.id, "TT-IN-2011-001"); });

test("实体标准化保留原始值并把LTD映射为LIMITED", () => { assert.equal(normalizeEntityName("ABC GLOBAL LTD"), "ABC GLOBAL LIMITED"); const result = compareEntityNames("ABC GLOBAL LTD", "ABC GLOBAL LIMITED"); assert.equal(result.relation, "HIGH"); assert.equal(result.decision, null); assert.ok(result.rawValues.includes("ABC GLOBAL LTD")); });

test("语义模型只输出关系，不输出审批结论", () => { const result = entityMatch("ABC GLOBAL LTD", "ABC GLOBAL LIMITED", ["case_001-swift-payer", "case_001-contract-party"]); assert.equal(result.relation, "LIKELY_SAME"); assert.deepEqual(result.evidenceRefs, ["case_001-swift-payer", "case_001-contract-party"]); assert.equal(result.decision, null); });

test("风险系统协查CLEAR来自MockBankRiskProvider", async () => { const result = await new MockBankRiskProvider().screen({ caseId: demoCases[0].id, counterparties: [{ rawName: "ABC GLOBAL LTD", normalizedName: "ABC GLOBAL LIMITED", country: "英国" }], countriesOrRegions: ["英国"], currencies: ["USD"], goodsOrServices: ["Enterprise Management Advisory Service"], remittanceInfo: "CONSULTING SERVICE SEP 2026" }); assert.equal(result.provider, "BANK_RISK_MOCK"); assert.equal(result.status, "CLEAR"); assert.deepEqual(result.alerts, []); });

test("风险系统ALERT时可信闸门必须交由既有风险流程接管", () => { const gate = trustedDecisionGate({ materialsComplete: true, rulesPass: true, riskStatus: "ALERT", evidenceComplete: true }); assert.equal(gate.route, "RISK_HANDOFF_REQUIRED"); assert.equal(gate.riskHandoffRequired, true); assert.ok(gate.checks.some((item) => item.label === "风险系统" && item.result === "ALERT")); });

test("确定性规则和动态材料规则均保留证据入口", () => { assert.equal(checkAmount(80000, 80000, ["swift", "invoice"]).result, "VERIFIED"); assert.equal(checkAmount(80000, 102000, ["swift", "invoice"]).result, "CONFLICT"); assert.equal(checkContractValidity("2026-09-10", "2026-01-01", "2026-12-31", ["contract", "swift"]).result, "VERIFIED"); assert.deepEqual(checkDocumentCompleteness(["年度服务合同", "本次Invoice"], ["年度服务合同"], ["rules"]).missing, ["本次Invoice"]); assert.equal(resolveDocumentProfile({ customerType: "稳定客户", purpose: "服务贸易", historicalContractValid: true }).id, "PROFILE_A"); assert.ok(evidenceReferences.every((item) => item.id && item.sourceText && item.locator)); });

test("审核日志构成可验证Hash Chain，篡改后校验失败", () => { const entries = buildAuditLedger([{ timestamp: "2026-09-10T14:32:01+08:00", actor: "SYSTEM", module: "PAYMENT_GATEWAY", action: "收到pacs.008报文" }, { timestamp: "2026-09-10T14:40:03+08:00", actor: "RISK_SYSTEM", module: "RISK_ADAPTER", action: "返回CLEAR" }], "TT-IN-20260910-001"); assert.equal(verifyAuditChain(entries), true); entries[1].action = "被篡改的动作"; assert.equal(verifyAuditChain(entries), false); });

test("三笔Case分别覆盖重点复核、快速复核和待补件", () => { assert.equal(routeCase({ semanticOnly: true }), "FOCUSED_REVIEW"); assert.equal(routeCase(), "FAST_REVIEW"); assert.equal(routeCase({ missing: true }), "SUPPLEMENT_REQUIRED"); assert.equal(demoCases.length, 3); });
