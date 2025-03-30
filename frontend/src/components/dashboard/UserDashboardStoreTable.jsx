import React from "react";

const UserDashboardStoreTable = ({ stores, userRatings, handleRatingSubmit }) => {
  console.log(stores,'stores')
  if (!handleRatingSubmit) {
    console.error("handleRatingSubmit function is not provided!");
    return null;
  }

  const handleSelectChange = (storeId, event) => {
    console.log(event.target.value, 'event.target.value')
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      handleRatingSubmit(storeId, value);
    }
  };

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
              <td className="border border-gray-300 px-4 py-2">{store.avg_rating}</td>
              <td className="border border-gray-300 px-4 py-2">
                {userRatings[store.id] || "Not Rated"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <select
                    value={userRatings[store.id] || ""}
                    onChange={(e) => handleSelectChange(store.id, e)}
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
