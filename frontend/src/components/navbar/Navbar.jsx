import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="">
      <div className="">
        <Link to="/" className="">
          Store Rating App
        </Link>
      </div>
      <div className="">
        {user ? (
          <>
            {user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
            {user.role === "user" && <Link to="/user">Stores</Link>}
            {user.role === "owner" && <Link to="/owner">My Store</Link>}
            <Link to="/settings">Settings</Link>
            <button onClick={handleLogout} className="">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
