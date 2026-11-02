import { useState } from 'react';
import { PROJECTS } from '../data.js';
import { Github, External } from './Icons.jsx';
import { Eyebrow } from './Section.jsx';
const AquaPreview = () => (
  <div className="prev aqua">
    <div className="globe" />
    <svg viewBox="0 0 300 120" className="wave"><path d="M0 70 Q40 40 80 70 T160 70 T240 70 T320 70" /><path d="M0 90 Q40 60 80 90 T160 90 T240 90 T320 90" /></svg>
    <div className="chip c1">Temp 18.4°C</div><div className="chip c2">Salinity 35.1</div><div className="chip c3">Argo float #2903</div>
    <div className="depth"><i /><i /><i /><i /></div>
  </div>
);
const HubPreview = () => (
  <div className="prev hub">
    <div className="win"><span /><span /><span /></div>
    <aside><b /><i /><i /><i /><i /></aside>
    <main>
      <div className="kpis"><u /><u /><u /></div>
      <div className="rows"><s /><s /><s /><s /></div>
    </main>
  </div>
);
function Card({ p, i }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`pcard ${p.id}`} style={{ top: `${96 + i * 28}px` }}>
      <div className="pinfo">
        <div className="ptop">
          <span className="pno">{p.no}</span>
          <button className="btn primary sm" onClick={() => setOpen(!open)} aria-expanded={open}><External /> {open ? 'HIDE DETAILS' : 'VIEW DETAILS'}</button>
          <a className="btn dark sm" href={p.repo} target="_blank" rel="noreferrer"><Github /> GITHUB</a>
        </div>
        <h3>{p.title}</h3>
        <h4>{p.sub}</h4>
        <p>{p.desc}</p>
        <ul className={`feat ${open ? 'open' : ''}`}>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
        <div className="techs">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
      </div>
      {p.id === 'aquavision' ? <AquaPreview /> : <HubPreview />}
    </article>
  );
}
export default function Projects() {
  return (
    <section id="projects" className="section projects">
      <div className="center"><Eyebrow no="04" label="SELECTED PROJECTS" />
        <h2 className="big">Building thoughtful,<br />working software.</h2></div>
      <div className="stack">{PROJECTS.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div>
    </section>
  );
}
