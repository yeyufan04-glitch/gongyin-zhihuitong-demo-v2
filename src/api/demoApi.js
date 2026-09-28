const API_BASE_URL = (typeof window !== "undefined" && window.__DEMO_API_BASE_URL__) || import.meta?.env?.VITE_DEMO_API_BASE_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || "演示服务暂不可用");
  return payload.data ?? payload;
}

export const createDemoCase = (templateCaseId = "C03") => request("/api/demo/cases", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ templateCaseId }) });

export const uploadInvoice = (caseId, file) => {
  const form = new FormData();
  form.append("documentType", "COMMERCIAL_INVOICE");
  form.append("file", file);
  return request(`/api/demo/cases/${encodeURIComponent(caseId)}/upload`, { method: "POST", body: form });
};

export const analyzeCase = (caseId) => request(`/api/demo/cases/${encodeURIComponent(caseId)}/analyze`, { method: "POST" });
export const getCaseSummary = (caseId) => request(`/api/demo/cases/${encodeURIComponent(caseId)}/summary`);
export const executeAction = (caseId, body) => request(`/api/demo/cases/${encodeURIComponent(caseId)}/actions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
export const resetDemo = (caseId) => request("/api/demo/reset", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ caseId }) });
