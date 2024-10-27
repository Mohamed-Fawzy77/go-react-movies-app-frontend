import axios from "axios";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const ProductPricingButtons = () => {
  const { users, data, deliveryAgents, removeAlert, setDangerAlert, jwt } = useOutletContext();
  const [orderProducts, setOrderProducts] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(20); // Default to 20
  const [discount, setDiscount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [deliveryDateOption, setDeliveryDateOption] = useState("today");
  const [customDeliveryDate, setCustomDeliveryDate] = useState("");
  const [selectedDeliveryAgent, setSelectedDeliveryAgent] = useState(null);

  const PPMap = {};

  for (const SP of data) {
    for (const product of SP.products) {
      for (const PP of product.productPricings) {
        PP.productName = product.name;
        PPMap[PP._id] = PP;
      }
    }
  }

  const addToOrder = (productPricing, productName) => {
    setOrderProducts((prevOrder) => {
      const existingIndex = prevOrder.findIndex((orderProduct) => orderProduct._id === productPricing._id);

      if (existingIndex !== -1) {
        const firstPart = prevOrder.slice(0, existingIndex);
        const secondPart = prevOrder.slice(existingIndex + 1);

        const updatedOrder = [
          ...firstPart,
          {
            ...prevOrder[existingIndex],
            quantity: prevOrder[existingIndex].quantity + 1,
          },
          ...secondPart,
        ];

        return updatedOrder;
      } else {
        // Add new product pricing entry with initial values
        return [
          ...prevOrder,
          {
            quantity: 1,
            _id: productPricing._id,
            productPricing: productPricing._id,
          },
        ];
      }
    });
  };

  const calculateTotalCost = () => {
    let totalCost = 0;

    for (const orderProduct of orderProducts) {
      const productPricing = PPMap[orderProduct._id];
      totalCost += productPricing.totalPrice * orderProduct.quantity;
    }

    return totalCost + parseInt(deliveryFee) - parseInt(discount);
  };

  const filteredUsers = users.filter((user) =>
    `${user.phone} ${user.name} ${user.address}`.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleCreateOrder = async () => {
    try {
      //make a var called deliveryDate it should be something like 2024-10-01 if it's today or 2024-10-02 if it's tomorrow or 2024-10-03 if it's a custom date

      const deliveryDate =
        deliveryDateOption === "today"
          ? new Date(Date.now())
          : deliveryDateOption === "tomorrow"
          ? new Date(Date.now() + 24 * 60 * 60 * 1000)
          : new Date(customDeliveryDate);

      await axios.post(
        "http://localhost:5000/orders",
        {
          orderProducts: orderProducts,
          deliveryFee: parseInt(deliveryFee),
          discount: parseInt(discount),
          buyer: selectedUser,
          deliveryAgent: selectedDeliveryAgent,
          deliveryDate:
            deliveryDateOption === "tomorrow"
              ? new Date(Date.now() + 24 * 60 * 60 * 1000)
              : new Date(customDeliveryDate),
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      setOrderProducts([]);
      setDeliveryFee(20);
      setDiscount(0);
      setSelectedUser(null);
      setSelectedDeliveryAgent(null);
      setDeliveryDateOption("today");
      setCustomDeliveryDate("");
      removeAlert();
      removeAlert("Order created successfully");
    } catch (error) {
      console.log({ error });
      setDangerAlert("Error creating order " + error.message);
      console.error("Error creating order:", error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {/* User Selection */}
        {/* <div style={{ flex: 1 }}>User input and select</div> */}

        {/* Delivery Agent Selection */}
        <div style={{ flex: 1 }}>
          <h4>Select Delivery Agent:</h4>
          <select
            value={selectedDeliveryAgent}
            onChange={(e) => setSelectedDeliveryAgent(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="None">Select a delivery agent</option>
            {deliveryAgents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
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

      {/* User Selection, Delivery Fee, and Discount Row */}
      <div style={{ display: "flex", marginRight: "100px" }}>
        {/* User Selection */}
        <div style={{ flex: 1, marginRight: "10px" }}>
          <h4>Select User:</h4>
          <input
            type="text"
            placeholder="Search user by phone, name, or address"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="" disabled>
              Select a user
            </option>
            {filteredUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.phone} - {user.name} - {user.address}
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Fee */}
        <div style={{ flex: 1, marginRight: "10px" }}>
          <h4>Select Delivery Fee:</h4>
          <label>
            <input
              type="radio"
              name="deliveryFee"
              value={0}
              onChange={(e) => setDeliveryFee(e.target.value)}
            />{" "}
            0
          </label>
          <label>
            <input
              type="radio"
              name="deliveryFee"
              value={20}
              defaultChecked
              onChange={(e) => setDeliveryFee(e.target.value)}
            />{" "}
            20
          </label>
          <label>
            <input
              type="radio"
              name="deliveryFee"
              value={25}
              onChange={(e) => setDeliveryFee(e.target.value)}
            />{" "}
            25
          </label>
          <label>
            Custom:
            <input
              type="number"
              min="0"
              onChange={(e) => setDeliveryFee(e.target.value)}
              style={{ marginLeft: "5px", width: "60px" }}
            />
          </label>
        </div>

        {/* Discount */}
        <div style={{ flex: 1 }}>
          <h4>Discount:</h4>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            style={{ width: "80px" }}
          />
        </div>
      </div>

      <hr />

      {/* Product Buttons */}
      <div style={{ display: "flex", marginRight: "300px" }}>
        <div style={{ flex: 3 }}>
          {data.map((item) => (
            <div key={item._id}>
              <h3>{item.name}</h3>
              {item.products.map((product) => (
                <div key={product._id}>
                  <h4>{product.name}</h4>
                  {product.productPricings.map((PP) => (
                    <button key={PP._id} onClick={() => addToOrder(PP, product.name)}>
                      {PP.units} x {PP.totalKilos || "-"} x {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice}
                    </button>
                  ))}
                </div>
              ))}
              <hr />
            </div>
          ))}
        </div>

        {/* Fixed Order Summary */}
        <div
          style={{
            position: "fixed",
            right: "20px",
            top: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "300px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Order Products:</h3>
          <ul>
            {orderProducts.map((orderProduct, index) => {
              const { _id, quantity } = orderProduct;
              const PP = PPMap[_id];
              return (
                <li key={index}>
                  {PP.productName}: {PP.units * quantity} x {PP.totalKilos * quantity || "-"} x{" "}
                  {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice * quantity}
                </li>
              );
            })}

            {deliveryFee > 0 && <li>Delivery: {deliveryFee}</li>}
            {discount > 0 && <li>Discount: {discount}</li>}
          </ul>
          <hr />
          <h4>Total Cost : {calculateTotalCost()}</h4>
        </div>
      </div>
      <button style={{ width: "100%", marginBottom: "50px", height: "50px" }} onClick={handleCreateOrder}>
        Create Order
      </button>
    </div>
  );
};

export default ProductPricingButtons;
