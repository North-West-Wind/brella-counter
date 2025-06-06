import { hydrate } from 'preact';
import Uploader from './Uploader.tsx';

hydrate(<Uploader />, document.getElementById('root')!);