import { useEffect, useState } from 'react';
import { NAV } from '../data.js';
import { useTheme } from '../hooks/useTheme.js';
import { Sun, Moon } from './Icons.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [solid, setSolid] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 10);
      let cur = 'home';
      NAV.forEach(([id]) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = id; });
      setActive(cur);
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${solid ? 'solid' : ''}`}>
      <a href="#home" className="logo">GH<b>.</b></a>
      <div className="nav-right">
        <button
          className="theme-toggle"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <nav className={open ? 'open' : ''}>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>
    </header>
  );
}
