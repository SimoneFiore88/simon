import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Scene } from "three";

import "./App.css";
//import Scene from "./Components/Scene/Scene";
import Scene1 from "./Components/Scene/Scene1";
import Test from "./Components/Test/Test";

function App() {
  return (
    <Router>
      <div style={{ display: "none" }}>
        <Link
          style={{ position: "absolute", zIndex: "999", color: "white" }}
          to="/"
        >
          home
        </Link>
        <Link
          style={{
            position: "absolute",
            left: "120px",
            zIndex: "999",
            color: "white",
          }}
          to="/test"
        >
          test
        </Link>

        <Link
          style={{
            position: "absolute",
            left: "240px",
            zIndex: "999",
            color: "white",
          }}
          to="/same"
        >
          same
        </Link>
      </div>
      <Switch>
        <Route path="/same">
          aas <Scene1 />
        </Route>
        <Route path="/test">
          <Test />
        </Route>
        <Route path="/">
          <Scene1 />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
