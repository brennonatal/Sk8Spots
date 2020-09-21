import React from 'react';
import './App.css';
// import { Card } from './components'
// import { Button } from './components'
import { Navbar } from './components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Home } from './pages'
import { AddSpot } from './pages'
import { Settings } from './pages'
import { Favorites } from './pages'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/add-spot' exact component={AddSpot} />
          <Route path='/settings' exact component={Settings} />
          <Route path='/favorites' exact component={Favorites} />
        </Switch>
      </Router>

    </>
  );
}

export default App;
