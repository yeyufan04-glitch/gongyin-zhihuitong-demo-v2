import { normalizeEntityName } from "./entity-normalizer.mjs";

export const mockRiskData = {
  counterparties: ["DEMO WATCHLIST TRADING LIMITED"],
  persons: ["DEMO PERSON ALPHA"],
  regions: ["DEMO REGION R-01"],
  currencies: ["DEMO RESTRICTED CURRENCY RULE"],
  goodsServices: ["SENSITIVE GOODS DEMO A"],
};

function hash(value) {
  let h1 = 0x811c9dc5;
  for (const char of String(value)) { h1 ^= char.charCodeAt(0); h1 = Math.imul(h1, 0x01000193); }
  return `demo-sha256-${(h1 >>> 0).toString(16).padStart(8, "0")}`;
}

export class MockBankRiskProvider {
  constructor(data = mockRiskData) { this.data = data; }
  async screen(request) {
    const alerts = [];
    const normalized = request.counterparties.map((item) => normalizeEntityName(item.normalizedName));
    if (normalized.some((name) => this.data.counterparties.includes(name))) alerts.push({ type: "COUNTERPARTY", matchedValue: normalized.find((name) => this.data.counterparties.includes(name)), ruleId: "MOCK-CP-001", severity: "HIGH", message: "交易对手命中内部关注规则" });
    if (request.persons?.some((person) => this.data.persons.includes(normalizeEntityName(person.normalizedName)))) alerts.push({ type: "PERSON", matchedValue: request.persons[0].normalizedName, ruleId: "MOCK-PERSON-001", severity: "HIGH", message: "人员命中内部关注规则" });
    if (request.countriesOrRegions?.some((region) => this.data.regions.includes(region))) alerts.push({ type: "COUNTRY_OR_REGION", matchedValue: request.countriesOrRegions[0], ruleId: "MOCK-REGION-001", severity: "MEDIUM", message: "地区命中内部关注规则" });
    if (request.currencies?.some((currency) => this.data.currencies.includes(currency))) alerts.push({ type: "CURRENCY_OR_ROUTE", matchedValue: request.currencies[0], ruleId: "MOCK-CURRENCY-001", severity: "MEDIUM", message: "币种或支付路径命中内部关注规则" });
    if (request.goodsOrServices?.some((service) => this.data.goodsServices.includes(service))) alerts.push({ type: "GOODS_OR_SERVICE", matchedValue: request.goodsOrServices[0], ruleId: "MOCK-GOODS-001", severity: "MEDIUM", message: "商品或服务命中内部关注规则" });
    const payload = JSON.stringify(request);
    return { provider: "BANK_RISK_MOCK", queriedAt: "2026-09-10 14:40:03", status: alerts.length ? "ALERT" : "CLEAR", alerts, requestHash: hash(payload), responseHash: hash(JSON.stringify(alerts)) };
  }
}

export class BankRiskSystemAdapter {
  async screen(request) { return new MockBankRiskProvider().screen(request); }
}
