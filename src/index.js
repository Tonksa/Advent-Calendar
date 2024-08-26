import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './js/App.js';
import './scss/app.scss'; // Ensure your styles are imported

const root = createRoot(document.getElementById('advent-calendar'));

root.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
        </Routes>
    </Router>
);
