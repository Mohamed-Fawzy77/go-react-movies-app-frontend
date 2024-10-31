import React, { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import Table from "./Table";
import AddUserForm from "./AddUserForm.js";

const StatusMapper = {
  1: "Pending",
  5: "Delivered",
  6: "Cancelled",
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/users", { method: "GET" }); // Replace with your API endpoint
        const data = await response.json();

        setUsers(data);
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
        Header: "Name",
        accessor: "name", // accessor is the "key" in the data
      },
      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Notes",
        accessor: "notes",
      },
      {
        Header: "is verified",
        accessor: (item) => (item.isVerified ? "Yes" : "No"),
      },
      {
        Header: "Type",
        accessor: "type",
      },
    ],
    []
  );

  // Create the table instance

  return (
    <>
      <Table columns={columns} data={users} />
      <AddUserForm />
    </>
  );
};

export default UsersPage;
