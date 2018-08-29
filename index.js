import App from "./src/client/App";
import React from "react";
import ReactDOM from "react-dom";
// import main from

document.addEventListener("DOMContentLoaded", () => {
    var mountNode = document.getElementById("app");
    ReactDOM.render(<App />, mountNode);
    // main();
});
