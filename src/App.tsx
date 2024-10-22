import { useEffect } from 'react';
import './App.css'
import BrellaStats from './components/BrellaStats.tsx';
import TotalStats from './components/TotalStats.tsx';
import About from './components/About.tsx';
import TeamStats from './components/TeamStats.tsx';
import TodayStats from './components/TodayStats.tsx';
import Background from './components/Background.tsx';
import { Analytics, Brellas, defaultAnalytics } from './server/common.ts';
import { setSeed } from './helper/color.ts';

export type { Brellas };

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
}

export type Today = {
	brellas: number,
	games: number
}

const internal: {
	analytics: Analytics,
	today: Today,
} = {
	analytics: defaultAnalytics(),
	today: {
		brellas: 0,
		games: 0
	},
};

export function analytics(ne?: Analytics) {
  if (ne !== undefined) internal.analytics = ne;
  return internal.analytics;
}

export function today(ne?: Today) {
	if (ne !== undefined) internal.today = ne;
	return internal.today;
}

function App(props: { analytics?: Analytics, today?: Today, seed?: number }) {
	if (!props.analytics && !props.today && props.seed === undefined) {
		// used by client to get server data
		const root = document.getElementById("root")!;
		const data = root.getAttribute("data-server");
		if (data) {
			const { analytics: an, today: to, seed: se } = JSON.parse(data);
			analytics(an);
			today(to);
      setSeed(se);
		}
	} else {
		// used by server when we directly pass data
		if (props.analytics) analytics(props.analytics);
		if (props.today) today(props.today);
    if (props.seed) setSeed(props.seed);
	}

  useEffect(() => {
    updateAnalytics();
    const timer = setInterval(updateAnalytics, 5000);

    return () => clearInterval(timer);
  });

  return (
    <>
      <Background />
      <h1 className='unimportant'>NorthWestWind's Brella Counter</h1>
      <TodayStats />
      <BrellaStats />
      <TotalStats />
      <TeamStats />
      <About />
    </>
  )
}

export default App
