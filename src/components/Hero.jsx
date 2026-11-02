import { LINKS, STATS } from '../data.js';
import { Github, Linkedin, Mail, Download } from './Icons.jsx';

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-grid">
        <div className="hero-text">
          <div className="pill"><i /> Available for opportunities</div>
          <p className="hello">Hello, I'm</p>
          {/* Plain heading — no scanner effect, no hover behavior */}
          <h1>Gowri<br /><span>Hariharan B</span></h1>
          <h2 className="role"><span>—</span> Software Developer</h2>
          <p className="lead">A student developer building interactive web and desktop applications with React, Python, Java and MySQL — from 3D ocean data visualization to full customer management systems.</p>
          <div className="btns">
            <a className="btn primary" href="#projects">View My Projects</a>
            <a className="btn ghost" href={LINKS.resume} download><Download /> Download Resume</a>
          </div>
          <div className="socials">
            <a href={LINKS.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>
            <a href={LINKS.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>
            <a href={`mailto:${LINKS.email}`} aria-label="Email"><Mail /></a>
          </div>
        </div>
        <div className="hero-photo">
          <div className="ring" /><div className="dots" />
          <div className="frame"><img src="/images/profile.png" alt="Gowri Hariharan B" width="450" height="598" /></div>
          <div className="tag t1">{'<React />'}</div>
          <div className="tag t2">Java · Python</div>
        </div>
      </div>
      <div className="stats">
        {STATS.map(([n, l]) => <div key={l}><strong>{n}</strong><span>{l}</span></div>)}
      </div>
    </section>
  );
}
