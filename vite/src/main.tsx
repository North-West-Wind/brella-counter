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

const internal: Partial<{ analytics: Analytics }> = {};

export function analytics(ne?: Analytics) {
  if (ne !== undefined) internal.analytics = ne;
  return internal.analytics;
}