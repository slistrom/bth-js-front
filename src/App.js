import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import logo from './images/logo192.png';
import './normalize.css';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

function App() {
    return (
        <div className="app">
            <div className="header">
                <img src={logo} className="app-logo" alt="logo" />
                <h1 className="heading">One Place</h1>
            </div>
            <div className="content">
                <div className="menu leftmenu">
                    <p><Link to="/">Home</Link></p>
                    <p><Link to="/login">Login</Link></p>
                </div>
                <div className="article">
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                    </Switch>
                </div>
            </div>
            <div className="footer">Copywrite One Place</div>
        </div>
    );
}

export default App;
