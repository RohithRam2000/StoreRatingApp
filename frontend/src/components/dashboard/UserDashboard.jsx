import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios/axios";
import { showErrorToast } from "../../utils/toasts/errorToast";
import { showSuccessToast } from "../../utils/toasts/sucessToast";
import UserDashboardStoreTable from "./UserDashboardStoreTable";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    fetchStores();
    fetchUserRatings();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get("/stores");
      setStores(response.data);
    } catch (error) {
      showErrorToast("Failed to fetch stores.");
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await axiosInstance.get("/user/ratings");
      const ratings = response.data.reduce((acc, rating) => {
        acc[rating.storeId] = rating.rating;
        return acc;
      }, {});
      setUserRatings(ratings);
    } catch (error) {
      showErrorToast("Failed to fetch user ratings.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      await axiosInstance.post(`/stores/${storeId}/rate`, { rating });
      showSuccessToast("Rating submitted successfully!");
      fetchUserRatings();
    } catch (error) {
      showErrorToast("Failed to submit rating.");
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery) ||
      store.address.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <input
        type="text"
        placeholder="Search by name or address"
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 mb-4 border rounded-lg"
      />
      <UserDashboardStoreTable
        stores={filteredStores}
        userRatings={userRatings}
        handleRatingSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default UserDashboard;
