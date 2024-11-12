import './App.css'
import BrellaStats from './components/BrellaStats.tsx';
import TotalStats from './components/TotalStats.tsx';
import About from './components/About.tsx';
import TeamStats from './components/TeamStats.tsx';
import TodayStats from './components/TodayStats.tsx';
import Background from './components/Background.tsx';
import { Analytics, Brellas, defaultAnalytics, defaultToday, Today } from './server/common.ts';
import { setSeed } from './helper/color.ts';
import { decodeServerData } from './helper/decode.ts';
import Details from './components/Details.tsx';
import { useEffect, useState } from 'preact/hooks';

export type { Brellas, Today };

const internal: {
	analytics: Analytics,
	today: Today,
} = {
	analytics: defaultAnalytics(),
	today: defaultToday(),
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
			const { analytics: an, today: to, seed: se } = decodeServerData(data);
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

  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      const events = new EventSource("/api/events");
  
      events.onmessage = event => {
        const { analytics: a, today: t } = JSON.parse(event.data);
        analytics(a);
        today(t);
        globalThis.window.dispatchEvent(new Event("brella-update"));
      };

      setListening(true);
    }
  }, [listening]);

  return (
    <>
      <Background />
      <h1 className='unimportant'>NorthWestWind's Brella Counter</h1>
      <TodayStats />
      <BrellaStats />
      <h1 className='unimportant'>Cumulative Stats</h1>
      <TotalStats />
      <TeamStats />
      <Details />
      <About />
    </>
  )
}

export default App
