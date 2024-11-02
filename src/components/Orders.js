import React, { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import Table from "./Table";
import axios from "axios";
import InvoicePrinter from "./InvoicePrinter";
import Modal from "react-modal";

const StatusMapper = {
  1: "Pending",
  5: "Delivered",
  6: "Cancelled",
};

const OrdersPage = ({ deliveryAgents }) => {
  const [orders, setOrders] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
        accessor: (order) => order.buyer.name, // accessor is the "key" in the data
      },
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
      // {
      //   Header: "Delivery Fee",
      //   accessor: (order) => order.deliveryFee,
      // },
      {
        Header: "Delivery Agent",
        accessor: (order) => order.deliveryAgent?.name || "Not Assigned",
      },
      {
        Header: "notes",
        accessor: (order) => order.notes,
      },
      // {
      //   Header: "Status",
      //   accessor: (order) => StatusMapper[order.status],
      // },
      {
        Header: "products",
        accessor: (order) => order.orderProducts,
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
      {
        Header: "Actions",
        accessor: (order) => order,
        Cell: ({ value }) => {
          return (
            <>
              <button
                onClick={() => {
                  window.open("/order/" + value._id, "_blank");
                }}
              >
                تعديل
              </button>
            </>
          );
        },
      },
    ],
    []
  );

  const totalCost = orders.reduce((acc, order) => acc + order.orderTotalPriceAfterDiscount, 0);

  return (
    <>
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />
      <h3>Total: {totalCost}</h3>
      <InvoicePrinter orders={orders} />
      <Table columns={columns} data={orders} />
    </>
  );
};

export default OrdersPage;
