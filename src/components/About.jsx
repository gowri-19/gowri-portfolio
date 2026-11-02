import { ABOUT_FACTS } from '../data.js';
import { Eyebrow, Reveal } from './Section.jsx';
import ScanHoverText from './ScanHoverText.jsx';

// [[word]] = highlighted (blue accent). Matches ABOUT_HIGHLIGHTS from data.js:
// Gowri, Hariharan, B,, Software, Developer, React, Python, JavaFX, MySQL
const ABOUT_TEXT_MARKED =
  'I am [[Gowri]] [[Hariharan]] [[B,]] a [[Software]] [[Developer]] and student ' +
  'passionate about building practical web and desktop applications. From ' +
  'interactive 3D ocean data platforms in [[React]] and [[Python]] to [[JavaFX]] ' +
  'and [[MySQL]] systems, I enjoy turning complex problems into clean, working software.';

export default function About() {
  return (
    <section id="about" className="section about">
      <Eyebrow no="02" label="ABOUT" />

      <div className="about-card">
        <ScanHoverText text={ABOUT_TEXT_MARKED} as="p" />
      </div>

      <div className="facts">
        {ABOUT_FACTS.map(([t, d], i) => (
          <Reveal key={t} delay={i * 80} className="fact">
            <h3>{t}</h3><p>{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
