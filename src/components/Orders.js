import React, { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import Table from "./Table";
import axios from "axios";
import InvoicePrinter from "./InvoicePrinter";

const StatusMapper = {
  1: "Pending",
  5: "Delivered",
  6: "Cancelled",
};

const OrdersTable = ({ deliveryAgents }) => {
  console.log({ deliveryAgents });

  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10).toString());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/orders?deliveryDate=${date}`);

        setOrders(res.data.orders);
      } catch (error) {
        console.error("error fetching orders", error);
      }
    };

    fetchOrders();
  }, [date]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Buyer Name",
        accessor: (item) => item.buyer.name, // accessor is the "key" in the data
      },
      {
        Header: "Buyer Phone",
        accessor: (item) => item.buyer.phone,
      },
      {
        Header: "Address",
        accessor: (item) => item.address,
      },
      {
        Header: "Total Cost",
        accessor: (item) => item.orderTotalPriceAfterDiscount,
      },
      {
        Header: "Delivery Fee",
        accessor: (item) => item.deliveryFee,
      },
      {
        Header: "Delivery Agent",
        accessor: (item) => item.deliveryAgent?.name || "Not Assigned",
      },
      {
        Header: "Status",
        accessor: (item) => StatusMapper[item.status],
      },
      {
        Header: "products",
        accessor: (item) => item.orderProducts,
        minWidth: "400px",
        Cell: ({ value }) => (
          <ul>
            {value.map((product, index) => (
              <li key={index}>
                {product.productPricing.product.name}:{product.productPricing.units * product.quantity} x{" "}
                {product.productPricing.totalKilos * product.quantity} x{" "}
                {product.productPricing.pricePerKiloOrUnit} = {product.productPricing.totalPrice}{" "}
              </li>
            ))}
          </ul>
        ),
      },
    ],
    []
  );

  return (
    <>
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />
      <InvoicePrinter orders={orders} />
      <Table columns={columns} data={orders} />
    </>
  );
};

export default OrdersTable;
