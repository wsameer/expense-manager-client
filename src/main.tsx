import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClickToComponent } from 'click-to-react-component';

import { App } from './app';

import './i18n';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

createRoot(root).render(
  <StrictMode>
    <App />
    <ClickToComponent />
  </StrictMode>,
);
