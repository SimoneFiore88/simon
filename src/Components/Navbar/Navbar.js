import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-screen  h-16 fixed flex items-center px-10 z-50 justify-between">
      <Link to="/">
        <h1 className="text-white font-electrolize text-2xl spike">
          SimoneFiore
        </h1>
      </Link>
      <div>
        <Link to="/shape/d4" className="mx-2">
          <i className="fal fa-dice-d4 text-yellow-300"></i>
        </Link>
        <Link to="/shape/d6" className="mx-2">
          <i className="fal fa-dice-d6 text-yellow-300"></i>
        </Link>
        <Link to="/shape/d8" className="mx-2">
          <i className="fal fa-dice-d8 text-yellow-300"></i>
        </Link>
        <Link to="/shape/d10" className="mx-2">
          <i className="fal fa-dice-d10 text-yellow-300"></i>
        </Link>
        <Link to="/moon" className="mx-2 text-white">
          Moon
        </Link>
      </div>
      {/* 
      <Link to="/">
        <i className="fal fa-home text-main"></i>
      </Link>
      <Link to="/">
        <i className="fal fa-home text-main"></i>
      </Link> */}
    </div>
  );
}
