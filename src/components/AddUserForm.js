import React, { useState } from "react";
import axios from "axios";

const UserType = {
  ADMIN: "admin",
  DELIVERY: "delivery",
  BUYER: "buyer",
};

const AddUserForm = () => {
  const [userData, setUserData] = useState({
    phone: "",
    password: "",
    name: "",
    address: "",
    notes: "",
    isVerified: false,
    type: UserType.BUYER,
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
      await axios.post("http://localhost:5000/users", userData);
      setUserData({
        phone: "",
        name: "",
        address: "",
        notes: "",
        isVerified: false,
        type: UserType.BUYER,
      });
      alert("User added successfully!");
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
          <input type="text" name="phone" value={userData.phone} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Name:</label>
          <input type="text" name="name" value={userData.name} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Address:</label>
          <input type="text" name="address" value={userData.address} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Notes:</label>
          <textarea name="notes" value={userData.notes} onChange={handleInputChange} />
        </div>

        <div>
          <label>Is Verified:</label>
          <input type="checkbox" name="isVerified" checked={userData.isVerified} onChange={handleInputChange} />
        </div>

        <div>
          <label>User Type:</label>
          <select name="type" value={userData.type} onChange={handleInputChange}>
            <option value={UserType.ADMIN}>Admin</option>
            <option value={UserType.DELIVERY}>Delivery</option>
            <option value={UserType.BUYER}>Buyer</option>
          </select>
        </div>

        <button type="submit">Add User</button>
      </form>
    </>
  );
};

export default AddUserForm;
