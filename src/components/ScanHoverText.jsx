import { useRef, useEffect, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   ScanHoverText — scanner tag on highlighted words ONLY
   ─────────────────────────────────────────────────────────────────────
   text      String with [[word]] for interactive (blue) words.
             All other words render as plain text with no hover effect.
   as        Native element tag string ('p', 'div', …)
   className Extra CSS class on the container element.

   Detection uses e.target.closest('.sh-hl') — one delegated listener on
   the container, zero listeners on individual words.
═══════════════════════════════════════════════════════════════════════ */

const CHARS      = '!@#$%*<>?/|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef0123456789';
const SCRAMBLE_MS = 350;
const SLIDE_MS    = 180;

/* ── Parser ──────────────────────────────────────────────────────────── */
function parseText(raw) {
  const tokens = [];
  const lines  = raw.split('\n');
  lines.forEach((line, li) => {
    const parts = line.split(/\s+/).filter(Boolean);
    parts.forEach((p, pi) => {
      const br = pi === parts.length - 1 && li < lines.length - 1;
      if (p.startsWith('[[') && p.endsWith(']]')) {
        tokens.push({ text: p.slice(2, -2), highlight: true,  br });
      } else {
        tokens.push({ text: p,              highlight: false, br });
      }
    });
  });
  return tokens;
}

/* ── Component ───────────────────────────────────────────────────────── */
export default function ScanHoverText({ text, as: Tag = 'p', className = '' }) {
  const tokens = useMemo(() => parseText(text), [text]);

  const containerRef = useRef(null);
  const tagRef       = useRef(null);  // scanner tag <span>
  const tagTxtRef    = useRef(null);  // text node inside tag

  const activeIdxRef = useRef(-1);    // data-idx of currently shown word (-1 = hidden)
  const scrambleTok  = useRef(0);     // incremented to cancel in-flight RAF
  const rafRef       = useRef(null);

  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  /* ── Wire a single pair of delegated listeners on the container ── */
  useEffect(() => {
    const con = containerRef.current;
    if (!con) return;

    /* Scramble text → decode over SCRAMBLE_MS. Stops if scrambleTok changes. */
    const doScramble = (targetText, myTok) => {
      cancelAnimationFrame(rafRef.current);
      const el = tagTxtRef.current;
      if (!el) return;
      if (prefersReduced) { el.textContent = targetText; return; }
      const t0 = performance.now();
      const tick = (now) => {
        if (scrambleTok.current !== myTok) return;           // superseded
        const p = Math.min(1, (now - t0) / SCRAMBLE_MS);
        el.textContent = targetText.split('').map((c, i) =>
          p > i / (targetText.length || 1)
            ? c
            : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('');
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
        else el.textContent = targetText;
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    /* Fade out and reset tag. */
    const hideTag = () => {
      if (activeIdxRef.current === -1) return;               // already hidden
      activeIdxRef.current = -1;
      scrambleTok.current++;
      cancelAnimationFrame(rafRef.current);
      const tag = tagRef.current;
      if (tag) { tag.style.transition = 'opacity 180ms ease'; tag.style.opacity = '0'; }
    };

    const onPointerOver = (e) => {
      /*
       * Walk up from event.target to find the nearest .sh-hl ancestor-or-self.
       * This is the spec-required detection method.
       * - Cursor on a highlighted word  → hlEl is that span.
       * - Cursor on a plain word / gap  → hlEl is null → hide tag.
       */
      const hlEl = e.target.closest('.sh-hl');

      if (!hlEl) {
        hideTag();
        return;
      }

      /* data-idx is set on every .sh-hl span at render time */
      const idx = parseInt(hlEl.dataset.idx, 10);
      if (idx === activeIdxRef.current) return;              // same word, nothing to do

      const isFirst = activeIdxRef.current === -1;
      activeIdxRef.current = idx;

      /* Position the tag over the word using its live bounding rect */
      const wr  = hlEl.getBoundingClientRect();
      const cr  = con.getBoundingClientRect();
      const tag = tagRef.current;
      if (!tag) return;

      tag.style.left    = (wr.left - cr.left) + 'px';
      tag.style.top     = (wr.top  - cr.top)  + 'px';
      tag.style.width   = wr.width  + 'px';
      tag.style.height  = wr.height + 'px';
      tag.style.opacity = '1';

      /* First appearance: instant position, fade in only.
         Later words: slide the tag across. */
      tag.style.transition = isFirst
        ? 'opacity 130ms ease'
        : `left ${SLIDE_MS}ms cubic-bezier(.4,0,.2,1), top ${SLIDE_MS}ms cubic-bezier(.4,0,.2,1), width ${SLIDE_MS}ms ease, height ${SLIDE_MS}ms ease, opacity 130ms ease`;

      /* Word text stored in data-word — no closure over tokens array needed */
      const tok = ++scrambleTok.current;
      doScramble(hlEl.dataset.word, tok);
    };

    const onPointerLeave = () => hideTag();

    con.addEventListener('pointerover',  onPointerOver);
    con.addEventListener('pointerleave', onPointerLeave);
    return () => {
      con.removeEventListener('pointerover',  onPointerOver);
      con.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //  ↑ intentionally empty — all mutable state is in refs; data-* attrs hold word info.

  /* ── Render ── */
  return (
    <Tag
      ref={containerRef}
      className={`sh-text${className ? ` ${className}` : ''}`}
    >
      {tokens.map((token, i) => (
        <span key={i}>
          {token.highlight ? (
            /* Highlighted word: carries data-idx + data-word for the handler.
               No ref or React event needed — closest() finds it via the DOM. */
            <span
              className="sh-word sh-hl"
              data-idx={i}
              data-word={token.text}
            >
              {token.text}
            </span>
          ) : (
            /* Plain word: no class that triggers the handler, no pointer cursor */
            <span className="sh-word">{token.text}</span>
          )}
          {token.br ? <br /> : ' '}
        </span>
      ))}

      {/* Shared scanner tag — always in DOM; JS controls position + opacity */}
      <span
        ref={tagRef}
        className="sh-tag"
        style={{ position: 'absolute', opacity: 0 }}
        aria-hidden="true"
      >
        <span className="sh-dot sh-dot-tr" />  {/* blue  — top-right   */}
        <span className="sh-dot sh-dot-bl" />  {/* red   — bottom-left */}
        <span ref={tagTxtRef} className="sh-tag-txt" />
      </span>
    </Tag>
  );
}
