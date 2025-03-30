import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import UserDashboard from "./components/dashboard/UserDashboard";
import OwnerDashboard from "./components/dashboard/OwnerDashboard";
import HomePage from "./components/home/HomePage";
import Navbar from "./components/shared/Navbar";
import ChangePassword from "./components/auth/ChangePassword"; // Updated import for ChangePassword

function App() {
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !allowedRoles.includes(role)) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const getDashboard = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") return <AdminDashboard />;
    if (role === "user") return <UserDashboard />;
    if (role === "storeowner") return <OwnerDashboard />;
    return <Navigate to="/login" />;
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
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
  );
}

export default App;