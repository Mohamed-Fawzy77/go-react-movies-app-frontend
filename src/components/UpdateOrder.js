import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateOrder = () => {
  const [orderProducts, setOrderProducts] = useState([]);
  const { data: PPs } = useOutletContext();
  const [order, setOrder] = useState({});
  const { id } = useParams();
  const handleUpdateOrder = async () => {};

  const addToOrder = (productPricing) => {
    setOrderProducts((prevOrderProducts) => {
      const productPricingId = productPricing._id || productPricing;

      const existingIndex = prevOrderProducts.findIndex(
        (orderProduct) => orderProduct.productPricing === productPricingId
      );

      if (existingIndex !== -1) {
        const firstPart = prevOrderProducts.slice(0, existingIndex);
        const secondPart = prevOrderProducts.slice(existingIndex + 1);

        const updatedOrder = [
          ...firstPart,
          {
            ...prevOrderProducts[existingIndex],
            quantity: prevOrderProducts[existingIndex].quantity + 1,
          },
          ...secondPart,
        ];

        return updatedOrder;
      } else {
        // Add new product pricing entry with initial values
        return [
          ...prevOrderProducts,
          {
            quantity: 1,
            productPricing: productPricingId,
          },
        ];
      }
    });
  };

  const removeFromOrder = (productPricing) => {
    setOrderProducts((prevOrderProducts) => {
      const productPricingId = productPricing._id || productPricing;

      const existingIndex = prevOrderProducts.findIndex(
        (orderProduct) => orderProduct.productPricing === productPricingId
      );

      if (existingIndex !== -1) {
        const firstPart = prevOrderProducts.slice(0, existingIndex);
        const secondPart = prevOrderProducts.slice(existingIndex + 1);

        if (prevOrderProducts[existingIndex].quantity === 1) {
          const updatedOrder = [...firstPart, ...secondPart];
          return updatedOrder;
        } else {
          const updatedOrder = [
            ...firstPart,
            {
              ...prevOrderProducts[existingIndex],
              quantity: prevOrderProducts[existingIndex].quantity - 1,
            },
            ...secondPart,
          ];
          return updatedOrder;
        }
      } else {
        toast.error("Product not found in order");
      }
    });
  };

  const PPMap = {};

  for (const SP of PPs) {
    for (const product of SP.products) {
      for (const PP of product.productPricings) {
        PP.productName = product.name;
        PPMap[PP._id] = PP;
      }
    }
  }

  const calculateTotalCost = () => {
    let totalCost = 0;

    for (const orderProduct of orderProducts) {
      const productPricing = PPMap[orderProduct.productPricing];

      totalCost += productPricing.totalPrice * orderProduct.quantity;
    }

    return totalCost + parseInt(order.deliveryFee) - parseInt(order.discount);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/orders/${id}`);

        const order = res.data;
        const orderProducts = [];

        for (const orderProduct of order.orderProducts) {
          const PPId = orderProduct.productPricing._id || orderProduct.productPricing;
          orderProducts.push({
            _id: orderProduct._id,
            quantity: orderProduct.quantity,
            productPricing: PPId,
          });
        }

        setOrder(order);
        setOrderProducts(orderProducts);
      } catch (error) {
        console.error("error");
      }
    };

    fetchOrder();
  }, []);

  return (
    <>
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
            const { quantity, productPricing: productPricingId } = orderProduct;
            const PP = PPMap[productPricingId];
            if (!PP) return;
            return (
              <li key={index}>
                {PP.productName}: {PP.units * quantity} * {PP.totalKilos * quantity || "-"} *{" "}
                {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice * quantity}
                <button onClick={() => addToOrder(PP)}>+</button>
                <button onClick={() => removeFromOrder(PP)}>-</button>
              </li>
            );
          })}

          {order.deliveryFee > 0 && <li>توصيل: {order.deliveryFee}</li>}
          {order.discount > 0 && <li>خصم: {order.discount}</li>}
        </ul>
        <hr />
        <h4>الاجمالى : {calculateTotalCost()}</h4>
        <button style={{ width: "100%", height: "50px" }} onClick={handleUpdateOrder}>
          اضافة الطلب
        </button>
      </div>
      {/* Product Buttons */}
      <div style={{ display: "flex", marginRight: "200px", flexWrap: "wrap", border: "1px solid #ccc" }}>
        {/* <div style={{ flex: 3 }}> */}
        {PPs.map((item) => (
          <div key={item._id} style={{ minWidth: "250px", marginBottom: "50px" }}>
            <h3>{item.name}</h3>
            {item.products.map((product) => (
              <div key={product._id}>
                <h4>{product.name}</h4>
                {product.productPricings.map((PP) => (
                  <>
                    <button key={PP._id} onClick={() => addToOrder(PP)}>
                      {PP.units} x {PP.totalKilos || "-"} x {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice}
                    </button>
                    <br />
                  </>
                ))}
              </div>
            ))}
          </div>
        ))}
        {/* </div> */}

        {/* Fixed Order Summary */}
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
              const { productPricing: productPricingId, quantity } = orderProduct;
              const PP = PPMap[productPricingId];
              return (
                <li key={index}>
                  {PP.productName}: {PP.units * quantity} * {PP.totalKilos * quantity || "-"} *{" "}
                  {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice * quantity}
                  <button onClick={() => addToOrder(PP)}>+</button>
                  <button onClick={() => removeFromOrder(PP)}>-</button>
                </li>
              );
            })}

            {order.deliveryFee > 0 && <li>توصيل: {order.deliveryFee}</li>}
            {order.discount > 0 && <li>خصم: {order.discount}</li>}
          </ul>
          <hr />
          <h4>الاجمالى : {calculateTotalCost()}</h4>
          <button style={{ width: "100%", height: "50px" }} onClick={handleUpdateOrder}>
            اضافة الطلب
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateOrder;
