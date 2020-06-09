import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from "./Homepage/Homepage";
import Admin from "./Admin/Admin";

function App() {
  return (
    <Router>
    < Switch>  
        <div>
          <Route exact path="/" component={Homepage}/>
          <Route exact path="/admin" component={Admin}/>
        </div>
      </Switch>
    </Router>
  );
}

export default App;
