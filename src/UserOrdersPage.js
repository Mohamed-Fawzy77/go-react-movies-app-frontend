import React, { useState } from "react";
import axios from "axios";
import { getOrdersByPhone } from "./http/product";
import Table from "./components/Table";
import { getInfoString } from "./components/Orders";

export default function OrderLookup() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!phone.trim()) return;
    await getOrdersByPhone(phone, setOrders);
    // setLoading(true);
    // setError(null);
    // try {
    //   const response = await axios.get(`https://your-api.com/orders/${phone}`);
    //   setOrders(response.data);
    // } catch (err) {
    //   setError("Failed to fetch orders. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Buyer Phone",
        accessor: (order) => order.buyer.phone,
      },
      {
        Header: "Address",
        accessor: (order) => order.address,
      },
      {
        Header: "Total Cost",
        accessor: (order) => order.orderTotalPriceAfterDiscount,
      },
      {
        Header: "Del",
        accessor: (order) => order.deliveryFee,
      },
      {
        Header: "Delivery Agent",
        accessor: (order) => order.deliveryAgent?.name || "Not Assigned",
      },
      {
        Header: "notes",
        accessor: (order) => order.notes,
      },
      {
        Header: "products",
        accessor: (order) => {
          return order.orderProducts
            .map(
              (product, index) =>
                `${
                  product.productPricing.product.name
                }:{product.productPricing.units * product.quantity} *{" "}
                ${product.productPricing.totalKilos * product.quantity || "-"} *{" "}
                ${product.productPricing.pricePerKiloOrUnit || "-"} ={" "}
                ${product.productPricing.totalPrice * product.quantity}{" "}`
            )
            .join("");
        },
        minWidth: "400px",
        Cell: (input) => {
          const order = input.row.original;
          return (
            <ul style={{ direction: "rtl", width: "300px" }}>
              {order.orderProducts.map((product, index) => (
                <li key={index}>
                  {product.productPricing.product.name}:{product.productPricing.units * product.quantity} *{" "}
                  {product.productPricing.totalKilos * product.quantity || "-"} *{" "}
                  {product.productPricing.pricePerKiloOrUnit || "-"} ={" "}
                  {product.productPricing.totalPrice * product.quantity}{" "}
                </li>
              ))}
            </ul>
          );
        },
      },
      {
        Header: "info",
        accessor: (order) => getInfoString(order),
        Cell: (v) => {
          let order = v.row.original;
          const string = getInfoString(order);
          return <div style={{ whiteSpace: "pre-line" }}>{string}</div>;
        },
      },
    ],
    []
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number"
        className="border p-2 w-full mb-2 rounded"
      />
      <button onClick={fetchOrders} className="bg-blue-500 text-white p-2 rounded w-full" disabled={loading}>
        {loading ? "Loading..." : "Fetch Orders"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {/* <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="border">
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.date}</td>
                <td className="border p-2">${order.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-2 text-center">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table> */}
      <Table
        columns={columns}
        data={orders}
        //   setFilteredRows={setFilteredRows}
      />
    </div>
  );
}
