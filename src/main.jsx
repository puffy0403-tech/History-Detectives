import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Compass, FileText, Map, Search, Sparkles, Target} from 'lucide-react';
import {units} from './units';
import './style.css';

function readProgress() {
  try { return JSON.parse(localStorage.getItem('history-progress')) ?? {}; }
  catch { return {}; }
}

function getFeedback(answer, unitIndex) {
  if (!answer.evidence.length || answer.reason.trim().length < 5) {
    return {title:'回到史料找證據', prompt:'哪一句能支持你的判斷？回想你標記的句子，試著說出它記錄的變化。', question:'回答歷史問題時，什麼最能支持你的說法？', options:['史料中的具體敘述','我原本對這段歷史的印象'], correct:0};
  }
  if (/所有|每個|一定|都|全部/.test(answer.claim) && !/不能|沒有|不一定|無法|不足|未必/.test(answer.claim)) {
    return {title:'檢查證據的範圍', prompt:'找出你用了哪些概括性的詞，想想這份資料觀察的對象有多廣。', question:unitIndex === 0 ? '貿易紀錄直接記下的是什麼？' : '能從單一紀錄直接確認哪一項？', options:unitIndex === 0 ? ['每個家庭的收入','港口的出口情況'] : ['所有人的生活變化','該紀錄實際觀察的現象'], correct:1};
  }
  if (unitIndex === 1 || /矛盾|衝突/.test(answer.reason)) {
    return {title:'比較兩份史料的觀點', prompt:'想想兩份資料分別由誰留下、關注什麼，以及兩種情況能否同時發生。', question:'兩份史料關注不同群體時，可以怎麼理解？', options:['先分辨各自描述的對象，再考慮兩者能否同時成立','選出其中一份，直接認定另一份錯誤'], correct:0};
  }
  return {title:'讓理由更具體', prompt:'你已選出證據。試著寫出它支持結論的哪一部分，以及還有哪些問題需要更多資料。', question:'如何讓讀者看懂你的推論？', options:['把史料和結論之間的關係寫清楚','只把結論再寫一次'], correct:0};
}

