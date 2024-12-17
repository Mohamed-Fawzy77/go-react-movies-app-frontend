import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InvoicePrinter from "./InvoicePrinter";
const backendURL = process.env.REACT_APP_BACKEND_URL;
const SingleOrderPrinter = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${backendURL}/orders/print/${id}`);

        setOrder(res.data);
      } catch (error) {
        console.error("error fetching order", error);
      }
    };

    fetchOrders();
  }, []);

  return <InvoicePrinter orders={order ? [order] : []} />;
};

export default SingleOrderPrinter;
