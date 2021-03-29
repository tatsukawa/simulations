import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Home from './pages/Home';
import KuramotoModel from './pages/KuramotoModel';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Router>      
        <header className="App-header">
          <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
              <a className="navbar-item" href="/">
                シミュレーション
              </a>

              <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
              <div className="navbar-start">
                <Link to="/kuramoto-model" className="navbar-item"> 蔵本モデル </Link>
              </div>
            </div>
          </nav>        
        </header>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/kuramoto-model">
            <KuramotoModel />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
