import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserType = {
  ADMIN: "admin",
  DELIVERY: "delivery",
  BUYER: "buyer",
};

const AddUserForm = ({ UserAdded, toBeUpdatedUser }) => {
  const userInfo = toBeUpdatedUser || {};
  const [userData, setUserData] = useState({
    phone: userInfo.phone || "",
    name: userInfo.name || "",
    address: userInfo.address || "",
    notes: userInfo.notes || "",
    isVerified: userInfo.isVerified || false,
    type: userInfo.type || UserType.BUYER,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (toBeUpdatedUser) {
        const updatedUser = await axios.put(`http://localhost:5000/users/${toBeUpdatedUser._id}`, userData);
        alert("User updated successfully!");
        if (UserAdded) {
          UserAdded(updatedUser.data);
        }
        return;
      }

      const addedUser = await axios.post("http://localhost:5000/users", userData);
      setUserData({
        phone: "",
        name: "",
        address: "",
        notes: "",
        isVerified: false,
        type: UserType.BUYER,
      });
      if (UserAdded) {
        UserAdded(addedUser.data);
      }

      toast.success("اشطة تمت الإضافة بنجاح");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Phone:</label>
          <input
            className="mb-3"
            type="text"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Name:</label>
          <input
            className="mb-3"
            style={{ width: "500px" }}
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Address:</label>
          <textarea
            // className="mb-3"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
            required
            style={{ height: "100px", width: "500px" }}
          />
        </div>

        <div>
          <label>Notes:</label>
          <textarea
            name="notes"
            value={userData.notes}
            onChange={handleInputChange}
            style={{ height: "100px", width: "500px" }}
          />
        </div>

        <div>
          <label>Is Verified:</label>
          <input
            type="checkbox"
            name="isVerified"
            checked={userData.isVerified}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>User Type:</label>
          <select name="type" value={userData.type} onChange={handleInputChange}>
            <option value={UserType.ADMIN}>Admin</option>
            <option value={UserType.DELIVERY}>Delivery</option>
            <option value={UserType.BUYER}>Buyer</option>
          </select>
        </div>

        <button type="submit">{toBeUpdatedUser ? "Update User" : "Add User"}</button>
      </form>
    </>
  );
};

export default AddUserForm;
