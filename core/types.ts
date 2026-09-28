export type CaseStatus = "AWAITING_CUSTOMER" | "AWAITING_DOCUMENTS" | "AI_REVIEWING" | "FAST_REVIEW" | "FOCUSED_REVIEW" | "SUPPLEMENT_REQUIRED" | "FULL_REVIEW" | "APPROVED_BY_OPERATOR" | "APPROVED_BY_REVIEWER" | "POSTED";
export type ReviewRoute = "FAST_REVIEW" | "FOCUSED_REVIEW" | "SUPPLEMENT_REQUIRED" | "FULL_REVIEW";
export type RuleResult = "VERIFIED" | "CONFLICT" | "MISSING" | "NOT_APPLICABLE";
export type PaymentNetwork = "SWIFT" | "CIPS_MOCK";

export type EvidenceSourceType = "SWIFT_XML" | "PDF" | "IMAGE" | "RISK_SYSTEM" | "SYSTEM_RULE";
export type EvidenceLocator =
  | { type: "PDF"; page: number; bbox?: { x: number; y: number; width: number; height: number } }
  | { type: "XML"; xpath: string; lineStart?: number; lineEnd?: number }
  | { type: "JSON"; jsonPath: string };
export interface EvidenceReference { id: string; sourceId: string; sourceType: EvidenceSourceType; label: string; locator: EvidenceLocator; sourceText: string; }
export interface RiskScreeningRequest { caseId: string; counterparties: { rawName: string; normalizedName: string; country?: string }[]; persons?: { rawName: string; normalizedName: string }[]; countriesOrRegions: string[]; currencies: string[]; goodsOrServices: string[]; remittanceInfo?: string; }
export interface RiskAlert { type: "COUNTERPARTY" | "PERSON" | "COUNTRY_OR_REGION" | "CURRENCY_OR_ROUTE" | "GOODS_OR_SERVICE"; matchedValue: string; ruleId: string; severity: "LOW" | "MEDIUM" | "HIGH"; message: string; evidenceRefs?: string[]; }
export interface RiskScreeningResult { provider: string; queriedAt: string; status: "CLEAR" | "ALERT" | "UNAVAILABLE"; alerts: RiskAlert[]; requestHash: string; responseHash: string; }
export interface AuditLedgerEntry { id: string; caseId: string; sequence: number; timestamp: string; actor: "SYSTEM" | "CUSTOMER" | "AI" | "RISK_SYSTEM" | "OPERATOR" | "REVIEWER"; module: string; action: string; payloadHash: string; previousHash: string; entryHash: string; }

export interface InboundPayment { paymentId: string; uetr: string; receivedAt: string; debtorName: string; debtorBank: string; debtorCountry: string; creditorName: string; creditorAccount: string; amount: number; currency: string; remittanceInfo: string; paymentNetwork: PaymentNetwork; paymentStatus: "RECEIVED" | "PENDING_REVIEW" | "POSTED"; }
export interface DocumentRuleProfile { id: string; name: string; conditions: Record<string, string | number | boolean>; requiredDocuments: string[]; reusableDocuments: string[]; note: string; }
export interface ExtractedField { fieldName: string; value: string; sourceDocumentId: string; page: number; sourceText: string; confidence: number; bbox?: { x: number; y: number; width: number; height: number }; }
export interface AIClaim { id: string; type: "FACT" | "SEMANTIC" | "INFERENCE"; claim: string; status: "VERIFIED" | "SUPPORTED" | "UNSUPPORTED"; confidence: number; evidenceIds: string[]; modelVersion: string; }
export interface AuditEvent { id: string; caseId: string; timestamp: string; actor: string; action: string; before?: unknown; after?: unknown; }
export interface PostingInstruction { customerName: string; account: string; amount: number; currency: string; purpose: string; caseId: string; status: "DRAFT" | "POSTING_SUCCESS"; }
