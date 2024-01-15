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
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
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
  root = nextWorkUnit;
}
let root = null;
let nextWorkUnit = null;
function workLoop(deadline) {
  let shouldYield = false;

  while (!shouldYield && nextWorkUnit) {
    nextWorkUnit = preformWorkOfUnit(nextWorkUnit);
    shouldYield = deadline.timeRemaining() > 0;
  }
  // 问题：用 requestIdleCallback 这个api ，当浏览器没有空闲时间时，渲染中途可能没有空余时间，用户会看到渲染一半的 dom, 解决思路：计算结束后统一添加到页面中。
  if (!nextWorkUnit && root) {
    // 如果没有新节点了 说明就代码遍历结束了
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

function commitRoot() {
  console.log("root", root);
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;

  while (!fiberParent.dom) {
    // 循环遍历 直到找到 dom 时，用于解决组件嵌套问题
    fiberParent = fiberParent.parent;
  }
  // 只有 fiber.dom存在时 才添加
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  const isFunctionType = typeof type === "function";
  if (isFunctionType) {
    console.log(type());
    return type();
  }
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

function initChild(fiber, children) {
  let prevChild = null;
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

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  // 3、转换链表 设置指针 处理FunctionComponent
  initChild(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 1、创建dom
    let dom = (fiber.dom = createDom(fiber.type));
    // 2、处理 props
    updateProps(fiber.props, dom);
  }
  const children = fiber.props.children;
  // 3、转换链表 设置指针 处理FunctionComponent
  initChild(fiber, children);
}

function preformWorkOfUnit(fiber) {
  let isFunctionComponent = typeof fiber.type === "function";
  if (!isFunctionComponent) {
    updateHostComponent(fiber);
  } else {
    updateFunctionComponent(fiber);
  }
  // 4、返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  } else {
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) return nextFiber.sibling;
      nextFiber = nextFiber.parent;
    }
  }
}

requestIdleCallback(workLoop);

export default {
  render,
  createElement,
};
