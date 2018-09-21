import _ from "lodash";

class Thead {
  constructor() {
  }
  render(data, config) {
    const cfg = config;
    let html = [];
    html.push('<thead><tr>');
    data.forEach(d => {
      html.push(`<th style="
        border: ${cfg.table.border.borderWidth}px solid ${cfg.table.border.borderColor};
        padding-top: ${cfg.cell.space.topbottom}px;
        padding-bottom: ${cfg.cell.space.topbottom}px;
        padding-left: ${cfg.cell.space.leftright}px;
        padding-right: ${cfg.cell.space.leftright}px">
        ${d}</th>`
      )
    })
    html.push('</tr></thead>');
    return html.join('');
  }

}

export default Thead;