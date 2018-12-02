import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import App from './layouts/App';
import Template from './routes/Project/Template';
import Editor from './routes/Project/Editor';
import Preview from './routes/Project/Preview';
import Operator from './routes/Data/Operator';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/screen_create" exact component={Template} />
        <Route path="/screen/:id" exact component={Editor} />
        <Route path="/screen/preview/:id" exact component={Preview} />
        <Route path="/data/:id" exact component={Operator} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
