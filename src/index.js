import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './js/App.js';

const root = createRoot(document.getElementById('advent-calendar'));
root.render(
    <App />
);