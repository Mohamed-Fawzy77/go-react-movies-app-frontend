import React, { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import Table from "./Table";

const StatusMapper = {
  1: "Pending",
  5: "Delivered",
  6: "Cancelled",
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log({ orders });

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/orders", { method: "GET" }); // Replace with your API endpoint
        const data = await response.json();
        console.log({ data });

        setOrders(data.orders);
      } catch (error) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
        Cell: ({ value }) =>
          console.log({ value }) || (
            <ul>
              {value.map((product, index) => (
                <li key={index}>
                  {product.productPricing.product.name}:{product.productPricing.units * product.quantity} x{" "}
                  {product.productPricing.totalKilos * product.quantity} x {product.productPricing.pricePerKiloOrUnit} ={" "}
                  {product.productPricing.totalPrice}{" "}
                </li>
              ))}
            </ul>
          ),
      },
    ],
    []
  );

  // Create the table instance

  return <Table columns={columns} data={orders} />;
};

export default OrdersTable;
