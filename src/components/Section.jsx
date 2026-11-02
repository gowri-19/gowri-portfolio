import { useEffect, useRef, useState } from 'react';
export function useReveal() {
  const ref = useRef(null); const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.15 });
    ref.current && io.observe(ref.current); return () => io.disconnect();
  }, []);
  return [ref, on];
}
export const Eyebrow = ({ no, label }) => (
  <div className="eyebrow"><span>{no}</span><i />{label}</div>
);
export const Reveal = ({ children, className = '', delay = 0 }) => {
  const [ref, on] = useReveal();
  return <div ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
};
