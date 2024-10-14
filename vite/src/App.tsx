import { useEffect } from 'react';
import './App.css'
import BrellaStats from './components/BrellaStats.tsx';
import { analytics } from './main.tsx';

async function updateAnalytics() {
  const res = await fetch("/api/analytics");
  if (res.ok) {
    analytics(await res.json());
    globalThis.window.dispatchEvent(new Event("custom:update-analytics"));
  }
}

function App() {
  useEffect(() => {
    updateAnalytics();
    const timer = setInterval(updateAnalytics, 5000);

    return () => clearInterval(timer);
  });

  return (
    <>
      <h1>NorthWestWind's Brella Counter</h1>
      <BrellaStats />
    </>
  )
}

export default App
