const LEGAL_FORMS = [[/\bLTD\b/gi, "LIMITED"], [/\bCO\.?\b/gi, "COMPANY"], [/\bCORP\.?\b/gi, "CORPORATION"], [/\bINC\.?\b/gi, "INCORPORATED"]];

export function normalizeEntityName(value = "") {
  let normalized = value.toUpperCase().replace(/[.,]/g, " ").replace(/\s+/g, " ").trim();
  for (const [pattern, replacement] of LEGAL_FORMS) normalized = normalized.replace(pattern, replacement);
  return normalized.replace(/\s+/g, " ").trim();
}

export function compareEntityNames(rawLeft, rawRight) {
  const left = normalizeEntityName(rawLeft);
  const right = normalizeEntityName(rawRight);
  const relation = left === right ? "HIGH" : "LOW";
  return {
    task: "ENTITY_MATCH",
    rawValues: [rawLeft, rawRight],
    normalizedValues: [left, right],
    relation,
    confidence: relation === "HIGH" ? 0.96 : 0.42,
    decision: null,
  };
}
