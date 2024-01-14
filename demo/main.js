let dom = document.createElement("div");
dom.id = "id";
let textNode = document.createTextNode("");
textNode.nodeValue = "app";

dom.append(textNode);

document.querySelector("#root").append(dom);
 let taskId = -1;
 // 任务调试dom
function workLoop(deadline) {
  taskId++
  let shouldYield = false;
 
  console.log(deadline.timeRemaining());
  while (!shouldYield) {
    console.log('run ', taskId, 'task')
    shouldYield = deadline.timeRemaining() > 0;
  }
  requestIdleCallback(workLoop);
}

// requestIdleCallback(workLoop)
