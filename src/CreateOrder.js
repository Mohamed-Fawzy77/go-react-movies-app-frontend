import axios from "axios";
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const ProductPricingButtons = () => {
  const { users, data, deliveryAgents, removeAlert, setDangerAlert, jwt } = useOutletContext();
  const [orderProducts, setOrderProducts] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(20); // Default to 20
  const [discount, setDiscount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState({});
  const [userSearch, setUserSearch] = useState("");
  const [deliveryDateOption, setDeliveryDateOption] = useState("today");
  const [customDeliveryDate, setCustomDeliveryDate] = useState("");
  const [selectedDeliveryAgent, setSelectedDeliveryAgent] = useState(null);

  const user = users.find((user) => user._id === selectedUserId) || {};

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

  console.log({ deliveryDateOption, customDeliveryDate });
  const deliveryDate =
    deliveryDateOption === "today"
      ? new Date(Date.now()).toISOString().slice(0, 10)
      : deliveryDateOption === "tomorrow"
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      : new Date(customDeliveryDate || Date.now()).toISOString().slice(0, 10);

  console.log({ deliveryDate });

  const handleCreateOrder = async () => {
    try {
      // const deliveryDate =
      //   deliveryDateOption === "today"
      //     ? new Date(Date.now()).toISOString().slice(0, 10)
      //     : deliveryDateOption === "tomorrow"
      //     ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      //     : new Date(customDeliveryDate || Date.now()).toISOString().slice(0, 10);

      await axios.post(
        "http://localhost:5000/orders",
        {
          orderProducts: orderProducts,
          deliveryFee: parseInt(deliveryFee),
          discount: parseInt(discount),
          buyer: selectedUserId,
          deliveryAgent: selectedDeliveryAgent,
          deliveryDate,
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
      setSelectedUserId({});
      setSelectedDeliveryAgent(null);
      // setDeliveryDateOption("today");
      setCustomDeliveryDate("");
      removeAlert();
      removeAlert("Order created successfully");
    } catch (error) {
      console.error({ error });
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
            value={selectedUserId}
            onChange={(e) => {
              console.log({ value: e.target.value });
              setSelectedUserId(e.target.value);
            }}
            // onClick={(e) => {
            //   console.log({ value: e.target.value });
            //   setSelectedUser(e.target.value);
            // }}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select a user</option>
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
      <div style={{ display: "flex", marginRight: "200px", flexWrap: "wrap", border: "1px solid #ccc" }}>
        {/* <div style={{ flex: 3 }}> */}
        {data.map((item) => (
          <div key={item._id} style={{ minWidth: "250px", marginBottom: "50px" }}>
            <h3>{item.name}</h3>
            {item.products.map((product) => (
              <div key={product._id}>
                <h4>{product.name}</h4>
                {product.productPricings.map((PP) => (
                  <>
                    <button key={PP._id} onClick={() => addToOrder(PP, product.name)}>
                      {PP.units} x {PP.totalKilos || "-"} x {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice}
                    </button>
                    <br />
                  </>
                ))}
              </div>
            ))}
          </div>
        ))}
        {/* </div> */}

        {/* Fixed Order Summary */}
        <div
          style={{
            position: "fixed",
            right: "20px",
            top: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "350px",
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
          <button style={{ width: "100%", height: "50px" }} onClick={handleCreateOrder}>
            Create Order
          </button>
          order Date : {deliveryDateOption}({deliveryDate}) <br /> buyer name: {user.name || "-"} <br />
          buyer phone: {user.phone || "-"} <br />
          buyer id: {user._id || "-"} <br />
        </div>
      </div>
    </div>
  );
};

export default ProductPricingButtons;
