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
import Home from "./Components/Home/Home";
import Home2 from "./Components/Home/Home2";
import Home3 from "./Components/Home/Home3";
import Box from "./Components/Box/Box";
import Earth from "./Components/Home/Earth";
import Info from "./Components/Info/Info";
import { useState } from "react";

export default function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      {/* <Navbar /> */}

      <Switch>
        <Route exact path="/">
          {/* <Moon /> */}
          {/* <Scene2 /> */}
          <Mars2 />
        </Route>
        <Route exact path="/home1">
          <Home />
        </Route>
        <Route exact path="/home2">
          <Home2 />
        </Route>
        <Route exact path="/home3">
          <Home3 />
        </Route>
        <Route exact path="/mars2">
          {/* <Home3 /> */}
          <Mars2 />
        </Route>
      </Switch>
    </Router>
  );
}
