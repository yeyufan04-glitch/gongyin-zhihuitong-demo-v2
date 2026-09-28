import fs from "node:fs";
import path from "node:path";

const root = path.resolve(decodeURIComponent(new URL("..", import.meta.url).pathname), "data/datasets/trade_cases");
const cases = [
  { year: "2011", id: "CASE_2011_001", exporter: "SUZHOU IMPORT & EXPORT TRADE CORPORATION", importer: "TANJIN-DAIEI CO., LTD.", currency: "USD", amount: 32800, invoiceNo: "TX0522", contractNo: "TXT264", lcNo: "XT173", goods: "BLACK TEA", quantity: "330KGS", tradeTerm: "CIF OSAKA / L/C AT SIGHT", shipment: "SUZHOU PORT → OSAKA PORT", shipmentDate: "2010-06-20", route: "GOLDEN_CASE", docs: ["commercial_invoice", "packing_list"], missing: [], conflicts: [] },
  { year: "2012", id: "CASE_2012_001", exporter: "DAYU CUTTING TOOLS I/E CORP", importer: "FAR EASTERN TRADING COMPANY LIMITED", currency: "USD", amount: 192000, invoiceNo: "X118", contractNo: "MK007", lcNo: "41-19-03", goods: "CUTTING TOOLS", quantity: "1500 SETS", tradeTerm: "CIF NEW YORK", shipment: "TIANJIN → HONG KONG → NEW YORK", shipmentDate: "2011-05-20", route: "FAST_REVIEW", docs: ["commercial_invoice", "insurance", "certificate_of_origin"], missing: ["packing_list"], conflicts: ["保险单包装单位500 CARTONS与原产地证明500 CARTONS，数量字段需人工复核"] },
  { year: "2013", id: "CASE_2013_001", exporter: "TIANJIN TECHSUN CO., LTD.", importer: "VESTE BEYAS ESYE SAN. TICAS ORGANIZE SANAYI BOLGEST", currency: "USD", amount: 240000, invoiceNo: "TECH126", contractNo: "TECH1305", lcNo: "901LC2519031", goods: "CONDENSER", quantity: "20000PCS", tradeTerm: "CIF IZMIR", shipment: "TIANJIN → IZMIR", shipmentDate: "2013-05-12", route: "PARTIAL", docs: ["commercial_invoice", "bill_of_exchange", "packing_list"], missing: ["transport_document"], conflicts: [] },
  { year: "2014", id: "CASE_2014_001", exporter: "SHANGHAI ANDYS TRADING CO., LTD.", importer: "HAZZE AB HOLDING", currency: "USD", amount: 27500, invoiceNo: "AD2013011", contractNo: "AD13007", lcNo: "BCN1008675", goods: "GAS DETECTORS", quantity: "100PCS", tradeTerm: "FOB SHANGHAI / L/C AT SIGHT", shipment: "SHANGHAI → STOCKHOLM", shipmentDate: "2013-07-20", route: "PARTIAL", docs: ["commercial_invoice", "packing_list", "shipping_note"], missing: ["bill_of_lading"], conflicts: [] },
  { year: "2015", id: "CASE_2015_001", exporter: "SHENZHEN ESHOW CO., LTD.", importer: "MARCO FOERSTER GMBH", currency: "USD", amount: 153000, invoiceNo: "E140519872", contractNo: "E14052115", lcNo: "LC147900931", goods: "RETEVIS BRAND RT628 PORTABLE WALKIE TALKIE", quantity: "10000 PCS", tradeTerm: "CFR HAMBURG / L/C", shipment: "SHENZHEN → HAMBURG", shipmentDate: "2014-08-30", route: "PARTIAL", docs: ["commercial_invoice", "packing_list", "shipping_note"], missing: ["bill_of_exchange"], conflicts: [] },
  { year: "2016", id: "CASE_2016_001", exporter: "SUNSHINE TRADING CORP.", importer: "JOYFAIR TRADING CORP.", currency: "USD", amount: 79960, invoiceNo: "EXP2015001", contractNo: "STE0518", lcNo: "DBS963/FR", goods: "100% COTTON SHIRT", quantity: "4000PCS", tradeTerm: "CIF NEW YORK / L/C AT SIGHT", shipment: "TIANJIN → NEW YORK", shipmentDate: "2015-09-20", route: "PARTIAL", docs: ["business_prompt", "commercial_invoice", "bill_of_exchange", "beneficiary_certificate"], missing: ["packing_list"], conflicts: [] },
  { year: "2017", id: "CASE_2017_001", exporter: "SHANGHAI GUANGDA CO., LTD.", importer: "JOYFAIR TRADING CORP.", currency: "GBP", amount: 96000, invoiceNo: "AE9633-9", contractNo: "AE9633", lcNo: "SKY3699", goods: "RETEVIS BRAND RT628 PORTABLE WALKIE TALKIE", quantity: "10000 PCS", tradeTerm: "CFR LONDON / L/C", shipment: "SHANGHAI → LONDON", shipmentDate: "2016-09-27", route: "PARTIAL", docs: ["business_prompt", "commercial_invoice", "packing_list"], missing: ["bill_of_lading"], conflicts: [] },
  { year: "2018", id: "CASE_2018_001", exporter: "SHANGHAI CHENGYUAN TRADING CO., LTD.", importer: "MATHILDE EUROPE GMBH", currency: "USD", amount: 75780, invoiceNo: "DS1800681", contractNo: "DS1808022", lcNo: "LLC189110987", goods: "CULT LARGE SHOPPING FELT", quantity: "3000 PCS", tradeTerm: "CIF FRANKFURT / L/C AT SIGHT", shipment: "SHANGHAI → FRANKFURT", shipmentDate: "2018-11-20", route: "PARTIAL", docs: ["business_prompt", "commercial_invoice", "bill_of_exchange"], missing: ["packing_list"], conflicts: [] },
  { year: "2019", id: "CASE_2019_001", exporter: "TIANJIN ESHOW CO., LTD.", importer: "MARCO FOERSTER GMBH", currency: "USD", amount: 153000, invoiceAmount: 180000, invoiceNo: "EXP2019033", contractNo: "EXP0905033", lcNo: "TK24680", goods: "RETEVIS BRAND RT628 PORTABLE WALKIE TALKIE", quantity: "10000 PCS", tradeTerm: "CFR HAMBURG / L/C AT SIGHT", shipment: "TIANJIN → HAMBURG", shipmentDate: "2019-05-30", route: "CONFLICT", docs: ["business_prompt", "commercial_invoice", "shipping_note"], missing: ["packing_list"], conflicts: ["题目32B金额USD 153,000与商业发票USD 180,000不一致"] },
];

