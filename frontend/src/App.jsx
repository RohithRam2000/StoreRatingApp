import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar/Navbar.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='flex flex-col min-h-screen'>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
