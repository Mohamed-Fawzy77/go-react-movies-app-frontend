import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const ProductPricingButtons = () => {
  const { users, data, deliveryAgents } = useOutletContext(); // Get delivery agents from context
  const [orderProducts, setOrderProducts] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(20);
  const [discount, setDiscount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [selectedDeliveryAgent, setSelectedDeliveryAgent] = useState(null);
  const [deliveryDateOption, setDeliveryDateOption] = useState("today");
  const [customDeliveryDate, setCustomDeliveryDate] = useState("");

  const PPMap = {};
  for (const SP of data) {
    for (const product of SP.products) {
      for (const PP of product.productPricings) {
        PP.productName = product.name;
        PPMap[PP._id] = PP;
      }
    }
  }

  const addToOrder = (productPricing) => {
    /* ... */
  };
  const calculateTotalCost = () => {
    /* ... */
  };

  const filteredUsers = users.filter((user) =>
    `${user.phone} ${user.name} ${user.address}`.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredDeliveryAgents = deliveryAgents.filter((agent) =>
    `${agent.phone} ${agent.name}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div>
      {/* User, Delivery Fee, Discount, Delivery Agent, and Delivery Date Row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {/* User Selection */}
        <div style={{ flex: 1 }}>{/* User input and select */}</div>

        {/* Delivery Agent Selection */}
        <div style={{ flex: 1 }}>
          <h4>Select Delivery Agent:</h4>
          <select
            value={selectedDeliveryAgent}
            onChange={(e) => setSelectedDeliveryAgent(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="" disabled>
              Select a delivery agent
            </option>
            {filteredDeliveryAgents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.phone} - {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Date Selection */}
        <div style={{ flex: 1 }}>
          <h4>Order Delivery Date:</h4>
          <label>
            <input
              type="radio"
              name="deliveryDate"
              value="today"
              checked={deliveryDateOption === "today"}
              onChange={(e) => setDeliveryDateOption(e.target.value)}
            />
            Today
          </label>
          <label>
            <input
              type="radio"
              name="deliveryDate"
              value="tomorrow"
              checked={deliveryDateOption === "tomorrow"}
              onChange={(e) => setDeliveryDateOption(e.target.value)}
            />
            Tomorrow
          </label>
          <label>
            <input
              type="radio"
              name="deliveryDate"
              value="custom"
              checked={deliveryDateOption === "custom"}
              onChange={(e) => setDeliveryDateOption(e.target.value)}
            />
            Custom
          </label>
          {deliveryDateOption === "custom" && (
            <input
              type="date"
              value={customDeliveryDate}
              onChange={(e) => setCustomDeliveryDate(e.target.value)}
              style={{ display: "block", marginTop: "8px" }}
            />
          )}
        </div>
      </div>

      <hr />

      {/* Product Buttons and Order Summary */}
      <div style={{ display: "flex" }}>
        {/* Product buttons */}
        <div style={{ flex: 3 }}>{/* Product buttons here */}</div>

        {/* Order Summary */}
        <div style={{ position: "fixed", right: "20px", top: "20px", width: "300px" }}>
          {/* Order summary details */}
        </div>
      </div>
    </div>
  );
};

export default ProductPricingButtons;
