const printInvoicesStyle = `<style>
@page { size: A4 }
.all-invoices-container {
        display: flex;
        flex-wrap: wrap;
}
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
padding: 1px;
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
  
</style>`;

export default printInvoicesStyle;
