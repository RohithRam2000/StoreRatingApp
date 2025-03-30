import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios/axios";
import { showErrorToast } from "../../utils/toasts/errorToast";
import { showSuccessToast } from "../../utils/toasts/sucessToast";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axiosInstance.get("/admin/users");
        const storesResponse = await axiosInstance.get("/admin/stores");
        const ratingsResponse = await axiosInstance.get("/admin/ratings");

        setUsers(usersResponse.data);
        setStores(storesResponse.data);
        setRatings(ratingsResponse.data.totalRatings);
      } catch (error) {
        showErrorToast("Failed to fetch dashboard data.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl">{users.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Stores</h2>
          <p className="text-3xl">{stores.length}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Total Ratings</h2>
          <p className="text-3xl">{ratings}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;