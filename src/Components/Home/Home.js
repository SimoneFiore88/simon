import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Scene } from "three";

//import Scene from "./Components/Scene/Scene";
import Scene1 from "./../Scene/Scene1";

function Home() {
  return (
    <>
      <Scene1 />
    </>
  );
}

export default Home;
