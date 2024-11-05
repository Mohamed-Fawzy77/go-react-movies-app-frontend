// Invoice.js
import logo from "../logo3.png";
import whatsapp from "../whatsapp.png";
import qr from "../qr.png";

import React from "react";

const RowTable = ({ orderProduct }) => {
  return (
    <tr>
      <td>{orderProduct.productPricing.product.name}</td>
      <td>{orderProduct.productPricing.pricePerKiloOrUnit || "-"}</td>
      <td>{orderProduct.productPricing.totalKilos * orderProduct.quantity || "-"}</td>
      <td>{orderProduct.quantity * orderProduct.productPricing.units}</td>
      <td>{orderProduct.productPricing.totalPrice * orderProduct.quantity}</td>
    </tr>
  );
};

// 210 x 297 mm
const Invoice = ({ order }) => {
  return (
    <div
      className="invoice-container1 invoice"
      style={{
        height: "13.5cm",
        border: "1px solid black",
        borderRadius: "5px",
        width: "calc(100% / 2 - 10mm )",
        padding: "10px",
        boxSizing: "border-box",
        margin: "5mm",
      }}
    >
      <header className="invoice-header"></header>
      <div className="invoice-body">
        <div className="invoice-info">
          <p className="invoice-title">دليفري سووق الجملة</p>
          <img height={"70x"} width={"70px"} src={logo} alt="logo" />
          <p className="invoice-contact">
            <span>01001237942</span> &nbsp;
            <img height={"15px"} width={"15px"} src={whatsapp} alt="logo" />
            <br />
            <img height={"50px"} width={"50px"} src={qr} alt="qr" style={{ marginRight: "50px" }} />
          </p>
        </div>
        <div className="invoice-info">
          <p>التاريخ: {order.deliveryDate}</p>
          <p>رقم تليفون العميل: {order.buyer.phone.replace("+2", "")}</p>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              {/* <th>قرش</th> */}
              <th>الصنف</th>

              <th>سعر</th>
              <th>كيلو</th>
              <th>عدد</th>
              <th>جنيه</th>
            </tr>
          </thead>
          <tbody>
            {order.orderProducts.map((orderProduct, index) => (
              <RowTable key={index} orderProduct={orderProduct} />
            ))}
            {order.deliveryFee > 0 && (
              <tr>
                <td>توصيل</td>
                <td colSpan={4}>{order.deliveryFee}</td>
              </tr>
            )}

            {order.discount > 0 && (
              <tr>
                <td>خصم</td>
                <td colSpan={4}> - {order.discount}</td>
              </tr>
            )}

            <br />
            <tr>
              <td>المجموع</td>
              <td colSpan={4}>{order.orderTotalPriceAfterDiscount}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ direction: "rtl" }}>
          <div style={{ marginTop: "10px" }}> العنوان: {order.address}</div>
          {order.notes && <div style={{ marginTop: "10px" }}> الملاحظات: {order.notes} </div>}
          {order.deliveryAgent && (
            <div style={{ marginTop: "10px" }}> المندوب: {order.deliveryAgent.name} </div>
          )}
        </div>
      </div>
    </div>
  );

  //   return (

  //     <div
  //       className="invoice"
  //       style={{
  //         height: "13.5cm",
  //         border: "1px solid black",
  //         borderRadius: "5px",
  //         width: "calc(100% / 2 - 10mm )",
  //         padding: "10px",
  //         boxSizing: "border-box",
  //         margin: "5mm",
  //       }}
  //     >
  //       {/* Example fields based on the provided data */}
  //       {/* <h2>Invoice</h2> */}
  //       <p>Customer: {order.buyer.name}</p>
  //       <p>Date: {order.deliveryDate}</p>
  //       {/* Add other fields and style them as per your design */}
  //       <ul>
  //         {order.orderProducts.map((orderProduct, index) => (
  //           <li key={index}>
  //             {orderProduct.productPricing.product.name} - ${orderProduct.price} x {orderProduct.quantity}
  //           </li>
  //         ))}
  //       </ul>
  //       <p>Total: ${order.total}</p>
  //     </div>
  //   );
};

export default Invoice;
