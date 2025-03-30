import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast } from "../../utils/toasts/errorToast";
import { showSuccessToast } from "../../utils/toasts/sucessToast";
import axiosInstance from "../../utils/axios/axios.js";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (name.length < 20 || name.length > 60) {
      showErrorToast("Name must be between 20 and 60 characters.");
      return;
    }
    if (!validateEmail(email)) {
      showErrorToast("Invalid email format.");
      return;
    }
    if (!validatePassword(password)) {
      showErrorToast(
        "Password must be 8-16 characters, include at least one uppercase letter and one special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }
    if (address.length > 400) {
      showErrorToast("Address cannot exceed 400 characters.");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        address,
      });

      if (response.status === 201) {
        showSuccessToast("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
      } else {
        showErrorToast(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
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
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Signup</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
