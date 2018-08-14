import App from "./front/App";
import React from "react";
import ReactDOM from "react-dom";

document.addEventListener("DOMContentLoaded", () => {
  var mountNode = document.getElementById("app");
  ReactDOM.render(<App name="Jane" />, mountNode);
});
