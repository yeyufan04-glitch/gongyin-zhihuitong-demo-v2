import { normalizeName } from "../engine.mjs";

export function entityMatch(paymentName, documentName, evidenceRefs = []) {
  const same = normalizeName(paymentName) === normalizeName(documentName);
  return { task: "ENTITY_MATCH", relation: same ? "LIKELY_SAME" : "REQUIRES_REVIEW", confidence: same ? 0.96 : 0.61, evidence: [{ paymentName, documentName }], evidenceRefs, decision: null };
}

export function purposeMatch(paymentPurpose, contractPurpose, evidenceRefs = []) {
  const related = /consulting|advisory|服务|咨询/i.test(`${paymentPurpose} ${contractPurpose}`);
  return { task: "PURPOSE_MATCH", relation: related ? "HIGHLY_RELATED" : "REQUIRES_REVIEW", confidence: related ? 0.91 : 0.58, evidence: [{ paymentPurpose, contractPurpose }], evidenceRefs, decision: null };
}

export function contractRelation({ amount, invoiceAmount, receivedDate, contractEnd, evidenceRefs = [] }) {
  const amountSupported = amount === invoiceAmount;
  const dateSupported = receivedDate <= contractEnd;
  return { task: "PAYMENT_CONTRACT_RELATION", relation: amountSupported && dateSupported ? "SUPPORTED" : "REQUIRES_REVIEW", confidence: amountSupported && dateSupported ? 0.89 : 0.62, evidence: [{ amount, invoiceAmount, receivedDate, contractEnd }], evidenceRefs, decision: null };
}
