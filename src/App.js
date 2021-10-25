import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Scene } from "three";

import "./App.css";
//import Scene from "./Components/Scene/Scene";
import Scene1 from "./Components/Scene/Scene1";
import Test from "./Components/Test/Test";
import Cube from "./Components/Cube/Cube";
import Navbar from "./Components/Navbar/Navbar";
import Scene2 from "./Components/Scene/Scene2";

export default function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Navbar />
      <div
        style={{
          display: "none",
          position: "fixed",
          top: "120px",
          background: "#ff0000",
          zIndex: "999",
          width: "300px",
          height: "20px",
        }}
      >
        <Link
          style={{ position: "absolute", zIndex: "999", color: "white" }}
          to="/"
        >
          home
        </Link>
      </div>
      <Switch>
        <Route path="/shape/:shape">
          {/* <Test /> */}
          <Cube />
        </Route>
        <Route path="/">
          {/* <Scene1 /> */}
          <Scene2 />
        </Route>
      </Switch>
    </Router>
  );
}
