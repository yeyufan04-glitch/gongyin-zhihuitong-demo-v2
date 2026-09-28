export function governModelOutput(text) { const forbidden = /入账|通过|审批|批准支付|自动清算/; return forbidden.test(text) ? { status: "NOT_ALLOWED_BUSINESS_DECISION", text } : { status: "ALLOWED_EVIDENCE_ONLY", text }; }
export function makeClaim({ id, type, claim, status, confidence, evidenceIds, modelVersion }) { return { id, type, claim, status, confidence, evidenceIds, modelVersion }; }
