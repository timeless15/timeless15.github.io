import _ from "lodash";

class Row {
  constructor() {
  }
  render(data, config) {
    const cfg = config;
    let html = [];
    html.push('<tr>');
    data.forEach(d => {
      html.push(`<td style="
        border: ${cfg.table.border.borderWidth}px solid ${cfg.table.border.borderColor};
        padding-top: ${cfg.cell.space.topbottom}px;
        padding-bottom: ${cfg.cell.space.topbottom}px;
        padding-left: ${cfg.cell.space.leftright}px;
        padding-right: ${cfg.cell.space.leftright}px">
        ${d}</td>`
      )
    })
    html.push('</tr>');
    return html.join('');
  }

}

export default Row;