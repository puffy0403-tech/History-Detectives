import React from 'react';
import {Check, FileText} from 'lucide-react';

export function tableClue(table, row) {
  return `${table.caption}｜${row.label}：${row.value}${table.unit}`;
}

export default function SourceCard({source, id, selected, toggle, read, markRead}) {
  function clue(text, label = text) {
    return <button type="button" className="line" aria-label={text} aria-pressed={selected.includes(text)} onClick={() => toggle(text)}>
      {label}{selected.includes(text) && <Check size={16} aria-hidden="true"/>}
    </button>;
  }

  return <article className="panel source reading-source" id={`source-${id}`} tabIndex="-1">
    <span className="era"><FileText size={15}/> 材料 {id ? 'B' : 'A'} · {source.kind}</span>
    <h3>{source.title}</h3>
    <dl className="source-meta">
      <div><dt>年代</dt><dd>{source.year}</dd></div>
      <div><dt>作者／編製者</dt><dd>{source.author}</dd></div>
      <div><dt>來源</dt><dd>{source.origin}</dd></div>
    </dl>
    {source.link && <p><a href={source.link.url} target="_blank" rel="noreferrer">{source.link.label} ↗</a></p>}
    {source.table && <table className="clue-table">
      <caption>{source.table.caption}</caption>
      <thead><tr><th scope="col">觀察時點</th><th scope="col">茶葉出口量（{source.table.unit}）</th></tr></thead>
      <tbody>{source.table.rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{clue(tableClue(source.table, row), String(row.value))}</td></tr>)}</tbody>
    </table>}
    <p className="era">白話導讀</p>
    {source.lines.map(line => <React.Fragment key={line}>{clue(line)}</React.Fragment>)}
    <details><summary>詞語解釋</summary><p>{source.term}</p></details>
    {markRead && <button type="button" className="read-status" aria-pressed={read} onClick={markRead}>{read && <Check size={16}/>} {read ? '已讀這份材料' : '標記為已讀'}</button>}
  </article>;
}
