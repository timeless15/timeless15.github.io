class Row {
  constructor() {
  }
  render(data, config, index) {
    const cfg = config;
    let html = [];
    let rowStyle = `
      border-top: ${cfg.row.cutline.borderWidth}px solid ${cfg.row.cutline.borderColor};
      border-bottom: ${cfg.row.cutline.borderWidth}px solid ${cfg.row.cutline.borderColor};
    `;
    const commonStyle = `
      border: ${cfg.table.border.borderWidth}px solid ${cfg.table.border.borderColor};
      padding-top: ${cfg.cell.space.topbottom}px;
      padding-bottom: ${cfg.cell.space.topbottom}px;
      padding-left: ${cfg.cell.space.leftright}px;
      padding-right: ${cfg.cell.space.leftright}px;
      border-right: ${cfg.column.cutline.borderWidth}px solid ${cfg.column.cutline.borderColor};
      border-left: ${cfg.column.cutline.borderWidth}px solid ${cfg.column.cutline.borderColor};
    `;
    const firstColStyle = `
      color: ${cfg.column.first.textStyle.color};
      font-size: ${cfg.column.first.textStyle.fontSize}px;
      font-weight: ${cfg.column.first.textStyle.fontWeight};
      background-color: ${cfg.column.first.bgColor};
      text-align: ${cfg.column.first.align};
    `;
    const secondColStyle = `
      color: ${cfg.column.second.textStyle.color};
      font-size: ${cfg.column.second.textStyle.fontSize}px;
      font-weight: ${cfg.column.second.textStyle.fontWeight};
      background-color: ${cfg.column.second.bgColor};
      text-align: ${cfg.column.second.align};
    `;

    if(cfg.row.striped && index%2=== 1) {
      rowStyle += "background-color: #0A2732";
    }

    html.push(`<tr style="${rowStyle}">`);

    data.forEach((d, index) => {
      if(index === 0) {
        html.push(`<td style="${commonStyle}${firstColStyle}">${d}</td>`)
      }else if(index === 1) {
        html.push(`<td style="${commonStyle}${secondColStyle}">${d}</td>`)
      }else {
        html.push(`<td style="${commonStyle}">${d}</td>`)
      }
    })
    html.push('</tr>');
    return html.join('');
  }
}