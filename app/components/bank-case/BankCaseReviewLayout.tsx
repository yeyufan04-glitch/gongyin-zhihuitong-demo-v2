/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export interface EvidenceViewState {
  mode: "SINGLE" | "COMPARE";
  evidenceIds: string[];
  activeEvidenceId?: string;
  highlightId?: string;
}

function makeEvidenceById(prefix: string) {
  return { swiftAmount: `${prefix}-swift-amount`, invoiceAmount: `${prefix}-invoice-amount`, swiftParty: `${prefix}-swift-payer`, contractParty: `${prefix}-contract-party`, contractDate: `${prefix}-invoice-date`, contractService: `${prefix}-contract-service`, swiftService: `${prefix}-swift-remittance`, risk: `${prefix}-risk-result` };
}

export function BankCaseReviewLayout({ role, activeCase, activePayment, parsedPayment, selectedEvidence, selectEvidence, operatorDone, setOperatorDone, reviewerDone, setReviewerDone, posted, setPosted }: any) {
  const evidenceById = makeEvidenceById(activeCase.evidencePrefix ?? "case_2011");
  const isCase3 = activeCase.evidencePrefix === "case_2019";
  const defaultEvidenceId = evidenceById.swiftAmount;
  const [view, setView] = useState<EvidenceViewState>({ mode: "SINGLE", evidenceIds: [selectedEvidence?.id || defaultEvidenceId], activeEvidenceId: selectedEvidence?.id || defaultEvidenceId });
  const [postingOpen, setPostingOpen] = useState(false);
  const [operatorChoice, setOperatorChoice] = useState("同一交易主体");

  const openSingle = (id: string) => { selectEvidence(id); setView({ mode: "SINGLE", evidenceIds: [id], activeEvidenceId: id, highlightId: id }); };
  const openCompare = (...ids: string[]) => { selectEvidence(ids[0]); setView({ mode: "COMPARE", evidenceIds: ids, activeEvidenceId: ids[0], highlightId: ids[0] }); };
  const payer = parsedPayment.payerName || activePayment.debtorName;
  const amount = `${activeCase.currency} ${activeCase.amount.toLocaleString()}.00`;
  const checkRows = isCase3
    ? [{ label: "金额一致性", result: "冲突", tone: "red", detail: `${activeCase.currency} ${activeCase.amount.toLocaleString()}.00 / ${activeCase.currency} ${activeCase.invoiceAmount.toLocaleString()}.00`, ids: [evidenceById.swiftAmount, evidenceById.invoiceAmount] }, { label: "币种一致性", result: "一致", tone: "green", detail: `${activeCase.currency} / ${activeCase.currency}`, ids: [evidenceById.swiftAmount] }, { label: "风险系统协查", result: "未触发预警", tone: "green", detail: "银行风险系统返回 CLEAR", ids: [evidenceById.risk] }]
    : [
      { label: "金额一致性", result: "一致", tone: "green", detail: amount, ids: [evidenceById.swiftAmount, evidenceById.invoiceAmount] },
      { label: "币种一致性", result: "一致", tone: "green", detail: "USD / USD", ids: [evidenceById.swiftAmount, evidenceById.invoiceAmount] },
      { label: "付款方主体", result: "待确认", tone: "amber", detail: `${payer} ↔ ${activeCase.contractParty}`, ids: [evidenceById.swiftParty, evidenceById.contractParty] },
      { label: "单据日期", result: "一致", tone: "green", detail: "原始发票日期与装运信息可追溯", ids: [evidenceById.contractDate] },
      { label: "材料完整性", result: "通过", tone: "green", detail: `${activeCase.documents.join(" + ")}`, ids: [evidenceById.contractParty, evidenceById.invoiceAmount] },
      { label: "交易用途", result: "高度匹配", tone: "green", detail: `${activeCase.service} ↔ 贸易背景`, ids: [evidenceById.swiftService, evidenceById.contractService, evidenceById.invoiceAmount] },
      { label: "风险系统协查", result: "未触发预警", tone: "green", detail: "银行风险系统返回 CLEAR", ids: [evidenceById.risk] },
    ];

  return <div className="bank-case-shell">
    <section className="case-header bank-case-header"><div><span className="eyebrow light-eyebrow">{role === "reviewer" ? "银行复核 · Case" : "银行经办 · Case"}</span><h2>{activeCase.id}</h2><p>{activeCase.customerName}<i>·</i>{amount}</p></div><div className="case-head-status"><span>审核路由</span><strong>{activeCase.route === "FOCUSED_REVIEW" ? "重点复核" : activeCase.route === "SUPPLEMENT_REQUIRED" ? "待客户补件" : "快速复核"}</strong><small>{isCase3 ? "材料金额冲突，禁止正常流转" : "AI已完成7项自动核验，保留1项人工确认"}</small></div></section>
    <section className="bank-review-grid">
      <main className="review-workspace">
        <section className="panel review-info"><div className="panel-head"><div><span className="eyebrow red-eyebrow">汇款摘要</span><h3>原始支付与客户材料</h3></div></div><div className="detail-grid compact"><Fact label="付款人 · XML解析" value={payer} onClick={() => openSingle(evidenceById.swiftParty)} /><Fact label="收款人" value={parsedPayment.beneficiaryName || activePayment.creditorName} /><Fact label="金额" value={amount} onClick={() => openSingle(evidenceById.swiftAmount)} /><Fact label="汇款附言" value={parsedPayment.remittanceInfo || activePayment.remittanceInfo} onClick={() => openSingle(evidenceById.swiftService)} /><Fact label="资金性质" value="服务贸易" /><Fact label="来源报文" value="pacs.008.001.08 XML" onClick={() => openSingle(defaultEvidenceId)} /></div><div className="review-confirm-row"><Pill tone="blue">证据驱动</Pill><span>关键事实可直接定位到原始SWIFT、合同、Invoice或风险系统返回。</span></div></section>
        <section className="panel precheck-panel"><div className="panel-head"><div><span className="eyebrow red-eyebrow">智能预审</span><h3>{role === "reviewer" ? "自动核验结果与经办确认" : "规则核验与AI辅助判断"}</h3></div><Pill tone={isCase3 ? "red" : "amber"}>{isCase3 ? "待补件" : "重点复核"}</Pill></div><div className="check-list">{checkRows.map((row) => <div className="evidence-check" key={row.label}><button className="check-row" onClick={() => row.ids.length > 1 ? openCompare(...row.ids) : openSingle(row.ids[0])}><span className="check-label">{row.label}</span><strong>{row.detail}</strong><Pill tone={row.tone}>{row.result}</Pill><span className="evidence-link">查看证据 ›</span></button>{!isCase3 && row.label === "金额一致性" && <div className="check-inline-links"><button onClick={() => openSingle(evidenceById.swiftAmount)}>SWIFT {amount}</button><span>=</span><button onClick={() => openSingle(evidenceById.invoiceAmount)}>Invoice {amount}</button></div>}{!isCase3 && row.label === "付款方主体" && <div className="check-inline-links"><button onClick={() => openSingle(evidenceById.swiftParty)}>{payer}</button><span>↔</span><button onClick={() => openSingle(evidenceById.contractParty)}>{activeCase.contractParty}</button></div>}</div>)}</div><div className="review-ai-boundary"><b>AI边界：</b>规则结果和AI语义关系均可查看证据；AI不能直接触发真实入账。</div></section>
      </main>
      <EvidenceSidePanel view={view} evidenceById={evidenceById} activeCase={activeCase} />
    </section>
    {role === "operator" ? <OperatorActionPanel isCase3={isCase3} activeCase={activeCase} payer={payer} choice={operatorChoice} setChoice={setOperatorChoice} operatorDone={operatorDone} setOperatorDone={setOperatorDone} /> : <ReviewerActionPanel isCase3={isCase3} operatorDone={operatorDone} reviewerDone={reviewerDone} setReviewerDone={setReviewerDone} onPost={() => setPostingOpen(true)} onReturn={() => setOperatorDone(false)} />}
    {postingOpen && <PostingConfirmModal activeCase={activeCase} activePayment={activePayment} onCancel={() => setPostingOpen(false)} onConfirm={() => { setReviewerDone(true); setPosted(true); setPostingOpen(false); }} posted={posted} />}
  </div>;
}

