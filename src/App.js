import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddFood from './AddFood';
import Register from './Register';
import Login from "./Login";
import ProtectedRoute from './ProtectedRoute';

class App extends Component {
  constructor(props) {
    super(props);
    this.loggedIn = this.loggedIn.bind(this);
    this.state = {
      loggedIn: false,
      id: -1
    }
  }

  loggedIn(id) {
    this.setState({ loggedIn: true, id: id });
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
          </Switch>
      </div>
    );
  }
}

export default App;
