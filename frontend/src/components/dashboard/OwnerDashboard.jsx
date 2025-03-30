import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios/axios";
import { showErrorToast } from "../../utils/toasts/errorToast";

const OwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axiosInstance.get("/owner/ratings");
        setRatings(response.data.ratings);
        setAverageRating(response.data.averageRating);
      } catch (error) {
        showErrorToast("Failed to fetch ratings.");
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold">Average Rating</h2>
        <p className="text-3xl">{averageRating}</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {ratings.map((rating) => (
          <div key={rating.id} className="bg-white p-4 rounded-lg shadow-md">
            <p>User: {rating.userName}</p>
            <p>Rating: {rating.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;