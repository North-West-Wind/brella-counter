import { useEffect } from 'react';
import './App.css'
import BrellaStats from './components/BrellaStats.tsx';
import TotalStats from './components/TotalStats.tsx';
import About from './components/About.tsx';
import TeamStats from './components/TeamStats.tsx';
import TodayStats from './components/TodayStats.tsx';
import Background from './components/Background.tsx';

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

export type Brellas = {
	spygadget: number, // vunder
	spygadget_sorella: number, // sunder
	parashelter: number, // vbrella
	parashelter_sorella: number, // sbrella
	order_shelter_replica: number, // order brella
	campingshelter: number, // vtent
	campingshelter_sorella: number, // stent
	brella24mk1: number, // recycled 1
	brella24mk2: number, // recycled 2
}

export type Analytics = {
	firstRecord: string,
	totalGames: number,
	totalBrellas: number,
	ourBrellas: number,
	otherBrellas: number,
	specifics: Brellas
}

export type Today = {
	brellas: number,
	games: number
}

const internal: {
	analytics: Analytics,
	today: Today
} = {
	analytics: defaultAnalytics(),
	today: {
		brellas: 0,
		games: 0
	}
};

export function analytics(ne?: Analytics) {
  if (ne !== undefined) internal.analytics = ne;
  return internal.analytics;
}

export function today(ne?: Today) {
	if (ne !== undefined) internal.today = ne;
	return internal.today;
}

function defaultAnalytics() {
	return {
		firstRecord: "",
		totalGames: 0,
		totalBrellas: 0,
		ourBrellas: 0,
		otherBrellas: 0,
		specifics: defaultBrellas(),
	} as Analytics;
}

function defaultBrellas() {
	return {
		spygadget: 0, // vunder
		spygadget_sorella: 0, // sunder
		parashelter: 0, // vbrella
		parashelter_sorella: 0, // sbrella
		order_shelter_replica: 0, // order brella
		campingshelter: 0, // vtent
		campingshelter_sorella: 0, // stent
		brella24mk1: 0, // recycled 1
		brella24mk2: 0, // recycled 2
	} as Brellas;
}

function App() {
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