function Fact({ label, value, onClick }: any) { return onClick ? <button type="button" className="fact-link" onClick={onClick}><span>{label}</span><strong>{value}</strong></button> : <div><span>{label}</span><strong>{value}</strong></div>; }
function Pill({ tone, children }: any) { return <span className={`status-pill ${tone}`}><i />{children}</span>; }

function EvidenceSidePanel({ view, evidenceById, activeCase }: { view: EvidenceViewState; evidenceById: Record<string, string>; activeCase: any }) {
  const labels: Record<string, string> = { [evidenceById.swiftAmount]: "模拟SWIFT · 结算金额", [evidenceById.invoiceAmount]: "原始商业发票 · 总金额", [evidenceById.swiftParty]: "模拟SWIFT · 付款方主体", [evidenceById.contractParty]: "原始单据 · 交易主体", [evidenceById.contractDate]: "原始单据 · 日期", [evidenceById.contractService]: "原始单据 · 货物", [evidenceById.swiftService]: "模拟SWIFT · 汇款附言", [evidenceById.risk]: "银行风险系统 · 原始返回" };
  return <aside className="evidence-side-column"><div className="evidence-side-head"><div><span className="eyebrow red-eyebrow">原始证据</span><h3>{view.mode === "COMPARE" ? "证据比对" : labels[view.activeEvidenceId || ""]}</h3><small>{view.mode === "COMPARE" ? "关键字段并列核验" : "证据定位已开启"}</small></div><Pill tone="blue">{view.mode === "COMPARE" ? "比对" : (view.activeEvidenceId || "").includes("risk") ? "风险系统" : (view.activeEvidenceId || "").includes("swift") ? "模拟MT103" : "原始扫描件"}</Pill></div><div className={view.mode === "COMPARE" ? "evidence-viewer compare" : "evidence-viewer"}>{view.mode === "COMPARE" ? view.evidenceIds.map((id) => <EvidenceCard key={id} id={id} evidenceById={evidenceById} activeCase={activeCase} />) : <EvidenceCard id={view.activeEvidenceId || view.evidenceIds[0]} evidenceById={evidenceById} activeCase={activeCase} />}</div></aside>;
}

