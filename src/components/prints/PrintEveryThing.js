// InvoicePrinter.js
import React, { useEffect, useRef, useState } from "react";
import Invoice from "../Invoice";
import { fetchOrders } from "../../http/product";
import printInvoicesStyle from "../../javascriptStyles/printInvoicesStyle";
const amountPattern = /\d+(ك|ج)$/;

const PrintEveryThing = ({}) => {
  const [orders, setOrders] = useState([]);
  const contentRef = useRef();
  const content2Ref = useRef();

  const sortedOrders = orders.sort((a, b) => (a.deliveryAgent?.name > b.deliveryAgent?.name ? 1 : -1));

  const deliveryToOrdersMap = sortedOrders.reduce((acc, order) => {
    const deliveryAgentName = order.deliveryAgent?.name;
    if (!acc[deliveryAgentName]) {
      acc[deliveryAgentName] = [];
    }
    acc[deliveryAgentName].push(order);
    return acc;
  }, {});

  const contentArr = [];

  for (const deliveryAgentName in deliveryToOrdersMap) {
    const orderProductsMap = {};

    const orders = deliveryToOrdersMap[deliveryAgentName];

    for (const order of orders) {
      for (const orderProduct of order.orderProducts) {
        const PPId = orderProduct.productPricing._id;
        if (!orderProductsMap[PPId]) {
          orderProductsMap[PPId] = {
            productPricing: orderProduct.productPricing,
            quantity: orderProduct.quantity,
          };
        } else {
          orderProductsMap[PPId].quantity += orderProduct.quantity;
        }
      }
    }

    const orderProducts = Object.values(orderProductsMap);

    const agentTotalMoney = orders.reduce((acc, order) => acc + order.orderTotalPriceAfterDiscount, 0);
    const ordersCount = orders.length;

    const content = (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", direction: "rtl" }}>
          <span> {new Date().toISOString()}</span>
          <span> {deliveryAgentName ? `المندوب: ${deliveryAgentName}` : ""}</span>
          <span> {deliveryAgentName && agentTotalMoney ? `اجمالى : ${agentTotalMoney}` : ""}</span>
          <span> {ordersCount ? `عدد الطلبات: ${ordersCount}` : ""}</span>
        </div>
        <ul style={{ direction: "rtl", fontSize: "30px" }}>
          {orderProducts
            .sort((a, b) => a.productPricing.product.name.localeCompare(b.productPricing.product.name))
            .map((orderProduct, index) => {
              const PP = orderProduct.productPricing;
              return (
                <>
                  <div>
                    <div key={index}>
                      {PP.product.name +
                        (amountPattern.test(PP.product.name)
                          ? ""
                          : PP.totalKilos
                          ? "(" + PP.totalKilos + "ك" + ")"
                          : "(" + PP.totalPrice + "ج" + ")")}
                      :{orderProduct.quantity}
                    </div>
                  </div>
                  {index % 10 === 0 && (
                    <>
                      {/* <div style={{ pageBreakAfter: "always" }} /> */}
                      {/* <div style={{ display: "flex", justifyContent: "space-between", direction: "rtl" }}>
                        <span> {new Date().toISOString()}</span>
                        <span> {deliveryAgentName ? `المندوب: ${deliveryAgentName}` : ""}</span>
                        <span>
                          {" "}
                          {deliveryAgentName && agentTotalMoney ? `اجمالى : ${agentTotalMoney}` : ""}
                        </span>
                        <span> {ordersCount ? `عدد الطلبات: ${ordersCount}` : ""}</span>
                      </div> */}
                    </>
                  )}
                </>
              );
            })}
        </ul>
      </>
    );

    contentArr.push(content);
  }

  useEffect(() => {
    const todayDate = new Date().toISOString().slice(0, 10).toString();
    fetchOrders(todayDate, setOrders);
  }, []);

  let ordersInPage = 0;

  let content = sortedOrders.map((order, index) => {
    const nextOrder = sortedOrders[index + 1];
    let pageBreak = false;
    ordersInPage++;
    console.log({
      ordersInPage,
      nextOrder,
      order: order.deliveryAgent?.name,
      nextOrder: nextOrder?.deliveryAgent?.name,
    });
    if (
      ordersInPage % 4 ===
      0
      //   ||
      //   (nextOrder && nextOrder.deliveryAgent?.name !== order.deliveryAgent?.name)
    ) {
      pageBreak = true;
      //   ordersInPage = 0;
    }
    return (
      <>
        <Invoice order={order} />
        {/* <div>order</div> */}
        {pageBreak && (
          <>
            <div style={{ pageBreakAfter: "always" }} />
          </>
        )}
      </>
    );
  });

  const handlePrintEverything = () => {
    console.log(`printing ${orders.length} orders`);
    const printWindow = window.open("", "_blank");
    const htmlContent = `
            <html>
                <head>
                    <title>Print Invoices</title>
                    ${printInvoicesStyle}
                </head>
                <body>
                    ${content2Ref.current.innerHTML}
                    
                    <div class="all-invoices-container">
                    ${contentRef.current.innerHTML}
                    </div>
                </body>
            </html>
    `;

    console.log({ htmlContent });

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <input type="date" onChange={(e) => fetchOrders(e.target.value, setOrders)} />
      <button onClick={handlePrintEverything}>Print Every thing</button>
      <div ref={contentRef} style={{ height: "100vh", backgroundColor: "white" }}>
        {content}
      </div>

      <div ref={content2Ref}>
        {contentArr.map((content, index) => (
          <div key={index} style={{ pageBreakAfter: "always" }}>
            {content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintEveryThing;
