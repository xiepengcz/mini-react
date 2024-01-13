function createTextNode(text) {
  return {
    type: "TEXT_NODE",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
function createElement(type, props, ...children) {
  return {
    type: type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'string' ? createTextNode(child) : child
      }),
    },
  };
}
function render(el, container) {
  let dom =
    el.type === "TEXT_NODE"
      ? document.createTextNode("")
      : document.createElement(el.type);
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });
  el.props.children.forEach((child) => {
    render(child, dom);
  });
  container.append(dom);
}

export default {
  render,
  createElement,
};
