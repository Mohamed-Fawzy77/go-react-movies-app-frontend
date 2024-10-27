import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const ProductPricingButtons = () => {
  const { users, data } = useOutletContext();
  const [orderProducts, setOrderProducts] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(20); // Default to 20
  const [discount, setDiscount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearch, setUserSearch] = useState("");

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
          },
        ];
      }
    });
  };

  const debug = () => {
    console.log({ orderProducts });
  };

  // Calculate the total cost including delivery fee and discount
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

  return (
    <div style={{ display: "flex" }}>
      <button onClick={debug}>debug</button>
      <div style={{ marginBottom: "20px", width: "100%" }}>
        <h4>Select User:</h4>
        <input
          type="text"
          placeholder="Search user by phone, name, or address"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <div style={{ maxHeight: "150px", overflowY: "auto", width: "100%" }}>
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setUserSearch("");
              }}
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                cursor: "pointer",
                backgroundColor: selectedUser && selectedUser._id === user._id ? "#e0e0e0" : "#fff",
              }}
            >
              {user.phone} - {user.name} - {user.address}
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Fee and Discount */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Select Delivery Fee:</h4>
        <label>
          <input type="radio" name="deliveryFee" value={0} onChange={(e) => setDeliveryFee(e.target.value)} />{" "}
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

        <h4>Discount:</h4>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          style={{ width: "80px" }}
        />
      </div>

      {/* Product Buttons */}
      <div>
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
  );
};

export default ProductPricingButtons;