function writeJson(file, value) { fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }
for (const item of cases) {
  const dir = path.join(root, item.year, item.id);
  const originalDir = path.join(dir, "original");
  const generatedDir = path.join(dir, "generated");
  fs.mkdirSync(generatedDir, { recursive: true });
  const originalFiles = fs.readdirSync(originalDir).filter((name) => !name.startsWith("."));
  const documents = originalFiles.map((name) => ({ file: name, document_type: /发票|invoice/i.test(name) ? "commercial_invoice" : /装箱|packing/i.test(name) ? "packing_list" : /保险|insurance/i.test(name) ? "insurance_policy" : /原产地|origin/i.test(name) ? "certificate_of_origin" : /汇票|exchange/i.test(name) ? "bill_of_exchange" : /装运|shipping/i.test(name) ? "shipping_note" : /业务|prompt/i.test(name) ? "business_prompt" : "supporting_document", source_type: "international_business_document_exam", source_year: item.year }));
  const effectiveAmount = item.invoiceAmount ?? item.amount;
  const fields = [
    ["exporter", item.exporter, documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
    ["importer", item.importer, documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
    ["invoice_no", item.invoiceNo, documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
    ["contract_no", item.contractNo, documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
    ["lc_no", item.lcNo, documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
    ["currency", item.currency, documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
    ["amount", effectiveAmount, documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
    ["goods", item.goods, documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
    ["quantity", item.quantity, documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
    ["shipment", item.shipment, documents.find((doc) => doc.document_type === "shipping_note")?.file ?? documents.find((doc) => doc.document_type === "commercial_invoice")?.file],
  ].map(([field, value, source_document]) => ({ field, value, confidence: value ? "high" : "low", evidence: source_document ? [{ document: source_document, field }] : [] }));
  const manifest = { case_id: item.id, scenario: "cross_border_trade_remittance", source: { type: "international_business_document_exam", year: item.year }, parties: { exporter: item.exporter, importer: item.importer, remitter: item.importer, beneficiary: item.exporter }, transaction: { currency: item.currency, amount: item.amount, invoice_amount: item.invoiceAmount ?? item.amount, contract_no: item.contractNo, invoice_no: item.invoiceNo, lc_no: item.lcNo, goods: item.goods, quantity: item.quantity, trade_term: item.tradeTerm }, shipment: { route: item.shipment, shipment_date: item.shipmentDate }, documents, evidence_fields: fields, system_route: item.route };
  const swift = { message_type: "MT103", synthetic: true, demo_label: "SIMULATED FOR DEMO", transaction_reference: `DEMO${item.year}${item.invoiceNo.replace(/[^A-Z0-9]/gi, "")}`, currency: item.currency, amount: item.amount, ordering_customer: item.importer, beneficiary: item.exporter, remittance_information: `INV ${item.invoiceNo} / CONTRACT ${item.contractNo} / ${item.goods}` };
  const groundTruth = { expected_document_types: item.docs, expected_fields: Object.fromEntries(fields.map((field) => [field.field, field.value])), expected_conflicts: item.conflicts, expected_missing_evidence: item.missing, expected_ese_status: item.missing.length || item.conflicts.length ? "PARTIAL" : "COMPLETE", expected_human_review: item.route !== "FAST_REVIEW" || item.conflicts.length > 0 };
  const mockExternal = { synthetic: true, purpose: "competition demo", case_id: item.id, risk_screening: { provider: "BANK_RISK_MOCK", status: "CLEAR", note: "不代表真实银行或监管接口" }, customs: { status: "NOT_CONNECTED", note: "未把模拟海关数据包装成真实接口" } };
  const swiftText = [`SIMULATED FOR DEMO · MT103`, `:20:DEMO${item.year}${item.invoiceNo.replace(/[^A-Z0-9]/gi, "")}`, `:32A:${item.shipmentDate.replace(/-/g, "").slice(2)}${item.currency}${item.amount.toFixed(2).replace(".", ",")}`, `:50K:${item.importer}`, `:59:${item.exporter}`, `:70:INV ${item.invoiceNo} / CONTRACT ${item.contractNo} / ${item.goods}`, `:71A:OUR`].join("\n");
  writeJson(path.join(dir, "case_manifest.json"), manifest);
  writeJson(path.join(dir, "ground_truth.json"), groundTruth);
  writeJson(path.join(generatedDir, "swift_normalized.json"), swift);
  writeJson(path.join(generatedDir, "mock_external_data.json"), mockExternal);
  fs.writeFileSync(path.join(generatedDir, "swift_mt103.txt"), `${swiftText}\n`);
}

writeJson(path.join(root, "dataset-index.json"), { title: "贸证贯通真实风格考试单据 Trade Case 数据集", source_directory: "/Users/yeatss/Desktop/工行杯/9.13/单据资料", synthetic_boundary: "SWIFT、风险与海关接口数据均为演示构造；原始图片保留为证据源。", cases: cases.map(({ year, id, amount, invoiceAmount, currency, route, docs }) => ({ year, id, amount, invoiceAmount: invoiceAmount ?? amount, currency, route, documents: docs })) });
