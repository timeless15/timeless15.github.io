// 触发方式为item时, 图形默认绑定的事件对象
export const bindItemConfig = {
  scatter: 'circle',
  line: 'circle',
  bar: 'rect',
  pie: '.arc',
  tornadoBar: 'rect'
};

export const getSingleton = (Fn) => {
  let instance = null;
  return () => {
    instance = instance || new Fn();
    return instance;
  };
};
