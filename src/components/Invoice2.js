// Invoice.js

import React from "react";

// 210 x 297 mm
const Invoice = ({ order }) => {
  return (
    <div
      className="invoice"
      style={{
        height: "13.5cm",
        border: "1px solid black",
        borderRadius: "5px",
        width: "calc(100% / 2 - 10mm )",
        padding: "10px",
        boxSizing: "border-box",
        margin: "5mm",
      }}
    >
      {/* Example fields based on the provided data */}
      {/* <h2>Invoice</h2> */}
      <p>Customer: {order.buyer.name}</p>
      <p>Date: {order.deliveryDate}</p>
      {/* Add other fields and style them as per your design */}
      <ul>
        {order.orderProducts.map((orderProduct, index) => (
          <li key={index}>
            {orderProduct.productPricing.product.name} - ${orderProduct.price} x {orderProduct.quantity}
          </li>
        ))}
      </ul>
      <p>Total: ${order.total}</p>
    </div>
  );
};

export default Invoice;