function App() {
  const [progress, setProgress] = useState(readProgress);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState('map');
  const [answer, setAnswer] = useState({claim:'', reason:'', evidence:[]});
  const [original, setOriginal] = useState(null);
  const [choice, setChoice] = useState(null);
  const unit = units[index];
  const independent = index === 2;
  const feedback = original && getFeedback(original, index);
  const count = Object.keys(progress).length;

  function go(next) {
    setStage(next);
    window.scrollTo(0, 0);
  }
  function open(id) {
    setIndex(id);
    setAnswer(progress[id]?.final ?? {claim:'', reason:'', evidence:[]});
    setOriginal(null);
    setChoice(null);
    go('materials');
  }
  function toggle(line) {
    setAnswer(current => ({...current, evidence:current.evidence.includes(line) ? current.evidence.filter(item => item !== line) : [...current.evidence, line]}));
  }
  function complete(final, initial) {
    const next = {...progress, [index]:{final, initial}};
    setProgress(next);
    try { localStorage.setItem('history-progress', JSON.stringify(next)); }
    catch { /* Progress remains available in memory if browser storage is blocked. */ }
    go('result');
  }
  function submit(event) {
    event.preventDefault();
    if (!answer.claim.trim() || !answer.reason.trim()) return;
    if (stage === 'revise') complete(answer, original);
    else {
      setOriginal(answer);
      if (independent) complete(answer, answer);
      else go('activity');
    }
  }
  function summary(item) {
    return <><p><strong>我的判斷</strong><br/>{item.claim}</p><p><strong>我的理由</strong><br/>{item.reason}</p><p><strong>選用的證據</strong></p>{item.evidence.length ? <ul>{item.evidence.map(line => <li key={line}>{line}</li>)}</ul> : <p>尚未標記證據</p>}</>;
  }

  return <>
    <header className="top"><div className="shell top-inner">
      <button className="brand" onClick={() => go('map')}><span className="brand-icon"><Compass size={27}/></span><span>歷史偵探室<small>HISTORY DETECTIVES</small></span></button>
      <nav aria-label="主選單"><button className={stage !== 'progress' ? 'active' : ''} onClick={() => go('map')}><Map size={17}/>單元地圖</button><button className={stage === 'progress' ? 'active' : ''} onClick={() => go('progress')}><Target size={17}/>學習進度</button></nav>
      <span className="student"><span>偵</span> 學生模式</span>
    </div></header>
    <main className="shell">
      {stage === 'map' && <>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow"><span></span> 國中歷史探究平台</div>
            <h1>每一段歷史，<br/>都有<span>線索</span>。</h1>
            <p>閱讀史料、找出證據，像偵探一樣追查真相。<br className="desktop"/> 從不同觀點出發，寫下你對歷史的解釋。</p>
            <button className="primary gold" onClick={() => open(Math.max(0, units.findIndex((_, id) => !progress[id])))}>開始探究 <ArrowRight size={18}/></button>
          </div>
          <span className="photo-caption">淡水港・十九世紀情境重現</span>
        </section>
        <section className="unit-section">
          <div className="section-head"><div className="section-title"><span className="section-icon"><Map size={24}/></span><div><h2>歷史單元地圖</h2><p>選擇一個單元，開啟你的探究任務。</p></div></div>
          <div className="meter"><span>單元進度 <strong>{count} / 3</strong></span><div aria-hidden="true">{units.map((_, id) => <i className={id < count ? 'filled' : ''} key={id}/>)}</div></div></div>
          <div className="cards">{units.map((item, id) => <article className="unit-card" key={item.title}>
            <button className="card-button" onClick={() => open(id)}>
              <div className={'card-image ' + item.art}><span className="case-label">{progress[id] ? <><Check size={13}/> 已完成</> : id === 2 ? <><Target size={12}/> 獨立挑戰</> : <>探究任務 0{id + 1}</>}</span></div>
              <div className="card-body"><div className="era">{item.era}</div><h3>{item.title}</h3><p>{item.description}</p><div className="card-bottom"><span><Target size={14}/>{item.skill}</span><span className="circle-arrow"><ArrowRight size={18}/></span></div></div>
            </button>
          </article>)}</div>
        </section>
      </>}
      {stage === 'progress' && <section className="inner-page"><h1>學習進度</h1><p className="muted">已完成 {count} / 3 個單元</p><div className="panel progress-list">{units.map((item, id) => <button key={item.title} onClick={() => open(id)}><span><strong>{item.title}</strong><small>{progress[id] ? '已完成' : '待探究'}</small></span><ChevronRight size={18}/></button>)}</div></section>}
      {stage !== 'map' && stage !== 'progress' && <section className="inner-page">
        <button className="back" onClick={() => go('map')}><ArrowLeft size={18}/> 回單元地圖</button>
        <div className="era">{unit.era} · {unit.skill}</div>
        <h1>{unit.title}</h1>
        {stage === 'materials' ? <>
          <div className="panel reading-intro">
            <span className="era"><BookOpen size={16}/> 作答前閱讀</span>
            <h2>時代背景</h2>
            <p>{unit.background}</p>
            {unit.readingGuide && <p><strong>閱讀提示</strong>　{unit.readingGuide}</p>}
          </div>
          <h2>史料教材</h2>
          <p className="muted">以下為教學用的資料摘要與情境重構。</p>
          <div className="two-column">{unit.sources.map((source, id) => <article className="panel source reading-source" key={source.title}>
            <span className="era"><FileText size={15}/> 史料 {id ? 'B' : 'A'}</span>
            <h3>{source.title}</h3>
            <p className="muted">{source.year} · {source.author}</p>
            {source.lines.map(line => <p key={line}>{line}</p>)}
            <details><summary>詞語解釋</summary><p>{source.term}</p></details>
          </article>)}</div>
          <button className="primary next" onClick={() => go('read')}>{independent ? '開始獨立挑戰' : '開始圈選證據與作答'} <ArrowRight size={17}/></button>
        </> : <div className="question"><Search size={20}/><strong>{unit.question}</strong></div>}
        {stage === 'read' && <button className="back" onClick={() => go('materials')}><BookOpen size={17}/> 回看史料教材</button>}
        {(stage === 'read' || stage === 'revise') && <>
          <h2>{stage === 'revise' ? '修正你的答案' : '閱讀史料'}</h2>
          <p className="muted">{independent ? '先獨立完成作答，提交後再查看回饋。' : '點選句子，即可標記為你的證據。'}</p>
          <div className="two-column">{unit.sources.map((source, id) => <article className="panel source" key={source.title}>
            <span className="era"><FileText size={15}/> 史料 {id ? 'B' : 'A'}</span><h3>{source.title}</h3>
            <p className="muted">{source.year} · {source.author}</p>
            {source.lines.map(line => <button type="button" className="line" aria-pressed={answer.evidence.includes(line)} onClick={() => toggle(line)} key={line}>{line}{answer.evidence.includes(line) && <Check size={17}/>}</button>)}
            <details><summary>詞語解釋</summary><p>{source.term}</p></details>
          </article>)}</div>
          <div className={stage === 'revise' ? 'two-column answer-layout' : 'answer-layout'}>
            {stage === 'revise' && <article className="panel"><h3>我的初答</h3>{summary(original)}</article>}
            <form className="panel answer-form" onSubmit={submit}>
              <h2>{stage === 'revise' ? '我的修正版' : '我的探究答案'}</h2>
              <label>我的判斷<textarea rows="2" required value={answer.claim} onChange={e => setAnswer({...answer, claim:e.target.value})} placeholder="用一句話回答核心問題"/></label>
              <div><strong>我的證據（{answer.evidence.length}）</strong>{answer.evidence.length ? <ul>{answer.evidence.map(line => <li key={line}>{line} <button type="button" className="remove" onClick={() => toggle(line)} aria-label={'移除證據：' + line}>×</button></li>)}</ul> : <p className="muted">從上方史料標記句子。</p>}</div>
              <label>我的理由<textarea rows="3" required value={answer.reason} onChange={e => setAnswer({...answer, reason:e.target.value})} placeholder="說明你選的證據如何支持你的判斷"/></label>
              <button className="primary" disabled={!answer.claim.trim() || !answer.reason.trim()}>{stage === 'revise' ? '提交修正版' : '提交答案'} <ArrowRight size={17}/></button>
            </form>
          </div>
        </>}
        {stage === 'activity' && <article className="panel activity"><span className="era"><Sparkles size={16}/> 適性補強</span><h2>{feedback.title}</h2><p>{feedback.prompt}</p><blockquote>{original.reason}</blockquote>
          <h3>{feedback.question}</h3>{feedback.options.map((option, id) => <button key={option} className="line" aria-pressed={choice === id} onClick={() => setChoice(id)}>{option}</button>)}
          {choice !== null && <p role="status">{choice === feedback.correct ? '答對了。把這個想法用在你的答案裡。' : '再試一次，想想資料實際記錄了什麼。'}</p>}
          <button className="primary" disabled={choice !== feedback.correct} onClick={() => go('revise')}>修正我的答案 <ArrowRight size={17}/></button>
        </article>}
        {stage === 'result' && <><h2><Check size={22}/> {independent ? '獨立挑戰已完成' : '探究任務已完成'}</h2>
          {independent ? <div className="two-column"><article className="panel"><h3>我的答案</h3>{summary(progress[index].final)}</article><article className="panel"><h3>{feedback.title}</h3><p>{feedback.prompt}</p></article></div> :
          <div className="two-column"><article className="panel"><h3>我的初答</h3>{summary(progress[index].initial)}</article><article className="panel"><h3>我的修正版</h3>{summary(progress[index].final)}{answer.evidence.some(line => !original.evidence.includes(line)) && <p className="era">已補充新證據</p>}</article></div>}
          <button className="primary next" onClick={() => index < 2 ? open(index + 1) : go('map')}>{index < 2 ? '前往下一單元' : '回單元地圖'} <ArrowRight size={17}/></button></>}
      </section>}
    </main>
    <footer className="shell footer"><span><BookOpen size={16}/> 歷史偵探室</span><span>國中歷史探究學習</span></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
