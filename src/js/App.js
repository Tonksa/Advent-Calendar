import React from 'react';
import logo from '../images/logo.svg';
import '../scss/app.scss';
import Header from './components/Header';
import Slot from './components/Slot';

function App() {
    return (
        <>
            <Header />
            <Slot />
        </>
    );
}

export default App;
