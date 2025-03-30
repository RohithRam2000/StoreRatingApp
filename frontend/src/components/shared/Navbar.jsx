import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import { RoleContext } from "../../App";

const Navbar = () => {
  const navigate = useNavigate();
  const { role, setRole } = useContext(RoleContext);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, [setRole]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null); // Clear role in context
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/dashboard";
    if (role === "storeowner") return "/dashboard";
    if (role === "user") return "/dashboard";
    return "/";
  };

  return (
    <nav className="bg-blue-500 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-lg font-bold">
          <Link
            to={role ? getDashboardLink() : "/"}
            className="hover:text-gray-200"
          >
            Store Rating App
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {role ? (
            <>
              {role === "admin" && (
                <>
                  <Link
                    to="/dashboard"
                    className="hover:text-gray-200 transition duration-200"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/add-users"
                    className="hover:text-gray-200 transition duration-200"
                  >
                    Add Users
                  </Link>
                  <Link
                    to="/add-stores"
                    className="hover:text-gray-200 transition duration-200"
                  >
                    Add Stores
                  </Link>

                </>
              )}

              {(role === "storeowner" || role === "user") && (
                <>
                  <Link
                    to="/change-password"
                    className="hover:text-gray-200 transition duration-200"
                  >
                    Change Password
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-200 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
