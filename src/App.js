import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddFood from './AddFood';
import Register from './Register';
import Login from "./Login";
import Settings from './Settings2'
import ProtectedRoute from './ProtectedRoute';
import FoodPage from './FoodPage'

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <ProtectedRoute exact path="/" component={Dashboard} />
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
          <ProtectedRoute exact path="/add" component={AddFood} />
          <ProtectedRoute exact path="/settings" component={Settings}/>
          <ProtectedRoute exact path="/food" component={FoodPage}/>
        </Switch>
      </div>
    );
  }
}

export default App;
