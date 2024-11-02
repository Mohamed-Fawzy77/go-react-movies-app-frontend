import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

const UpdateOrder = () => {
  const { data } = useOutletContext();
  const [order, setOrder] = useState({});
  const { id } = useParams();

  console.log({ data });
  const PPMap = {};

  for (const SP of data) {
    for (const product of SP.products) {
      for (const PP of product.productPricings) {
        PP.productName = product.name;
        PPMap[PP._id] = PP;
      }
    }
  }

  const orderProducts = order.orderProducts || [];

  console.log({ orderProducts });

  const calculateTotalCost = () => {
    let totalCost = 0;

    for (const orderProduct of orderProducts) {
      const productPricing = PPMap[orderProduct._id];

      if (!productPricing) {
        continue;
      }

      totalCost += productPricing.totalPrice * orderProduct.quantity;
    }

    return totalCost + parseInt(order.deliveryFee) - parseInt(order.discount);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.log("error");
      }
    };

    fetchOrder();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: "20px",
        top: "20px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "350px",
        backgroundColor: "#f9f9f9",
        direction: "rtl",
      }}
    >
      <h3>Order Products:</h3>
      <ul>
        {orderProducts.map((orderProduct, index) => {
          const { _id, quantity, productPricing } = orderProduct;
          const PP = PPMap[productPricing._id];
          console.log({ PP, PPMap, _id, orderProduct, quantity });
          if (!PP) return;
          return (
            <li key={index}>
              {PP.productName}: {PP.units * quantity} * {PP.totalKilos * quantity || "-"} *{" "}
              {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice * quantity}
            </li>
          );
        })}

        {order.deliveryFee > 0 && <li>توصيل: {order.deliveryFee}</li>}
        {order.discount > 0 && <li>خصم: {order.discount}</li>}
      </ul>
      <hr />
      <h4>الاجمالى : {calculateTotalCost()}</h4>
      {/* <button style={{ width: "100%", height: "50px" }} onClick={handleCreateOrder}>
        اضافة الطلب
      </button> */}
    </div>
  );
};

export default UpdateOrder;
