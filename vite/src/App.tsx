import { useEffect } from 'react';
import './App.css'
import BrellaStats from './components/BrellaStats.tsx';
import { analytics, today } from './main.tsx';
import TotalStats from './components/TotalStats.tsx';
import About from './components/About.tsx';
import TeamStats from './components/TeamStats.tsx';
import TodayStats from './components/TodayStats.tsx';

async function updateAnalytics() {
  let res = await fetch("/api/analytics");
  if (res.ok) {
    analytics(await res.json());
    globalThis.window.dispatchEvent(new Event("custom:update-analytics"));
  }
  res = await fetch("/api/today");
  if (res.ok) {
    const json = await res.json();
    today({
      brellas: json.brellas,
      games: json.games
    });
    globalThis.window.dispatchEvent(new Event("custom:update-today"));
  }
  // testing
  /*const original = analytics()!;
  original.totalGames += Math.floor(Math.random() * 3);
  original.totalBrellas += Math.min(Math.floor(Math.random() * 3), original.totalGames - original.totalBrellas);
  for (const key in original.specifics) {
    (original.specifics as any)[key] += Math.floor(Math.random() * 3);
  }
  analytics(original);
  globalThis.window.dispatchEvent(new Event("custom:update-analytics"));*/
}

function App() {
  useEffect(() => {
    updateAnalytics();
    const timer = setInterval(updateAnalytics, 5000);

    return () => clearInterval(timer);
  });

  return (
    <>
      <h1 className='unimportant'>NorthWestWind's Brella Counter</h1>
      <TodayStats />
      <TotalStats />
      <TeamStats />
      <BrellaStats />
      <About />
    </>
  )
}

export default App
