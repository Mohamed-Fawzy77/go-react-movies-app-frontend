import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../components/Table"; // Assuming you have a Table component
// import Modal from "../components/Modal"; // Assuming you have a Modal component
import { fetchPurchases } from "../http/product";
import Modal from "react-modal";
import { modalStyles } from "../components/Modal";
const PurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [mainFeesPaid, setMainFeesPaid] = useState(0);
  const [extraFeesPaid, setExtraFeesPaid] = useState(0);
  const [payAllMainFees, setPayAllMainFees] = useState(false);
  const [payAllExtraFees, setPayAllExtraFees] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPurchases(setPurchases, selectedDate);
  }, [selectedDate]);

  //   const fetchPurchases = async (date) => {
  //     try {
  //       const response = await axios.get(`/api/purchases?date=${date}`);
  //       setPurchases(response.data);
  //     } catch (error) {
  //       console.error("Error fetching purchases:", error);
  //     }
  //   };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleOpenModal = (purchase) => {
    setSelectedPurchase(purchase);
    setMainFeesPaid(0);
    setExtraFeesPaid(0);
    setPayAllMainFees(false);
    setPayAllExtraFees(false);
    setIsModalOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedPurchase) return;

    const paymentData = {
      purchaseId: selectedPurchase._id,
      mainFeesPaid: payAllMainFees ? selectedPurchase.mainFees - selectedPurchase.totalPaid : mainFeesPaid,
      extraFeesPaid: payAllExtraFees
        ? selectedPurchase.extraFees - selectedPurchase.totalPaid
        : extraFeesPaid,
      date: new Date().toISOString(),
    };

    try {
      await axios.post("/api/payments", paymentData);
      setIsModalOpen(false);
      fetchPurchases(selectedDate);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const columns = [
    { Header: "Units", accessor: "units" },
    { Header: "Total Kilos", accessor: "totalKilos" },
    { Header: "Main Fees", accessor: "mainFees" },
    { Header: "Extra Fees", accessor: "extraFees" },
    { Header: "Total", accessor: "total" },
    { Header: "Total Paid", accessor: "totalPaid" },
    { Header: "Date", accessor: "date" },
    { Header: "Vendor", accessor: "vendor.name" },
    { Header: "Standard Product", accessor: "standardProduct.name" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => <button onClick={() => handleOpenModal(row.original)}>Pay</button>,
    },
  ];

  //   const columns = React.useMemo(
  //     () => [
  //       {
  //         Header: "Buyer Phone",
  //         accessor: (order) => order.buyer.phone,
  //       },
  //       {
  //         Header: "Address",
  //         accessor: (order) => order.address,
  //       },
  //       {
  //         Header: "Total Cost",
  //         accessor: (order) => order.orderTotalPriceAfterDiscount,
  //       },
  //       {
  //         Header: "quick assign",
  //         accessor: (order) => "a",
  //         Cell: getQuickAssignCell,
  //       },
  //       {
  //         Header: "Del",
  //         accessor: (order) => order.deliveryFee,
  //       },
  //       {
  //         Header: "Delivery Agent",
  //         accessor: (order) => order.deliveryAgent?.name || "Not Assigned",
  //       },
  //       {
  //         Header: "notes",
  //         accessor: (order) => order.notes,
  //       },
  //       {
  //         Header: "products",
  //         accessor: (order) => {
  //           return order.orderProducts
  //             .map(
  //               (product, index) =>
  //                 `${
  //                   product.productPricing.product.name
  //                 }:{product.productPricing.units * product.quantity} *{" "}
  //                 ${product.productPricing.totalKilos * product.quantity || "-"} *{" "}
  //                 ${product.productPricing.pricePerKiloOrUnit || "-"} ={" "}
  //                 ${product.productPricing.totalPrice * product.quantity}{" "}`
  //             )
  //             .join("");
  //         },
  //         minWidth: "400px",
  //         Cell: (input) => {
  //           const order = input.row.original;
  //           return (
  //             <ul style={{ direction: "rtl", width: "300px" }}>
  //               {order.orderProducts.map((product, index) => (
  //                 <li key={index}>
  //                   {product.productPricing.product.name}:{product.productPricing.units * product.quantity} *{" "}
  //                   {product.productPricing.totalKilos * product.quantity || "-"} *{" "}
  //                   {product.productPricing.pricePerKiloOrUnit || "-"} ={" "}
  //                   {product.productPricing.totalPrice * product.quantity}{" "}
  //                 </li>
  //               ))}
  //             </ul>
  //           );
  //         },
  //       },
  //       {
  //         Header: "Actions",
  //         accessor: (order) => order,
  //         Cell: getActionsCell,
  //       },
  //       {
  //         Header: "info",
  //         accessor: (order) => getInfoString(order),
  //         Cell: (v) => {
  //           let order = v.row.original;
  //           const string = getInfoString(order);
  //           return <div style={{ whiteSpace: "pre-line" }}>{string}</div>;
  //         },
  //       },
  //     ],
  //     [deliveryAgents]
  //   );

  return (
    <div>
      <h1>Purchases</h1>
      <label>
        Select Date:
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </label>
      <Table data={purchases} columns={columns} />
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} style={modalStyles}>
          <h2>Payment for Purchase</h2>
          <p>Main Fees Left: {selectedPurchase.mainFees - selectedPurchase.totalPaid}</p>
          <p>Extra Fees Left: {selectedPurchase.extraFees - selectedPurchase.totalPaid}</p>
          <label>
            Main Fees Payment:
            <input
              type="number"
              value={mainFeesPaid}
              onChange={(e) => setMainFeesPaid(Number(e.target.value))}
              disabled={payAllMainFees}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={payAllMainFees}
              onChange={(e) => setPayAllMainFees(e.target.checked)}
            />
            Pay All Unpaid Main Fees
          </label>
          <label>
            Extra Fees Payment:
            <input
              type="number"
              value={extraFeesPaid}
              onChange={(e) => setExtraFeesPaid(Number(e.target.value))}
              disabled={payAllExtraFees}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={payAllExtraFees}
              onChange={(e) => setPayAllExtraFees(e.target.checked)}
            />
            Pay All Unpaid Extra Fees
          </label>
          <button onClick={handlePayment}>Submit Payment</button>
        </Modal>
      )}
    </div>
  );
};

export default PurchasesPage;
