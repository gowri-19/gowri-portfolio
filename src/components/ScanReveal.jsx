import { useRef, useState, useEffect, useCallback, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   ScanReveal — scanner-tag text reveal component
   ─────────────────────────────────────────────────────────────────────
   Prop: text      – raw string; mark stops with [[word]] (highlight/blue)
                     or *word (extra stop, normal colour); \n = <br/>
   Prop: trigger   – 'mount' | 'intersect' (IntersectionObserver 0.4)
   Prop: as        – element tag string, e.g. 'h1' | 'p'
   Prop: className – extra CSS class on the container element

   Global helper for testing:  window.__replayScan()
═══════════════════════════════════════════════════════════════════════ */

/* ── Timing constants (ms) ───────────────────────────────────────────── */
const TRAVEL_MS     = 300;   // scanner slides to next word
const HOLD_MS       = 180;   // pause before scramble begins
const SCRAMBLE_MS   = 350;   // scramble → decode duration
const REVEAL_PAUSE  = 40;    // after word sharpens before moving on
const GLITCH_MS     = 420;   // final glitch after last stop
const SETTLE_MS     = 120;   // wait after resetting before first move
// Target: ≤3 × (300+180+350+40) + 120 + 420 ≈ 3.1s for 3-word hero name

const CHARS = '!@#$%*<>?/|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef0123456789';

/* ── Text parser ─────────────────────────────────────────────────────── */
// Returns: Array<{ text, highlight, stop, br }>
// [[word]] → highlighted stop (blue), *word → plain stop, word → normal
function parseText(raw) {
  const tokens = [];
  const lines  = raw.split('\n');
  lines.forEach((line, li) => {
    const parts = line.split(/\s+/).filter(Boolean);
    parts.forEach((p, pi) => {
      const br = pi === parts.length - 1 && li < lines.length - 1;
      if (p.startsWith('[[') && p.endsWith(']]')) {
        tokens.push({ text: p.slice(2, -2), highlight: true,  stop: true,  br });
      } else if (p.startsWith('*')) {
        tokens.push({ text: p.slice(1),     highlight: false, stop: true,  br });
      } else {
        tokens.push({ text: p,              highlight: false, stop: false, br });
      }
    });
  });
  return tokens;
}

/* ── Component ───────────────────────────────────────────────────────── */
export default function ScanReveal({ text, trigger = 'mount', as: Tag = 'p', className = '' }) {
  const tokens = useMemo(() => parseText(text), [text]);
  const stops  = useMemo(
    () => tokens.reduce((acc, t, i) => (t.stop ? [...acc, i] : acc), []),
    [tokens]
  );

  const containerRef = useRef(null);
  const wordRefs     = useRef([]);       // DOM el per token index
  const cancelRef    = useRef(false);
  const rafRef       = useRef(null);
  const runRef       = useRef(null);     // always-current runAnimation ref
  const firstVis     = useRef(true);     // for first tag appearance per run

  // 'dim' | 'on' per token
  const [states, setStates]   = useState(() => tokens.map(() => 'dim'));
  // scanner tag state
  const [tag,    setTag]      = useState({
    visible: false, x: 0, y: 0, w: 60, h: 30, text: '', instant: true
  });

  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  /* ── sleep (cooperative — caller checks cancelRef after await) ── */
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  /* ── Scramble the tag text field over durationMs ── */
  const scrambleTag = useCallback((targetText, durationMs) => {
    return new Promise(resolve => {
      if (cancelRef.current) { resolve(); return; }
      cancelAnimationFrame(rafRef.current);
      const t0 = performance.now();
      const tick = (now) => {
        if (cancelRef.current) { resolve(); return; }
        const p = Math.min(1, (now - t0) / durationMs);
        const out = targetText.split('').map((c, i) =>
          p > i / (targetText.length || 1)
            ? c
            : CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join('');
        setTag(prev => ({ ...prev, text: out }));
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
        else { setTag(prev => ({ ...prev, text: targetText })); resolve(); }
      };
      rafRef.current = requestAnimationFrame(tick);
    });
  }, []);

  /* ── Get a word's rect relative to the container ── */
  const getRect = useCallback((idx) => {
    const el  = wordRefs.current[idx];
    const con = containerRef.current;
    if (!el || !con) return null;
    const wr = el.getBoundingClientRect();
    const cr = con.getBoundingClientRect();
    return { x: wr.left - cr.left, y: wr.top - cr.top, w: wr.width, h: wr.height };
  }, []);

  /* ── Main animation sequence ── */
  const runAnimation = useCallback(async () => {
    /* reduced-motion: reveal everything immediately */
    if (prefersReduced) {
      setStates(tokens.map(() => 'on'));
      setTag(prev => ({ ...prev, visible: false }));
      return;
    }

    /* Cancel any in-flight run */
    cancelRef.current = true;
    cancelAnimationFrame(rafRef.current);
    await sleep(80);               // let pending async steps see the cancel flag
    cancelRef.current = false;
    firstVis.current  = true;

    /* Reset: dim all words, hide tag */
    setStates(tokens.map(() => 'dim'));
    setTag(prev => ({ ...prev, visible: false }));
    await sleep(SETTLE_MS);
    if (cancelRef.current) return;

    /* Visit each stop */
    for (let si = 0; si < stops.length; si++) {
      if (cancelRef.current) break;
      const idx   = stops[si];
      const token = tokens[idx];
      const rect  = getRect(idx);
      if (!rect) continue;

      if (firstVis.current) {
        /* First stop: place tag instantly, then fade it in */
        firstVis.current = false;
        setTag({ visible: false, x: rect.x, y: rect.y, w: rect.w, h: rect.h, text: token.text, instant: true });
        await sleep(20);
        if (cancelRef.current) break;
        setTag(prev => ({ ...prev, visible: true }));
        await sleep(TRAVEL_MS);
      } else {
        /* Subsequent stops: slide smoothly */
        setTag(prev => ({
          ...prev, x: rect.x, y: rect.y, w: rect.w, h: rect.h,
          text: token.text, instant: false
        }));
        await sleep(TRAVEL_MS);
      }
      if (cancelRef.current) break;

      await sleep(HOLD_MS);
      if (cancelRef.current) break;

      await scrambleTag(token.text, SCRAMBLE_MS);
      if (cancelRef.current) break;

      /* Permanently reveal this word */
      setStates(prev => { const n = [...prev]; n[idx] = 'on'; return n; });
      await sleep(REVEAL_PAUSE);
      if (cancelRef.current) break;
    }

    /* Final glitch on last stop */
    if (!cancelRef.current && stops.length > 0) {
      const lastIdx  = stops[stops.length - 1];
      const lastRect = getRect(lastIdx);
      if (lastRect) {
        setTag(prev => ({
          ...prev, x: lastRect.x, y: lastRect.y,
          w: lastRect.w, h: lastRect.h,
          text: tokens[lastIdx].text, instant: false
        }));
        await sleep(60);
      }
      if (!cancelRef.current) await scrambleTag(tokens[lastIdx].text, GLITCH_MS);
    }

    /* Done: fade out tag, sharpen every remaining word */
    if (!cancelRef.current) {
      setTag(prev => ({ ...prev, visible: false }));
      setStates(tokens.map(() => 'on'));
    }
  }, [tokens, stops, scrambleTag, getRect, prefersReduced]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Keep ref always current so the effect closure is never stale */
  runRef.current = runAnimation;

  /* ── Trigger logic (runs once on mount) ── */
  useEffect(() => {
    let observer;
    const run = () => runRef.current();

    if (trigger === 'mount') {
      run();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { observer.disconnect(); run(); }
        },
        { threshold: 0.4 }
      );
      const el = containerRef.current;
      if (el) observer.observe(el);
    }

    return () => {
      observer?.disconnect();
      cancelRef.current = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Unmount cleanup */
  useEffect(() => () => {
    cancelRef.current = true;
    cancelAnimationFrame(rafRef.current);
  }, []);

  /* Replay helper — exposed for testing */
  useEffect(() => {
    window.__replayScan = () => runRef.current();
    return () => { delete window.__replayScan; };
  }, []);

  /* ── Render ── */
  const tagStyle = {
    position: 'absolute',
    left:     tag.x,
    top:      tag.y,
    width:    tag.w,
    height:   tag.h,
    opacity:  tag.visible ? 1 : 0,
    pointerEvents: 'none',
    transition: tag.instant
      ? 'opacity 160ms ease'
      : `left ${TRAVEL_MS}ms cubic-bezier(.4,0,.2,1), top ${TRAVEL_MS}ms cubic-bezier(.4,0,.2,1), width ${TRAVEL_MS}ms ease, height ${TRAVEL_MS}ms ease, opacity 160ms ease`,
  };

  return (
    <Tag
      ref={containerRef}
      className={`scan-reveal${className ? ` ${className}` : ''}`}
      style={{ position: 'relative' }}
    >
      {tokens.map((token, i) => (
        <span key={i}>
          <span
            ref={el => { wordRefs.current[i] = el; }}
            className={`sr-word${token.highlight ? ' sr-hl' : ''}${states[i] === 'on' ? ' sr-on' : ''}`}
          >
            {token.text}
          </span>
          {token.br ? <br /> : ' '}
        </span>
      ))}

      {/* Scanner tag — always in DOM; CSS transition handles movement */}
      <span className="sr-tag" style={tagStyle} aria-hidden="true">
        <span className="sr-dot sr-dot-tr" />   {/* blue  top-right  */}
        <span className="sr-dot sr-dot-bl" />   {/* red   bottom-left */}
        <span className="sr-tag-txt">{tag.text}</span>
      </span>
    </Tag>
  );
}
