import _ from "lodash";
import Row from './row';

class Tbody {
  constructor() {
  }
  render(data, config) {
    const cfg = config;
    let html = [];
    const row = new Row()
    html.push('<tbody');
    data.forEach(d => {
      html.push(row.render(d, cfg));
    })
    html.push('</tbody>');
    return html.join('');
  }
}

export default Tbody;