import { useRef, useState, useEffect, useCallback } from 'react';

/* ── Config ──────────────────────────────────────────────────────────── */
const CHARS = '!@#$%*<>?/|ABCDEFGHJKLMNPQRSTUVWXYZabcdef0123456789';
const SCRAMBLE_MS = 480;

// The three words that make up "Gowri Hariharan B"
const WORDS = [
  { key: 'Gowri',     text: 'Gowri',     blue: false },
  { key: 'Hariharan', text: 'Hariharan', blue: true  },
  { key: 'B',         text: 'B',          blue: true  },
];

/* ── Scramble hook ───────────────────────────────────────────────────── */
// Scrambles `text` then decodes it over SCRAMBLE_MS. Replays on `trigger` change.
function useScramble(text, trigger) {
  const [out, setOut] = useState(text);
  const raf = useRef(null);

  useEffect(() => {
    if (!trigger || !text) { setOut(text); return; }
    cancelAnimationFrame(raf.current);
    let t0 = null;
    const run = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min(1, (ts - t0) / SCRAMBLE_MS);
      setOut(
        text.split('').map((c, i) =>
          p > i / (text.length || 1)
            ? c
            : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('')
      );
      if (p < 1) raf.current = requestAnimationFrame(run);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [trigger, text]); // eslint-disable-line react-hooks/exhaustive-deps

  return out;
}

/* ── SpotlightName ───────────────────────────────────────────────────── */
/**
 * Renders "Gowri Hariharan B" as an h1 where each word starts blurred/hidden.
 * As the cursor moves over a word:
 *   1. A small dark floating box appears near the cursor showing the word
 *      with a cyberpunk scramble → decode animation.
 *   2. The word in the h1 permanently clears (progressive reveal).
 * Falls back to a plain h1 on touch devices and prefers-reduced-motion.
 */
export default function SpotlightName() {
  const wRefs   = useRef({});           // { key: DOM element }
  const [cursor,   setCursor]   = useState(null);   // {x,y} viewport coords
  const [active,   setActive]   = useState(null);   // currently-hovered word key
  const [revealed, setRevealed] = useState(new Set()); // permanently-revealed keys
  const [trig,     setTrig]     = useState(0);      // incremented to replay scramble
  const [noFx,     setNoFx]     = useState(true);   // disabled until device check

  // Disable on touch / reduced-motion after mount
  useEffect(() => {
    setNoFx(
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  // Find which word span the cursor is over
  const detectWord = useCallback((e) => {
    for (const { key } of WORDS) {
      const el = wRefs.current[key];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top  && e.clientY <= r.bottom
      ) return key;
    }
    return null;
  }, []);

  const onMove = useCallback((e) => {
    setCursor({ x: e.clientX, y: e.clientY });
    const found = detectWord(e);
    if (found !== active) {
      setActive(found);
      if (found) {
        setRevealed(prev => new Set([...prev, found]));
        setTrig(k => k + 1); // trigger new scramble
      }
    }
  }, [active, detectWord]);

  const onLeave = useCallback(() => {
    setCursor(null);
    setActive(null);
  }, []);

  // Text shown in the floating box (scrambled or decoded)
  const activeText = WORDS.find(w => w.key === active)?.text ?? '';
  const scrambled  = useScramble(activeText, trig);

  // Plain h1 on touch / reduced-motion
  if (noFx) {
    return <h1>Gowri<br /><span>Hariharan B</span></h1>;
  }

  // Float box position: slightly right + above cursor, clamped to viewport
  const bx = cursor ? Math.min(cursor.x + 14, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 180) : 0;
  const by = cursor ? Math.max(cursor.y - 44, 8) : 0;

  return (
    <div className="sl-host" onMouseMove={onMove} onMouseLeave={onLeave}>
      {/* The real h1 — words are individually blurred until revealed */}
      <h1 aria-label="Gowri Hariharan B">
        {/* Word 1 */}
        <span
          ref={el => { wRefs.current['Gowri'] = el; }}
          className={`sl-w${revealed.has('Gowri') ? ' sl-revealed' : ''}`}
        >
          Gowri
        </span>

        <br />

        {/* Words 2 & 3 — wrapped in the original blue span */}
        <span className="sl-blue-line">
          <span
            ref={el => { wRefs.current['Hariharan'] = el; }}
            className={`sl-w sl-blue${revealed.has('Hariharan') ? ' sl-revealed' : ''}`}
          >
            Hariharan
          </span>
          {' '}
          <span
            ref={el => { wRefs.current['B'] = el; }}
            className={`sl-w sl-blue${revealed.has('B') ? ' sl-revealed' : ''}`}
          >
            B
          </span>
        </span>
      </h1>

      {/* Small floating decode box — only while cursor is over a word */}
      {cursor && active && (
        <div className="sl-float" style={{ left: bx, top: by }}>
          <span className="sl-float-txt">{scrambled}</span>
        </div>
      )}
    </div>
  );
}
