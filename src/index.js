import React from "react"; // For IE 9-11 support
import ReactDOM from "react-dom";
import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/ie9";
// import './index.css';
import App from "./App";
import "./polyfill";
import * as serviceWorker from "./serviceWorker";
String.prototype.isNullOrWhitespace = function() {
  const input = String(this);
  if (typeof input === undefined || input == null) return true;

  return input.replace(/\s/g, "").length < 1;
};
ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
