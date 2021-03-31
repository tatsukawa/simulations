import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import KuramotoModelPage from './pages/KuramotoModelPage';
import IsingModelPage from './pages/IsingModelPage';
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

            <div className="navbar-menu">
              <div className="navbar-start">
                <Link to="/kuramoto-model" className="navbar-item"> 蔵本モデル </Link>
                <Link to="/ising-model" className="navbar-item"> イジングモデル </Link>
              </div>
            </div>
          </nav>        
        </header>

        <div className="container space">
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/kuramoto-model">
            <KuramotoModelPage />
          </Route>
          <Route path="/ising-model">
            <IsingModelPage />
          </Route>
        </Switch>
        </div>
      </Router>

      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            © 2021 tatsukawa 
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
