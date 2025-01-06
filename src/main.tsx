import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app';

import './i18n';
import './index.css'

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
