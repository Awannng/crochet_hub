import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { IoCreate } from "react-icons/io5";
import { IoHome } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { UserAuth } from "../context/AuthContext";

function App() {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  // sign out of thr page
  const handleSignOut = async (e) => {
    e.preventDefault();
    await signOut();
    navigate("/signin");
  };
  return (
    <>
      {/* this shows on every page */}
      <div className="nav-bar">
        <h1>Crochet Hub</h1>
        <div className="nav-tabs">
          <Link className="home-link" to="/">
            <IoHome />
          </Link>

          <Link className="create-link" to="/create">
            <IoCreate />
          </Link>

          <Link className="profile-link">
            <CgProfile />
          </Link>

          <Link className="signout-link" onClick={handleSignOut}>
            <FaSignOutAlt />
          </Link>
        </div>
      </div>

      {/* shows the children route components, shows the index HomePage by default */}
      <Outlet />
    </>
  );
}

export default App;
