export class MockDocumentAIProvider {
  constructor() { this.name = "MockDocumentAIProvider"; this.mode = "MOCK"; }
  async extract(document) { return { provider: this.name, documentId: document.id, fields: document.fields ?? [], note: "本地模拟抽取，不调用外部模型" }; }
}

export class RealDocumentAIProvider {
  constructor({ apiKey, model = "未配置" } = {}) { this.apiKey = apiKey; this.model = model; this.name = "RealDocumentAIProvider"; this.mode = "REAL"; }
  async extract() { if (!this.apiKey) throw new Error("未配置API Key，应该由上层降级到MockDocumentAIProvider"); return { provider: this.name, model: this.model, note: "真实模式适配层占位，需在受控环境接入实际服务" }; }
}

export function createDocumentAIProvider(env = {}) { return env.OPENAI_API_KEY ? new RealDocumentAIProvider(env) : new MockDocumentAIProvider(); }