function EvidenceCard({ id, evidenceById, activeCase }: { id: string; evidenceById: Record<string, string>; activeCase: any }) {
  const xml = id.includes("swift"); const risk = id.includes("risk");
  const text: Record<string, string> = { [evidenceById.swiftAmount]: `<IntrBkSttlmAmt Ccy="${activeCase.currency}">${activeCase.amount.toFixed(2)}</IntrBkSttlmAmt>`, [evidenceById.invoiceAmount]: `TOTAL AMOUNT: ${activeCase.currency} ${(activeCase.invoiceAmount ?? activeCase.amount).toLocaleString()}.00`, [evidenceById.swiftParty]: `<Dbtr><Nm>${activeCase.country === "日本" ? "TANJIN-DAIEI CO., LTD." : activeCase.country === "德国" ? "MARCO FOERSTER GMBH" : "FAR EASTERN TRADING COMPANY LIMITED"}</Nm></Dbtr>`, [evidenceById.contractParty]: `TRADE PARTY: ${activeCase.contractParty}`, [evidenceById.contractDate]: `Trade date: ${activeCase.shipmentDate ?? "原始单据日期"}`, [evidenceById.contractService]: `Goods: ${activeCase.service}`, [evidenceById.swiftService]: `<Ustrd>${activeCase.service}</Ustrd>` };
  if (risk) return <div className="risk-evidence-card"><span>风险系统查询原始返回</span><dl><div><dt>交易对手</dt><dd>{activeCase.contractParty}</dd></div><div><dt>币种</dt><dd>{activeCase.currency}</dd></div><div><dt>业务</dt><dd>{activeCase.service}</dd></div><div><dt>Provider</dt><dd>BANK_RISK_MOCK</dd></div><div><dt>Result</dt><dd className="green-text">CLEAR · 未触发预警</dd></div><div><dt>Queried At</dt><dd>演示时间</dd></div></dl><p>该结果来自银行风险系统；AI不重新解释或解除风险结论。</p></div>;
  if (xml) return <div className="xml-evidence-card"><div className="viewer-toolbar"><span>SWIFT XML 原始报文</span><span>证据定位</span></div><pre><span>&lt;FIToFICstmrCdtTrf&gt;</span><mark>{text[id]}</mark><span>&lt;/FIToFICstmrCdtTrf&gt;</span></pre><p>文本锚点已定位到本条证据。</p></div>;
  const imagePath = activeCase.evidencePrefix === "case_2011" ? (id === evidenceById.contractParty ? "./demo-documents/trade-cases/2011/packing_list.jpg" : "./demo-documents/trade-cases/2011/commercial_invoice.jpg") : activeCase.evidencePrefix === "case_2012" ? (id === evidenceById.contractParty ? "./demo-documents/trade-cases/2012/certificate_of_origin.png" : "./demo-documents/trade-cases/2012/commercial_invoice.png") : id === evidenceById.contractParty ? "./demo-documents/trade-cases/2019/shipping_note.jpg" : "./demo-documents/trade-cases/2019/commercial_invoice.jpg";
  return <div className="pdf-evidence-card original-scan"><div className="viewer-toolbar"><span>原始扫描件</span><span>证据定位</span></div><img src={imagePath} alt="考试原始单据扫描件" /><p>{activeCase.issue}</p></div>;
}

