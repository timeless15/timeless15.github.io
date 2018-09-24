import _ from 'lodash';
import Table from './table';

class Base {
  constructor(container, config) {
    this.config = {};
    this.container = container;
    this.apis = config.apis;
    this._data = null;
    this.chart = null;
    this.init(config);
  }

  init(config) {
    this.mergeConfig(config);
    this.chart = new Table(`#${this.container}`);
  }

  render(data, config) {
    data = this.data(data);
    const cfg = this.mergeConfig(config);
    this.chart.render(data, cfg);
  }

  setData(data) {
    const cfg = this.config;
    console.log(cfg, data);
    return cfg;
  }

  data(data) {
    if(data) {
      this._data = data;
    }
    return this._data;
  }

  mergeConfig(config) {
    if(!config) {
      return this.config;
    }
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  }
}

export default Base;