import React from "react";

const UserDashboardStoreTable = ({ stores, userRatings, handleRatingSubmit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Store Name</th>
            <th className="border border-gray-300 px-4 py-2">Address</th>
            <th className="border border-gray-300 px-4 py-2">Overall Rating</th>
            <th className="border border-gray-300 px-4 py-2">Your Rating</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{store.name}</td>
              <td className="border border-gray-300 px-4 py-2">{store.address}</td>
              <td className="border border-gray-300 px-4 py-2">{store.rating}</td>
              <td className="border border-gray-300 px-4 py-2">
                {userRatings[store.id] ? userRatings[store.id] : "Not Rated"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <select
                    value={userRatings[store.id] || ""}
                    onChange={(e) =>
                      handleRatingSubmit(store.id, parseInt(e.target.value))
                    }
                    className="p-2 border rounded-lg"
                  >
                    <option value="" disabled>
                      Rate
                    </option>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                  {userRatings[store.id] && (
                    <button
                      onClick={() =>
                        handleRatingSubmit(store.id, userRatings[store.id])
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Update
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboardStoreTable;