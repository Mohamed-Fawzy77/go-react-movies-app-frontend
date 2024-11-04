// InvoicePrinter.js
import React, { useRef } from "react";
import Invoice from "./Invoice";
const amountPattern = /\d+(ك|ج)$/;
const InvoicePrinter = ({ orders }) => {
  const printRef = useRef();
  const allPPRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const htmlContent = `
            <html>
                <head>
                    <title>Print Invoices</title>
                    <style>
                      @page { size: A4}
                      body { display: flex; flex-wrap: wrap; }
                      .invoice{
                        height: 13.5cm;
                        border: 1px solid black;
                        border-radius: 5px;
                        width: calc(100% / 2 - 10mm );
                        padding: 10px;
                        box-sizing: border-box;
                        margin: 5mm
                      }

                      .page-break {
                        page-break-after: always;
                      }

                      .invoice-container {
  width: 300px;
  margin: 20px auto;
  font-family: "Arial", sans-serif;
  direction: rtl;
  border: 1px solid #d9d9d9;
  padding: 10px;
  background-color: #fff;
}

.invoice-header {
  text-align: center;
}

.invoice-title {
  font-weight: bold;
  font-size: 18px;
  margin: 0;
}

.invoice-contact {
  font-weight: bold;
  font-size: 18px;
  color: #888;
  margin: 0;
}

.invoice-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  direction: rtl;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.invoice-table th,
.invoice-table td {
  border: 1px solid #d9d9d9;
  padding: 8px;
  font-size: 14px;
}

.invoice-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.invoice-table td {
  font-size: 13px;
}

.invoice-table td[colspan="6"] {
  text-align: center;
  font-size: 12px;
  color: #888;
}

p{
margin: 0;}
                        
                    </style>
                </head>
                <body>
                    ${printRef.current.innerHTML}
                </body>
            </html>
        `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const orderProductsMap = {};

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

  const handlePrintPP = () => {
    const printWindow = window.open("", "_blank");
    const htmlContent = `
            <html>
                <head>
                    <title>طباعة كل الاصناف</title>
                </head>

                <style>
                @page { size: A4}
                      body { flex-wrap: wrap; direction: rtl;font-size:18px;}
                      
                      </style>

                <body>
                    <div>
                    ${new Date().toISOString()}
                    </div>
                    ${allPPRef.current.innerHTML}
                </body>
            </html>
        `;
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <button onClick={handlePrint}>اطبع كل الفواتير</button>
      <button onClick={handlePrintPP}>اطبع كل الاصناف</button>

      <div ref={allPPRef} style={{ display: "none" }}>
        <ul style={{ direction: "rtl", fontSize: "30px" }}>
          {orderProducts
            .sort((a, b) => a.productPricing.product.name.localeCompare(b.productPricing.product.name))
            .map((orderProduct, index) => {
              const PP = orderProduct.productPricing;
              return (
                <div>
                  <div key={index}>
                    {PP.product.name +
                      (amountPattern.test(PP.product.name)
                        ? ""
                        : PP.totalKilos
                        ? "(" + PP.totalKilos + "ك" + ")"
                        : "(" + PP.totalPrice + "ج" + ")")}
                    :{orderProduct.quantity}
                    {/* 
                  * ({PP.units || "-"} * {PP.totalKilos || "-"} *{" "}
                    {PP.pricePerKiloOrUnit || "-"} = {PP.totalPrice || "-"}) */}
                  </div>
                </div>
              );
            })}
        </ul>
      </div>

      <div ref={printRef} style={{ display: "none" }}>
        {orders.map((order, index) => {
          return (
            <>
              <Invoice key={index} order={order} />
              {(index + 1) % 4 === 0 && <div className="page-break"></div>}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default InvoicePrinter;
