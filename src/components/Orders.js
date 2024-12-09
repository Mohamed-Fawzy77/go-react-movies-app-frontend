import React, { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import Table from "./Table";
import axios from "axios";
import InvoicePrinter from "./InvoicePrinter";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { getFirstTwoLetters } from "../utils/string";

const StatusMapper = {
  1: "Pending",
  5: "Delivered",
  6: "Cancelled",
};

function formateDate(dateTime) {
  return new Date(dateTime)
    .toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
}
function getInfoString(order) {
  const creator = order.creatorAdmin?.name ? getFirstTwoLetters(order.creatorAdmin?.name) : "-";
  const string = `by: ${creator}
  created: ${formateDate(order.createdAt)} ${
    order.createdAt.toString() !== order.updatedAt.toString()
      ? `\nupdated: ${formateDate(order.updatedAt)}`
      : ""
  }  ${order.isPaidOnline ? "\npaid online" : ""}${
    order.discount > 0 ? `\ndiscount: ${order.discount}` : ""
  } `;
  return string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryAgents, setDeliveryAgents] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10).toString());
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [selectedDeliveryAgentIdForFilter, setSelectedDeliveryAgentIdForFilter] = useState(null);
  const [toBeAssignedDeliveryId, setToBeAssignedDeliveryId] = useState("None");
  const [toBeAssignedDeliveryOrderId, setToBeAssignedDeliveryOrderId] = useState("None");
  const [filteredRows, setFilteredRows] = useState([]);

  useEffect(() => {
    const getDeliveryAgents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users/delivery-agents");
        setDeliveryAgents(res.data);
        console.log({ del: res.data });
      } catch (error) {
        toast.error("error fetching delivery agents");
        console.error("error fetching delivery agents", error);
      }
    };

    getDeliveryAgents();
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url =
          selectedDeliveryAgentIdForFilter !== "None" && selectedDeliveryAgentIdForFilter
            ? `http://localhost:5000/orders?deliveryAgent=${selectedDeliveryAgentIdForFilter}&deliveryDate=${date}`
            : `http://localhost:5000/orders?deliveryDate=${date}`;

        const res = await axios.get(url);

        setOrders(res.data.orders);
      } catch (error) {
        console.error("error fetching orders", error);
      }
    };

    fetchOrders();
  }, [date, selectedDeliveryAgentIdForFilter]);

  const totalCost = orders.reduce((acc, order) => acc + order.orderTotalPriceAfterDiscount, 0);
  const deliveryAgent = deliveryAgents.find((agent) => agent._id === selectedDeliveryAgentIdForFilter);

  const getActionsCell = (v) => {
    const { value } = v;
    return (
      <>
        <button
          onClick={() => {
            window.open("/order/" + value._id, "_blank");
          }}
        >
          تعديل
        </button>

        <button
          onClick={() => {
            setIsDeleteModalOpen(true);
            setOrderToDelete(value);
          }}
        >
          مسح
        </button>

        <button
          onClick={() => {
            window.open(`/order/print/${value._id}`, "_blank");
          }}
        >
          طباعة
        </button>

        <button
          onClick={() => {
            setIsDeliveryModalOpen(true);
            setToBeAssignedDeliveryOrderId(value._id);
          }}
        >
          تعيين توصيل
        </button>
      </>
    );
  };

  const getQuickAssignCell = (v) => {
    const order = v.row.original;
    const quickAssignAgents = deliveryAgents.filter((agent) => agent.quickAssign);

    console.log({ quickAssignAgents });

    return (
      <>
        {quickAssignAgents.map((agent, index) => (
          <button
            key={index}
            onClick={() => {
              axios
                .put(`http://localhost:5000/orders/${order._id}/assign-delivery-agent/${agent._id}`)
                .then((res) => {
                  setIsDeliveryModalOpen(false);
                  toast.success("تمت عملية التعيين بنجاح");

                  //modify the order and update the delivery agent
                  setOrders((prevOrders) => {
                    const updatedOrders = [...prevOrders];
                    const orderIndex = updatedOrders.findIndex((o) => o._id === order._id);
                    if (orderIndex !== -1) {
                      updatedOrders[orderIndex].deliveryAgent = agent;
                    }
                    return updatedOrders;
                  });
                })
                .catch((err) => {
                  toast.error("حدث خطأ ما أثناء عملية التعيين");
                  console.log(err);
                });
            }}
          >
            {agent.name}
          </button>
        ))}
      </>
    );
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
        Header: "quick assign",
        accessor: (order) => "a",
        Cell: getQuickAssignCell,
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
        Header: "Actions",
        accessor: (order) => order,
        Cell: getActionsCell,
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
    [deliveryAgents]
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

      <select
        value={selectedDeliveryAgentIdForFilter}
        onChange={(e) => setSelectedDeliveryAgentIdForFilter(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      >
        <option value={"None"}>Select a delivery agent</option>
        {deliveryAgents.map((agent, index) => (
          <option key={index} value={agent._id}>
            {agent.name}
          </option>
        ))}
      </select>

      <h3>Today Total: {totalCost}</h3>
      <h4>filteredRows Total: {filteredRows.length}</h4>
      <InvoicePrinter
        orders={orders}
        agentTotalMoney={totalCost}
        ordersCount={orders.length}
        deliveryAgentName={deliveryAgent ? deliveryAgent.name : ""}
      />
      <Table columns={columns} data={orders} setFilteredRows={setFilteredRows} />
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Delete Order Confirmation"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <h2>هل متأكد من مسح الطلب</h2>

        <div className="text-center mt-3 mb-3">
          <button
            style={{ width: "100px" }}
            onClick={() => {
              axios
                .delete("http://localhost:5000/orders/" + orderToDelete._id)
                .then((res) => {
                  setIsDeleteModalOpen(false);

                  setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderToDelete._id));

                  toast.success("تمت عملية الحذف بنجاح");
                })
                .catch((err) => {
                  toast.error("حدث خطأ ما");
                  console.error(err);
                });
            }}
          >
            تأكيد
          </button>
          <br />
          <br />
          <button style={{ width: "100px" }} onClick={() => setIsDeleteModalOpen(false)}>
            اغلاق
          </button>
        </div>
      </Modal>

      {/* delivery modal */}
      <Modal
        isOpen={isDeliveryModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="assign delivery"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <h2 className="mb-4">تعيين توصيل</h2>

        <select
          onChange={(e) => setToBeAssignedDeliveryId(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        >
          <option value={"None"}>Select a delivery agent</option>
          {deliveryAgents.map((agent, index) => (
            <option key={index} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>

        <button
          className="mt-3"
          style={{ width: "100px" }}
          onClick={() => {
            axios
              .put(
                `http://localhost:5000/orders/${toBeAssignedDeliveryOrderId}/assign-delivery-agent/${toBeAssignedDeliveryId}`
              )
              .then((res) => {
                setIsDeliveryModalOpen(false);
                toast.success("تمت عملية التعيين بنجاح");
              })
              .catch((err) => {
                toast.error("حدث خطأ ما");
                console.log(err);
              });
          }}
        >
          تأكيد
        </button>

        <button className="mt-3" style={{ width: "100px" }} onClick={() => setIsDeliveryModalOpen(false)}>
          اغلاق
        </button>
      </Modal>
    </>
  );
};

export default OrdersPage;
