// ===== Portfolio data — all real details =====
export const LINKS = {
  email: 'bgowrihariharan@gmail.com',
  github: 'https://github.com/gowri-19',
  linkedin: 'https://www.linkedin.com/in/gowri-hariharan-b-759624384/',
  resume: '/resume.pdf',
  aquavisionRepo: 'https://github.com/gowri-19/AquaVision',
  customerhubRepo: 'https://github.com/gowri-19/CustomerManagementSystem',
};

export const NAV = [
  ['home', 'Home'], ['about', 'About Me'], ['arsenal', 'Technical Arsenal'],
  ['projects', 'Selected Projects'], ['contact', 'Get In Touch'],
];

export const STATS = [
  ['8.68', 'CGPA'], ['2', 'Hackathons'], ['2+', 'Projects'],
];

export const ABOUT_TEXT =
  'I am Gowri Hariharan B, a Software Developer and student passionate about building practical web and desktop applications. From interactive 3D ocean data platforms in React and Python to JavaFX and MySQL systems, I enjoy turning complex problems into clean, working software.';
export const ABOUT_HIGHLIGHTS = ['Gowri', 'Hariharan', 'B,', 'Software', 'Developer', 'React', 'Python', 'JavaFX', 'MySQL'];

export const ABOUT_FACTS = [
  ['Education', 'Undergraduate student with a CGPA of 8.68.'],
  ['Technical interests', 'Web development, data visualization, desktop applications and databases.'],
  ['Development journey', 'C, Java and Python fundamentals, then React.js and participating in hackathons.'],
  ['Projects', 'Building real-world applications — from 3D ocean data visualization to JavaFX desktop systems.'],
];

const dv = (n, v = 'original') => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${n}/${n}-${v}.svg`;
export const CATEGORIES = ['Programming Languages', 'Frontend Development', 'Database', 'Tools & Technologies'];
export const SKILLS = [
  { name: 'C', cat: 0, icon: dv('c') },
  { name: 'Java', cat: 0, icon: dv('java') },
  { name: 'Python', cat: 0, icon: dv('python') },
  { name: 'HTML', cat: 1, icon: dv('html5') },
  { name: 'CSS', cat: 1, icon: dv('css3') },
  { name: 'JavaScript', cat: 1, icon: dv('javascript') },
  { name: 'React.js', cat: 1, icon: dv('react') },
  { name: 'MySQL', cat: 2, icon: dv('mysql') },
  { name: 'Git', cat: 3, icon: dv('git') },
  { name: 'GitHub', cat: 3, icon: dv('github') },
  { name: 'VS Code', cat: 3, icon: dv('vscode') },
  { name: 'JavaFX', cat: 3, icon: dv('java') },
];
export const CAT_LABEL = ['LANGUAGE', 'FRONTEND', 'DATABASE', 'TOOLS'];

export const PROJECTS = [
  {
    id: 'aquavision', no: '01', title: 'AquaVision', sub: '3D Ocean Data Visualization Platform',
    desc: 'A web-based platform that integrates numerical ocean model outputs and in-situ observations to visualize ocean conditions in an interactive 3D environment.',
    features: ['3D ocean data visualization', 'Temperature, salinity and ocean current visualization', 'Depth and time-based exploration', 'Argo float observation integration', 'Model and observation comparison'],
    tech: ['React.js', 'Python', 'CesiumJS', 'NetCDF', 'APIs'], repo: LINKS.aquavisionRepo,
  },
  {
    id: 'customerhub', no: '02', title: 'CustomerHub', sub: 'JavaFX Customer Management System',
    desc: 'A desktop-based customer management application developed using JavaFX and MySQL to manage customer accounts, products and orders.',
    features: ['User registration and login', 'Customer profile management', 'Product browsing', 'Shopping cart', 'Order management', 'Password and account management'],
    tech: ['Java', 'JavaFX', 'MySQL', 'Maven', 'CSS'], repo: LINKS.customerhubRepo,
  },
];
