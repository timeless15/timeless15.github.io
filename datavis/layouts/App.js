import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Header from 'components/Layout/Header';
import classNames from 'classnames';
import styles from './App.less';
import {
  Cases, Com, Screen, Data
} from '../routes';

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
};

function getPageTitle() {
  const title = '网新恒天HDV数据可视化平台';
  return title;
}

function redirect() {
  return (<Redirect to="/screen" />);
}

class App extends React.PureComponent {
  render() {
    const { location } = this.props;

    const layout = (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.main}>
          <TransitionGroup>
            <CSSTransition
              key={location.pathname}
              classNames="fade"
              timeout={400}
            >
              <Switch location={location}>
                <Route path="/" exact render={redirect} />
                <Route path="/screen" component={Screen} />
                <Route path="/data" component={Data} />
                <Route path="/components" component={Com} />
                <Route path="/cases" component={Cases} />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    );

    return (
      <DocumentTitle title={getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect()(App);
