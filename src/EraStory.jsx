import React from 'react';
import {ArrowRight, Check, MapPin} from 'lucide-react';

const chapters = [
  {
    title: '港口為什麼打開？',
    text: '十九世紀中葉，清朝在條約下陸續開放臺灣的部分港口對外貿易。淡水位於臺灣北部、淡水河出海口。外國商船能到開放的港口交易，北臺灣的茶葉也多了一條通往海外市場的路。',
  },
  {
    title: '一批茶如何出海？',
    text: '想像一批剛採下的茶葉。茶葉先經過加工，再由商人收購。茶貨沿著陸路或河道運往淡水港，裝上船後，再經由海路銷往海外市場。',
  },
  {
    title: '同一批茶，經過誰的手？',
    text: '茶農種植、採收茶葉，工人加工茶葉，茶商收購茶貨、安排銷售，港口工人搬運並裝船。每一群人參與的環節不同。等一下讀史料時，留意每份資料記下了誰、記下了什麼。',
  },
];

const questions = [
  {
    text: '茶葉從北臺灣產區到海外市場，途中經過哪個環節？',
    options: ['採收後直接在農田裝上海船', '加工後運往淡水港，再裝船出海', '先賣到海外，才回臺灣加工'],
    correct: 1,
    chapter: 1,
  },
  {
    text: '茶農和港口工人的工作有什麼不同？',
    options: ['茶農負責搬運裝船，港口工人負責種茶', '兩者都負責安排海外銷售', '茶農種植與採收，港口工人搬運與裝船'],
    correct: 2,
    chapter: 2,
  },
];

export default function EraStory({answers, setAnswers, continueToMaterials}) {
  const ready = questions.every((question, id) => answers[id] === question.correct);

  function reviewChapter(id) {
    document.getElementById(`story-chapter-${id}`)?.focus();
  }

  return <div className="era-story">
    <section className="panel story-cover">
      <div className="story-cover-image" role="img" aria-label="十九世紀淡水港情境示意圖"/>
      <div>
        <span className="era">時代故事 · 19 世紀中葉</span>
        <h2>一批茶葉的出海旅程</h2>
        <p>沿著一批茶葉的路線，認識淡水開港後的港口、茶產區和人們的工作。</p>
      </div>
    </section>
    <ol className="story-chapters">
      {chapters.map((chapter, id) => <li className="panel" id={`story-chapter-${id}`} key={chapter.title} tabIndex="-1">
        <h3>{chapter.title}</h3>
        <p>{chapter.text}</p>
        {id === 1 && <figure className="trade-route">
          <figcaption><MapPin size={16}/> 茶葉運輸路線示意</figcaption>
          <ol>{['北臺灣茶產區', '淡水港', '海外市場'].map(stop => <li key={stop}>{stop}</li>)}</ol>
        </figure>}
        {id === 0 && <details><summary>關鍵詞｜開港通商</summary><p>開放指定港口，讓外國商船在港口與當地商人交易。</p></details>}
      </li>)}
    </ol>
    <section className="panel story-quiz" aria-labelledby="story-quiz-title">
      <h2 id="story-quiz-title">確認故事理解</h2>
      <p className="muted">選出最符合故事內容的答案。需要時可以回看故事，再試一次。</p>
      {questions.map((question, id) => <fieldset key={question.text}>
        <legend>{id + 1}. {question.text}</legend>
        {question.options.map((option, optionId) => <label key={option} className="story-option">
          <input type="radio" name={`story-question-${id}`} checked={answers[id] === optionId}
            onChange={() => setAnswers({...answers, [id]:optionId})}/>
          {option}
        </label>)}
        {answers[id] !== undefined && <div className="story-feedback">
          <p role="status">{answers[id] === question.correct ? <><Check size={17}/> 答對了</> : '再讀一次這段故事，就能找到答案。'}</p>
          {answers[id] !== question.correct && <button type="button" className="back" onClick={() => reviewChapter(question.chapter)}>
            回看「{chapters[question.chapter].title}」
          </button>}
        </div>}
      </fieldset>)}
      <button type="button" className="primary" disabled={!ready} onClick={continueToMaterials}>前往史料閱讀庫 <ArrowRight size={17}/></button>
    </section>
  </div>;
}
