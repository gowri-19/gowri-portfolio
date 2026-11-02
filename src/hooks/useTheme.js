import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'light'; } catch { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch { /* noop */ }
  }, [theme]);

  const toggle = () => {
    // Temporarily add .theme-anim so CSS transitions fire across all elements
    document.documentElement.classList.add('theme-anim');
    setTimeout(() => document.documentElement.classList.remove('theme-anim'), 450);
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggle };
}
