export const documentRuleProfiles = [
  { id: "PROFILE_A", name: "稳定客户·常规服务贸易", conditions: { customerType: "稳定客户", purpose: "服务贸易", historicalContractValid: true }, requiredDocuments: ["年度服务合同", "本次Invoice"], reusableDocuments: ["2026 Annual Enterprise Management Advisory Agreement"], note: "历史合同仍在有效期内，本次只补充当期Invoice。" },
  { id: "PROFILE_B", name: "新客户·新业务", conditions: { customerType: "新客户", purpose: "服务贸易", historicalContractValid: false }, requiredDocuments: ["合同", "本次Invoice", "业务说明"], reusableDocuments: [], note: "新客户或新业务不自动引用历史材料。" },
  { id: "PROFILE_C", name: "资金性质待确认", conditions: { customerType: "任意", purpose: "无法判断", historicalContractValid: false }, requiredDocuments: ["业务说明", "合同或其他支持材料"], reusableDocuments: [], note: "先补足能说明资金用途的材料，再进入人工审核。" },
];
export function resolveDocumentProfile(input) { if (input.purpose === "无法判断") return documentRuleProfiles[2]; if (input.customerType === "稳定客户" && input.purpose === "服务贸易" && input.historicalContractValid) return documentRuleProfiles[0]; return documentRuleProfiles[1]; }
