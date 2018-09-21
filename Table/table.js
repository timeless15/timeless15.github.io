import _ from 'lodash';
import Thead from './thead';
import Tbody from "./tbody"

class Table {
  constructor(container, config) {
    this.config = config;
    this.container = container;
    this._data = {};
    this.init(config);
  }

  init(config) {
    this.mergeConfig(config);
  }

  render(data, config) {
    const cfg = this.mergeConfig(config);
    const head = new Thead();
    const body = new Tbody();
    let html = '';

    this.setData(data);

    html = `<table style="font-family: ${cfg.table.textStyle.fontFamily};
            color: ${cfg.table.textStyle.color};">
            ${head.render(this._data.thead, cfg)}
            ${body.render(this._data.tbody, cfg)}
            </table>`
    document.querySelector(this.container).innerHTML = html;

  }

  setData(data) {
    const header = [];
    const rowData = [];
    data.map((item, index) => {
      header.push(item.name);
      if(index === 0){
        item.data.forEach(d => {
          rowData.push([d]);
        })
      }else{
        item.data.forEach((d, i) => {
          rowData[i].push(d);
        })
      }
    })
    this._data.thead = header;
    this._data.tbody = rowData; 
  }

  mergeConfig(config) {
    if (!config) { return this.config; }
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  }
}

export default Table;