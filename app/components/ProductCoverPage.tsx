"use client";

type ProductCoverPageProps = { onEnter: () => void };

const architecture = [
  { no: "01", kind: "一底座", title: "统一业务事实底座", meta: "多源解析 · 事实融合 · 证据绑定", className: "launch-node-fact" },
  { no: "02", kind: "第一域", title: "智能作业域", meta: "规则引擎 · 智能经办 · 智能复核", className: "launch-node-smart" },
  { no: "03", kind: "第二域", title: "可信控制域", meta: "输入可信 · 计算可信 · 执行可信", className: "launch-node-control" },
  { no: "04", kind: "一闸门", title: "可信决策闸门", meta: "规则约束 · 分级路由 · 人工授权", className: "launch-node-gate" },
  { no: "05", kind: "一闭环", title: "可信审核闭环", meta: "可信日志 · 人工接管 · 全程追溯", className: "launch-node-loop" },
];

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
        <div><strong>工商银行</strong><i /> <span>金融科技创新</span></div>
      </div>
      <div className="launch-competition"><span>2026届“工行杯”</span><b>全国大学生金融科技创新大赛</b></div>
    </header>

    <section className="launch-copy">
      <p className="launch-eyebrow">CAV启发式双域可信执行架构</p>
      <h1>工银智汇通</h1>
      <h2>企业国际汇款可信智能作业平台</h2>
      <div className="launch-statement">
        <span>让每一笔境外汇款</span>
        <strong>始于事实，行于可信。</strong>
      </div>
      <p className="launch-description">贯通境外汇款通知、材料提交、智能审核与银行复核，让标准业务更高效，让智能判断有依据、受约束、可追溯。</p>

      <div className="launch-formula" aria-label="两域一底座一闸门一闭环">
        <small>核心技术架构</small>
        <strong>两域</strong><i>·</i><strong>一底座</strong><i>·</i><strong>一闸门</strong><i>·</i><strong>一闭环</strong>
      </div>

      <div className="launch-actions">
        <button className="launch-enter" onClick={onEnter}><span>进入系统</span><b>→</b></button>
        <p><i /> 竞赛演示环境<br /><span>模拟数据 · 全程留痕</span></p>
      </div>
    </section>

    <section className="launch-visual">
      <TrustArchitecturePoster />
    </section>

    <footer className="launch-footer">
      <span>企业客户</span><i /> <span>银行经办</span><i /> <span>银行复核</span><i /> <span>智能系统</span>
      <b>四方协同贯通企业国际汇款全流程</b>
    </footer>
  </main>;
}
