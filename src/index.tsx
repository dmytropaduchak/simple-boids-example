import { createRoot } from 'react-dom/client';
import { App } from './app/app';
import './index.css';

const html = document.getElementById('root') as HTMLElement;
const root = createRoot(html);

root.render(<App />);
