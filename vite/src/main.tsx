import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const internal: { analytics: any } = {
  analytics: {}
};

export function analytics(ne?: any) {
  if (ne !== undefined) internal.analytics = ne;
  return internal.analytics;
}