import React from 'react';
import logo from './images/logo192.png';
import './normalize.css';
import './App.css';

function App() {
    return (
        <div className="app">
            <div className="header">
                <img src={logo} className="app-logo" alt="logo" />
                <h1 className="heading">One Place</h1>
            </div>
            <div className="content">
                <div className="menu leftmenu">Stuff</div>
                <div className="article">
                    <p>
                      This is a start
                    </p>
                </div>
            </div>
            <div className="footer">Copywrite One Place</div>
        </div>
    );
}

export default App;
