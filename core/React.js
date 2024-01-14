function createTextNode(text) {
  return {
    type: "TEXT_ElEMENT",
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
        return typeof child === "string" ? createTextNode(child) : child;
      }),
    },
  };
}
function render(el, container) {
  nextWorkUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // let dom =
  //   el.type === "TEXT_ElEMENT"
  //     ? document.createTextNode("")
  //     : document.createElement(el.type);
  // Object.keys(el.props).forEach((key) => {
  //   if (key !== "children") {
  //     dom[key] = el.props[key];
  //   }
  // });
  // el.props.children.forEach((child) => {
  //   render(child, dom);
  // });
  // container.append(dom);
}

let nextWorkUnit = null;
function workLoop(deadline) {
  let shouldYield = false;

  while (!shouldYield && nextWorkUnit) {
    nextWorkUnit = preformWorkOfUnit(nextWorkUnit);
    shouldYield = deadline.timeRemaining() > 0;
  }
  requestIdleCallback(workLoop);
}

function createDom(type) {
  return type === "TEXT_ElEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(props, dom) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });
}

function initChild(fiber) {
  let prevChild = null;
  const children = fiber.props.children;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber; // 绑定兄弟节点
    }
    prevChild = newFiber;
  });
}

function preformWorkOfUnit(fiber) {
  // 1、创建dom
  if (!fiber.dom) {
    let dom = (fiber.dom = createDom(fiber.type));

    fiber.parent.dom.append(dom);
    // 2、处理 props
    updateProps(fiber.props, dom);
  }
  // 3、转换链表 设置指针
  initChild(fiber);
  // 4、返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  } else if (fiber.sibling) {
    return fiber.sibling;
  } else {
    return fiber.parent?.sibling;
  }
}

requestIdleCallback(workLoop);

export default {
  render,
  createElement,
};
