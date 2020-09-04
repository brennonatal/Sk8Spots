import React from 'react';
import './App.css';
// import { Card } from './components'
// import { Button } from './components'
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home/Home'
import AddSpot from './pages/AddSpot/AddSpot'
import Settings from './pages/Settings-page/Settings'


function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/add-spot' exact component={AddSpot} />
          <Route path='/settings' exact component={Settings} />
        </Switch>
      </Router>

    </>
  );
}

export default App;
