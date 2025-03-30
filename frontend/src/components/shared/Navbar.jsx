import React from "react";
import { Link, useNavigate } from "react-router"; 
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRole(null);
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
                    to="/manage-users"
                    className="hover:text-gray-200 transition duration-200"
                  >
                    Manage Users
                  </Link>
                  <Link
                    to="/manage-stores"
                    className="hover:text-gray-200 transition duration-200"
                  >
                    Manage Stores
                  </Link>
                  <Link
                    to="/settings"
                    className="hover:text-gray-200 transition duration-200"
                  >
                    Settings
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
