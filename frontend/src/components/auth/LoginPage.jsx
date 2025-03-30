import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast } from "../../utils/toasts/errorToast";
import { showSuccessToast } from "../../utils/toasts/sucessToast";
import axiosInstance from "../../utils/axios/axios";

const LoginPage = ({ setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, role, user } = response.data;
        localStorage.setItem("token", token); // Save token to localStorage
        localStorage.setItem("role", role); // Save role to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        setRole(role); // Update role in context
        showSuccessToast("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 2000); // Redirect after 2 seconds
      } else {
        showErrorToast(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response && error.response.data && error.response.data.message) {
        showErrorToast(error.response.data.message);
      } else {
        showErrorToast("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
