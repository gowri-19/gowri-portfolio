import { useState } from 'react';
import { CATEGORIES, SKILLS, CAT_LABEL } from '../data.js';
import { Eyebrow, Reveal } from './Section.jsx';
function Tile({ s }) {
  const [bad, setBad] = useState(false);
  return (
    <div className="tile">
      <span className="dots3">•••</span>
      <span className="cat">{CAT_LABEL[s.cat]}</span>
      {bad ? <span className="fallback">{s.name[0]}</span> : <img src={s.icon} alt="" loading="lazy" onError={() => setBad(true)} />}
      <div className="tname"><h4>{s.name}</h4><em>{CATEGORIES[s.cat]}</em></div>
    </div>
  );
}
export default function Arsenal() {
  const [f, setF] = useState(-1);
  const list = SKILLS.filter((s) => f < 0 || s.cat === f);
  return (
    <section id="arsenal" className="section arsenal">
      <div className="head">
        <div><Eyebrow no="03" label="TECHNICAL ARSENAL" />
          <h2 className="big">Tools I wield<br /><b>with precision.</b></h2></div>
        <p className="sub">The languages, frameworks and tools I use to turn ideas into working software.</p>
      </div>
      <div className="tabs">
        {['All', ...CATEGORIES].map((c, i) => (
          <button key={c} className={f === i - 1 ? 'on' : ''} onClick={() => setF(i - 1)}>{c}</button>
        ))}
      </div>
      <Reveal><div className="tiles">{list.map((s) => <Tile key={s.name} s={s} />)}</div></Reveal>
    </section>
  );
}
