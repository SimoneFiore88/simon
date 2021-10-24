import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="w-screen  h-16 fixed flex items-center px-10">
      <h1 className="text-white font-electrolize text-2xl">
        <span className="text-yellow-400">/</span>SimoneFiore
      </h1>
      {/* <Link to="/">
        <i className="fal fa-home text-main"></i>
      </Link>
      <Link to="/">
        <i className="fal fa-home text-main"></i>
      </Link>
      <Link to="/">
        <i className="fal fa-home text-main"></i>
      </Link> */}
    </div>
  );
}
