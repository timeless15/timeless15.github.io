import React from 'react';
import { NavLink } from 'dva/router';
import './index.less';

function Header() {
  return (
    <div className="nav-header">
      <div className="nav-title"><h1>HDV数据可视化平台</h1></div>
      <div className="nav-list-container">
        <div className="nav-list-items">
          <NavLink to="/screen" activeClassName="nav-selected"><span>我的可视化</span></NavLink>
          <NavLink to="/data" activeClassName="nav-selected"><span>我的数据</span></NavLink>
          <NavLink to="/components" activeClassName="nav-selected"><span>我的组件</span></NavLink>
          <NavLink to="/cases" activeClassName="nav-selected"><span>优秀案例和教程</span></NavLink>
        </div>
      </div>
    </div>
  );
}

export default Header;
