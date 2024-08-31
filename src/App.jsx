import React from 'react'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero';
function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <div className={`${darkMode ? "bg-slate-950" : "bg-zinc-100"} min-h-screen`}>
  <Navbar darkMode={darkMode} />
  <Hero darkMode={darkMode} />
</div>
  )
}

export default App