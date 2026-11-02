import { useState } from 'react';
import { LINKS } from '../data.js';
import { Github, Linkedin, Mail, Arrow } from './Icons.jsx';
import { Eyebrow } from './Section.jsx';
export default function Contact() {
  const [v, setV] = useState({ name: '', email: '', msg: '' });
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const send = () => {
    const body = `${v.msg}\n\n— ${v.name} (${v.email})`;
    window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent('Portfolio enquiry from ' + (v.name || 'a visitor'))}&body=${encodeURIComponent(body)}`;
  };
  const L = ({ n }) => <span className="ln">{String(n).padStart(2, '0')}</span>;
  return (
    <section id="contact" className="section contact">
      <div className="editor">
        <div className="etop"><i className="r" /><i className="y" /><i className="g" /><span className="file"><b>JS</b> inquiry.jsx</span></div>
        <div className="code">
          <div><L n={1} /><em>import</em> {'{ Inquiry }'} <em>from</em> <q>"./gowri"</q>;</div>
          <div className="cm"><L n={2} />// Fill the variables to get in touch</div>
          <div><L n={3} /><em>const</em> request: Inquiry = {'{'}</div>
          <div className="f"><L n={4} /><label htmlFor="cn">clientName:</label><input id="cn" value={v.name} onChange={set('name')} placeholder="Your Name" />,</div>
          <div className="f"><L n={5} /><label htmlFor="ce">clientEmail:</label><input id="ce" type="email" value={v.email} onChange={set('email')} placeholder="you@email.com" />,</div>
          <div className="f ta"><L n={6} /><label htmlFor="cm">message:</label><textarea id="cm" rows="3" value={v.msg} onChange={set('msg')} placeholder="Tell me about your idea or opportunity..." /></div>
          <div><L n={7} />{'};'}</div>
        </div>
        <div className="efoot"><span><i /> INQUIRY_CHANNEL</span><button className="btn primary sm" onClick={send}>$ NPM RUN SEND <Arrow /></button></div>
      </div>
      <div className="cright">
        <Eyebrow no="05" label="GET IN TOUCH" />
        <h2 className="big">Let's build<br /><span className="grad">something</span><br />remarkable.</h2>
        <p className="sub">Open to internships, collaborations and hackathon teams. Reach out and I'll get back to you.</p>
        <a className="btn primary" href={`mailto:${LINKS.email}`}><Mail /> SEND A MESSAGE <Arrow /></a>
        <div className="clist">
          <a href={`mailto:${LINKS.email}`}><Mail /> {LINKS.email}</a>
          <a href={LINKS.github} target="_blank" rel="noreferrer"><Github /> GitHub</a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a>
        </div>
      </div>
    </section>
  );
}
