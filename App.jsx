import React from "./core/React.js";

let showBar = false;
let count = 10
function Content({num}) {
  function handleClick() {
    count++
    React.update()
    console.log('object');
  }
  return <div>Content: {count}
  <button onClick={handleClick}>click</button>
  </div>
}
function ContentContainer() {
  return  <Content num={10}></Content>
}
function App() {
  return (<div id="id">hi mini react
  {/* <ContentContainer></ContentContainer> */}
  <Content num={20}></Content>
  </div>);
}
export default App;
