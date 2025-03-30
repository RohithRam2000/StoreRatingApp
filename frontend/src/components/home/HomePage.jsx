import React from "react";

const HomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome to Store Rating App
        </h1>
        <p className="text-center text-gray-600">
          Discover and rate your favorite stores. Sign up or log in to get started!
        </p>
      </div>
    </div>
  );
};

export default HomePage;