function OperatorActionPanel({ isCase3, activeCase, payer, choice, setChoice, operatorDone, setOperatorDone }: any) { return <section className="decision-panel operator-panel"><div><span className="eyebrow red-eyebrow">人工执行</span><h3>{isCase3 ? "金额冲突处理" : "人工待确认 · 1项"}</h3><p>{isCase3 ? "Invoice金额与汇款金额不一致，需客户补件后重新进入审核。" : "付款方主体名称需要银行经办确认。"}</p></div>{!isCase3 && <div className="decision-comparison"><span>SWIFT：<b>{payer}</b></span><span>单据主体：<b>{activeCase.contractParty}</b></span><span>标准化：<b>{activeCase.contractParty}</b></span><span>AI判断：<b>仅作辅助，不替代审批</b></span></div>}<div className="decision-options">{isCase3 ? <button className="outline" onClick={() => setOperatorDone(false)}>要求客户补充材料</button> : <><label><input type="radio" checked={choice === "同一交易主体"} onChange={() => setChoice("同一交易主体")} /> 确认为同一交易主体</label><label><input type="radio" checked={choice === "补充说明"} onChange={() => setChoice("补充说明")} /> 要求客户补充说明</label></>}</div><button className="primary decision-submit" disabled={isCase3 || operatorDone} onClick={() => setOperatorDone(true)}>{operatorDone ? "已提交复核 ✓" : "提交复核"}</button></section>; }

function ReviewerActionPanel({ isCase3, operatorDone, reviewerDone, setReviewerDone, onPost, onReturn }: any) { return <section className="decision-panel reviewer-panel"><div><span className="eyebrow red-eyebrow">复核执行</span><h3>{isCase3 ? "待客户补件" : "经办结论待复核"}</h3><p>{isCase3 ? "金额冲突尚未消除，复核不得通过。" : operatorDone ? "经办人员已确认付款方为同一交易主体。" : "等待经办完成确认。"}</p></div><div className="decision-comparison"><span>经办人员：<b>李经理</b></span><span>经办时间：<b>{operatorDone ? "14:43" : "等待确认"}</b></span><span>自动核验：<b>7项</b></span><span>风险系统：<b>未触发预警</b></span></div><div className="decision-actions"><button className="outline" disabled={!operatorDone || isCase3} onClick={onReturn}>退回经办</button><button className="primary" disabled={!operatorDone || isCase3 || reviewerDone} onClick={() => { setReviewerDone(true); onPost(); }}>{reviewerDone ? "复核通过 ✓" : "复核通过"}</button></div></section>; }

function PostingConfirmModal({ activeCase, activePayment, onCancel, onConfirm, posted }: any) { return <div className="posting-modal-backdrop" role="dialog" aria-modal="true" aria-label="入账确认"><section className="posting-modal"><span className="eyebrow red-eyebrow">入账确认</span><h3>{posted ? "入账已完成" : "确认提交Mock核心系统"}</h3><div className="posting-modal-grid"><span>企业<b>{activeCase.customerName}</b></span><span>账户<b>{activePayment.creditorAccount}</b></span><span>币种<b>{activePayment.currency}</b></span><span>金额<b>{activePayment.amount.toLocaleString()}.00</b></span><span>业务性质<b>{activeCase.purpose}</b></span><span>Case<b>{activeCase.id}</b></span></div><div className="modal-actions"><button className="outline" onClick={onCancel}>取消</button><button className="primary" disabled={posted} onClick={onConfirm}>{posted ? "已入账 ✓" : "确认入账"}</button></div></section></div>; }
