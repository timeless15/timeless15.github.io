class Tbody {
  constructor() {
  }
  render(data, config) {
    const cfg = config;
    let html = [];
    const row = new Row();
    html.push('<tbody>');
    data.forEach((d, index) => {
      html.push(row.render(d, cfg, index));
    })
    html.push('</tbody>');
    return html.join('');
  }
}