import App from './App.tsx'
import { hydrate } from 'preact';

hydrate(<App />, document.getElementById('root')!);