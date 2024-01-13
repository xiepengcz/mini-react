import React from "./core/React.js";
import ReactDOM from "./core/ReactDom.js";

const App = React.createElement("div", { id: "id" }, "app");
ReactDOM.createRoot(document.querySelector("#root")).render(App);
