import React from "react";
import { Link, Outlet } from "react-router-dom";
import { IoCreate } from "react-icons/io5";
import { IoHome } from "react-icons/io5";

function App() {
  return (
    <>
      <div className="nav-bar">
        <h1>Crochet Hub</h1>
        <div className="nav-tabs">
          <Link className="home-link" to="/">
            <IoHome />
          </Link>

          <Link className="create-link" to="/create">
            <IoCreate />
          </Link>
        </div>
      </div>

      {/* shows the children route components */}
      <Outlet />
    </>
  );
}

export default App;
