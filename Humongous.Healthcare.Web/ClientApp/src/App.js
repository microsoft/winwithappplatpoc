import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { HealthCheckList } from './components/HealthCheckList';
import { AddHealthCheck } from './components/AddHealthCheck';

import './custom.css'

export default class App extends Component {
  // eslint-disable-next-line
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/health-checks' component={HealthCheckList} />
        <Route path='/submit-health-check' component={AddHealthCheck} />
      </Layout>
    );
  }
}
