class Thead {
  constructor() {
  }
  render(data, config) {
    const cfg = config;
    let html = [];
    if(!cfg.head.show){
      return [];
    }
    const thStyle = `
      border: ${cfg.table.border.borderWidth}px solid ${cfg.table.border.borderColor};
      padding-top: ${cfg.cell.space.topbottom}px;
      padding-bottom: ${cfg.cell.space.topbottom}px;
      padding-left: ${cfg.cell.space.leftright}px;
      padding-right: ${cfg.cell.space.leftright}px;
      border-right: ${cfg.column.cutline.borderWidth}px solid ${cfg.column.cutline.borderColor};
      border-left: ${cfg.column.cutline.borderWidth}px solid ${cfg.column.cutline.borderColor};
    `;
    const headStyle = `
      color: ${cfg.head.textStyle.color};
      font-size: ${cfg.head.textStyle.fontSize}px;
      font-weight: ${cfg.head.textStyle.fontWeight};
      text-align: ${cfg.head.textStyle.align};
      background-color: ${cfg.head.bgColor}";
      border-top: ${cfg.row.cutline.borderWidth}px solid ${cfg.row.cutline.borderColor};
      border-bottom: ${cfg.row.cutline.borderWidth}px solid ${cfg.row.cutline.borderColor};
    `;
    html.push(`<thead><tr style="${headStyle}">`);
    data.forEach(d => {
      html.push(`<th style="${thStyle}">${d}</th>`)
    })
    html.push('</tr></thead>');
    return html.join('');
  }
}