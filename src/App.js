import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import Box from "./Components/Box/Box";
import Scene from "./Components/Scene/Scene";
/* import Scene1 from "./Components/Scene/Scene1";
import Test from "./Components/Test/Test";

import Moon from "./Components/Moon/Moon"; */
import Mars from "./Components/Mars/Mars";
/* import Mars2 from "./Components/Mars/Mars2";
import Navbar from "./Components/Navbar/Navbar"; */
import Scene2 from "./Components/Scene/Scene2";
import Home from "./Components/Home/Home";
import Home2 from "./Components/Home/Home2";
import Home3 from "./Components/Home/Home3";
/* import Box from "./Components/Box/Box";
import Earth from "./Components/Home/Earth";
import Info from "./Components/Info/Info";
import { useState } from "react"; */
import Topbar from "./Components/Topbar/Topbar";
import Model from "./Components/Model/Model";
/* import In from "./Components/Mars/In"; */

import Main from "./Components/Main/Main";
import Main2 from "./Components/Surf/Surf";

export default function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      {/* <Navbar /> */}
      <Topbar />
      <Switch>
        <Route exact path="/">
          {/* <Model /> */}
          {/* <Mars2 /> */}
          {/* <In /> */}
          <Main />
        </Route>
        <Route exact path="/home1">
          <Home />
        </Route>
        <Route exact path="/surface">
          {/* <Scene2 /> */}
          <Main2 />
        </Route>
        <Route exact path="/home2">
          <Home2 />
        </Route>
        <Route exact path="/home3">
          <Home3 />
        </Route>
        <Route exact path="/mars2">
          {/* <Home3 /> */}
          {/* <Mars2 /> */}
          {/* <Earth /> */}
          <Mars />
        </Route>
        <Route exact path="/model">
          {/* <Home3 /> */}
          <Model />
        </Route>
        <Route exact path="/main">
          <Main />
        </Route>
      </Switch>
    </Router>
  );
}
