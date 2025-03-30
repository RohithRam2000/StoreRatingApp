import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignUpPage";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import UserDashboard from "./components/dashboard/UserDashboard";
import OwnerDashboard from "./components/dashboard/OwnerDashboard";
import HomePage from "./components/home/HomePage";
import Navbar from "./components/shared/Navbar";
import ChangePassword from "./components/auth/ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RoleContext = createContext();

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");

    if (!token || !allowedRoles.includes(role)) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const getDashboard = () => {
    if (role === "admin") return <AdminDashboard />;
    if (role === "user") return <UserDashboard />;
    if (role === "storeowner") return <OwnerDashboard />;
    return <Navigate to="/login" />;
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <Router>
        <div>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage setRole={(role) => setRole(role)} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "user", "storeowner"]}>
                  {getDashboard()}
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedRoles={["user", "storeowner"]}>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </RoleContext.Provider>
  );
}

export default App;