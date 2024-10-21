import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

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