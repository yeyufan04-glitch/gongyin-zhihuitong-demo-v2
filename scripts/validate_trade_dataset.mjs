import fs from "node:fs";
import path from "node:path";

const root = path.resolve("data/datasets/trade_cases");
const ids = [];
const checks = [];
for (const year of fs.readdirSync(root).filter((name) => /^20\d\d$/.test(name)).sort()) {
  const caseDirs = fs.readdirSync(path.join(root, year)).filter((name) => name.startsWith("CASE_"));
  for (const caseId of caseDirs) {
    const dir = path.join(root, year, caseId);
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, "case_manifest.json"), "utf8"));
    const groundTruth = JSON.parse(fs.readFileSync(path.join(dir, "ground_truth.json"), "utf8"));
    const swift = JSON.parse(fs.readFileSync(path.join(dir, "generated/swift_normalized.json"), "utf8"));
    const originals = fs.readdirSync(path.join(dir, "original")).filter((name) => !name.startsWith("."));
    ids.push(manifest.case_id);
    const expectedConflict = groundTruth.expected_conflicts.some((item) => item.includes("金额"));
    const amountOk = expectedConflict ? swift.amount === manifest.transaction.amount : swift.amount === manifest.transaction.invoice_amount;
    checks.push({ case_id: manifest.case_id, original_files: originals.length, swift_amount_matches_case: swift.amount === manifest.transaction.amount, invoice_amount_matches_case_or_expected_conflict: expectedConflict ? swift.amount !== manifest.transaction.invoice_amount : manifest.transaction.invoice_amount === manifest.transaction.amount, currency_present: Boolean(manifest.transaction.currency), document_mapping_valid: manifest.documents.every((doc) => originals.includes(doc.file)), intended_conflict_recorded: expectedConflict ? swift.amount !== manifest.transaction.invoice_amount : true, comparison_rule_pass: amountOk });
  }
}
const uniqueCaseIds = new Set(ids).size === ids.length;
const allPassed = uniqueCaseIds && checks.every((item) => Object.values(item).every((value) => typeof value === "boolean" ? value : true));
const output = { generated_at: "2026-09-15", case_count: checks.length, unique_case_ids: uniqueCaseIds, all_passed: allPassed, checks, notes: ["2019金额差异是原始考试题目与商业发票之间的预期冲突，未被隐藏。", "SWIFT为SIMULATED FOR DEMO，不代表真实银行报文。"] };
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/DATA_CONSISTENCY_CHECK.json", `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output));
if (!allPassed) process.exitCode = 1;
