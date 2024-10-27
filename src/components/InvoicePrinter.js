// InvoicePrinter.js
import React, { useRef } from "react";
import Invoice from "./Invoice";

const InvoicePrinter = ({ orders }) => {
  //   const orders = [];
  console.log({ orders });

  const printRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const htmlContent = `
            <html>
                <head>
                    <title>Print Invoices</title>
                    <style>
                      @page { size: A4}
                      body { display: flex; flex-wrap: wrap; }
                     
                        
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

  //   @page { size: A4; margin: 100mm; }
  //   body { display: flex; flex-wrap: wrap; }
  //   .invoice { width: 33%; padding: 10px; box-sizing: border-box; }

  return (
    <div>
      <button onClick={handlePrint}>Print Invoices</button>
      <div ref={printRef} style={{ display: "none" }}>
        {orders.map((order, index) => (
          <Invoice key={index} order={order} />
        ))}
      </div>
    </div>
  );
};

export default InvoicePrinter;
