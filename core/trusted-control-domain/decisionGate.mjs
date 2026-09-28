export function trustedDecisionGate({ materialsComplete, rulesPass, riskStatus, evidenceComplete, modelAuthorized = true, ruleVersionValid = true, unresolvedCount = 1 }) {
  const checks = [
    { key: "materials", label: "材料完整", result: materialsComplete ? "PASS" : "BLOCKED" },
    { key: "rules", label: "关键规则", result: rulesPass ? "PASS" : "BLOCKED" },
    { key: "risk", label: "风险系统", result: riskStatus === "CLEAR" ? "CLEAR" : riskStatus === "ALERT" ? "ALERT" : "UNAVAILABLE" },
    { key: "model", label: "模型授权", result: modelAuthorized ? "PASS" : "BLOCKED" },
    { key: "version", label: "规则版本", result: ruleVersionValid ? "PASS" : "BLOCKED" },
    { key: "evidence", label: "证据引用", result: evidenceComplete ? "PASS" : "BLOCKED" },
  ];
  if (riskStatus !== "CLEAR" || !materialsComplete || !rulesPass || !evidenceComplete) return { route: riskStatus === "ALERT" ? "RISK_HANDOFF_REQUIRED" : "SUPPLEMENT_REQUIRED", checks, unresolvedCount, riskHandoffRequired: riskStatus !== "CLEAR" };
  return { route: unresolvedCount ? "FOCUSED_REVIEW" : "FAST_REVIEW", checks, unresolvedCount, riskHandoffRequired: false };
}
