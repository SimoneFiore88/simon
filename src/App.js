import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Scene } from "three";

import "./App.css";
//import Scene from "./Components/Scene/Scene";
import Scene1 from "./Components/Scene/Scene1";
import Test from "./Components/Test/Test";
import Cube from "./Components/Cube/Cube";
import Moon from "./Components/Moon/Moon";
import Mars from "./Components/Mars/Mars";
import Mars2 from "./Components/Mars/Mars2";
import Navbar from "./Components/Navbar/Navbar";
import Scene2 from "./Components/Scene/Scene2";

export default function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Navbar />

      <Switch>
        <Route path="/shape/:shape">
          {/* <Test /> */}
          <Cube />
        </Route>
        <Route exact path="/surface">
          {/* <Moon /> */}
          <Scene2 />
        </Route>
        <Route path="/">
          <Mars />
          {/* <Scene2 /> */}
        </Route>
      </Switch>
    </Router>
  );
}