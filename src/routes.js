import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import repository from './pages/repository/index'
import Main from './pages/main/index';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/repository/:repository" component={repository} />
        < Route exact path="/" component={Main} />
      </Switch>
    </BrowserRouter>
  )

}
