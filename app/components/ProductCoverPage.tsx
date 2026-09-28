"use client";

type ProductCoverPageProps = { onEnter: (role?: "customer" | "runtime") => void };

const architecture = [
  { no: "01", kind: "一底座", title: "统一业务事实底座", meta: "多源解析 · 事实融合 · 证据绑定", className: "launch-node-fact" },
  { no: "02", kind: "第一域", title: "智能作业域", meta: "规则引擎 · 智能经办 · 智能复核", className: "launch-node-smart" },
  { no: "03", kind: "第二域", title: "可信控制域", meta: "输入可信 · 计算可信 · 执行可信", className: "launch-node-control" },
  { no: "04", kind: "一闸门", title: "可信决策闸门", meta: "规则约束 · 分级路由 · 人工授权", className: "launch-node-gate" },
  { no: "05", kind: "一闭环", title: "可信审核闭环", meta: "可信日志 · 人工接管 · 全程追溯", className: "launch-node-loop" },
];

function TrustJourney() {
  const nodes = ["汇款到账", "材料提交", "智能识别", "事实核验", "可信执行", "银行复核"];
  return <div className="launch-journey" aria-label="一笔国际汇款的可信作业轨迹">
    <div className="launch-journey-head"><span>一笔国际汇款的可信作业轨迹</span><small>END-TO-END TRACE</small></div>
    <div className="launch-journey-line" />
    <div className="launch-journey-nodes">{nodes.map((node, index) => <div className={node === "可信执行" ? "journey-node current" : "journey-node"} key={node}><b>{String(index + 1).padStart(2, "0")}</b><i /><span>{node}</span>{node === "事实核验" && <small>FACT</small>}{node === "可信执行" && <small>CAV</small>}{node === "银行复核" && <small>FLOW</small>}</div>)}</div>
    <div className="launch-journey-foot"><span>从业务输入到人工复核</span><b>人工保有最终业务决定权</b></div>
  </div>;
}

// Retained as a legacy visual reference; the live homepage uses TrustJourney.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TrustArchitecturePoster() {
  return <div className="launch-poster" aria-label="CAV启发式双域可信执行架构宣传图">
    <div className="launch-poster-topline">
      <span>可信汇款执行路径</span>
      <b>CAV · 01—05</b>
    </div>

    <div className="launch-poster-word" aria-hidden="true">可信</div>
    <div className="launch-orbit launch-orbit-outer" aria-hidden="true" />
    <div className="launch-orbit launch-orbit-inner" aria-hidden="true" />
    <div className="launch-route-axis" aria-hidden="true"><i /><i /><i /></div>

    <div className="launch-parties" aria-label="四方协同">
      <span>企业客户</span><i>→</i><span>银行经办</span><i>→</i><span>银行复核</span><i>→</i><span>智能系统</span>
    </div>

    <div className="launch-architecture-map">
      {architecture.map((item) => <article className={`launch-arch-node ${item.className}`} key={item.no}>
        <span>{item.no}</span>
        <div><small>{item.kind}</small><strong>{item.title}</strong><p>{item.meta}</p></div>
      </article>)}
    </div>

    <div className="launch-poster-summary">
      <span>事实</span><i />
      <span>判断</span><i />
      <span>控制</span><i />
      <span>执行</span><i />
      <span>追溯</span>
    </div>
    <p className="launch-poster-safety"><i /> 人工保有最终业务决定权</p>
  </div>;
}

export function ProductCoverPage({ onEnter }: ProductCoverPageProps) {
  return <main className="launch-cover">
    <div className="launch-paper-grid" aria-hidden="true" />
    <div className="launch-red-field" aria-hidden="true" />
    <div className="launch-corner-code" aria-hidden="true">CAV / TRUSTED REMITTANCE</div>

    <header className="launch-header">
      <div className="launch-brand">
        <span className="launch-brand-mark">工</span>
        <div><strong>武汉理工大学</strong></div>
      </div>
      <div className="launch-competition"><span>2026届“工行杯”</span><b>全国大学生金融科技创新大赛</b></div>
    </header>

    <section className="launch-copy">
      <p className="launch-eyebrow">国际汇款智能作业</p>
      <h1>工银智汇通</h1>
      <h2>企业国际汇款可信智能作业平台</h2>
      <div className="launch-statement">
        <span>让每一笔境外汇款</span>
        <strong>始于事实，行于可信。</strong>
      </div>
      <p className="launch-description">贯通汇款通知、材料提交、智能识别、事实核验与银行复核，让国际汇款作业更高效、更可信、更可追溯。</p>

      <div className="launch-capabilities" aria-label="四项核心能力">
        <span>智能识别</span><span>事实核验</span><span>可信执行</span><span>全程留痕</span>
      </div>

      <div className="launch-actions">
        <button className="launch-enter" onClick={() => onEnter("customer")}><span>进入系统</span><b>→</b></button>
        <button className="launch-runtime" onClick={() => onEnter("runtime")}><span>查看系统运行</span><b>↗</b></button>
        <p><i /> 竞赛演示环境<br /><span>模拟数据 · 全程留痕</span></p>
      </div>
    </section>

    <section className="launch-visual">
      <TrustJourney />
    </section>

    <footer className="launch-footer">
      <span>企业客户</span><i /> <span>银行经办</span><i /> <span>银行复核</span><i /> <span>智能系统</span>
      <b>从业务输入到人工复核，全程清晰可追溯</b>
    </footer>
  </main>;
}
