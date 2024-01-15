import React from "./core/React.js";
function Content({num}) {
  return <div>Content: {num}</div>
}
function ContentContainer() {
  return  <Content num={10}></Content>
}
function App() {
  return (<div id="id">hi mini react
  <ContentContainer></ContentContainer>
  <Content num={20}></Content>
  </div>);
}
export default App;
