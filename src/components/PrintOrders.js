// import React from "react";
// import Invoice from "./Invoice";

// const PrintOrders = () => {
//   const { orders } = useOutletContext();

//   const handlePrint = (order) => {
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice</title>
//           <style>
//             body { font-family: Arial, sans-serif; }
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #000; padding: 8px; }
//           </style>
//         </head>
//         <body>
//           ${document.getElementById(`invoice-${order._id}`).innerHTML}
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   return (
//     <div>
//       {orders.map((order) => (
//         <div key={order._id} id={`invoice-${order._id}`}>
//           <Invoice order={order} />
//           <button onClick={() => handlePrint(order)}>Print Invoice</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default PrintOrders;

import React, { useEffect, useState } from "react";
import InvoicePrinter from "./InvoicePrinter";
import { useOutletContext } from "react-router-dom";
const PrintOrders = () => {
  //   const { orders } = useOutletContext();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/orders", { method: "GET" }); // Replace with your API endpoint
        const data = await response.json();
        console.log({ data });

        setOrders(data.orders);
      } catch (error) {
        console.log("error");
      }
    };

    fetchOrders();
  }, []);

  console.log({ orders });
  return (
    <div>
      hi
      <InvoicePrinter orders={orders} />
    </div>
  );
};

export default PrintOrders;
