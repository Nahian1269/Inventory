import type { Product, Invoice } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Note: Full Excel export requires a library like 'xlsx'.
// This is a placeholder implementation.
// To implement fully:
// 1. `npm install xlsx`
// 2. `npm install @types/xlsx --save-dev` (if not already via another lib)
// 3. Uncomment and adapt the example code using `xlsx.utils.json_to_sheet` and `xlsx.writeFile`.

export const exportProductsToExcel = (products: Product[], fileName: string = 'products.xlsx'): void => {
  console.log('Exporting products to Excel:', products);
  alert(`Excel export functionality requires the 'xlsx' library. ${products.length} products would be exported to ${fileName}.`);
  // Example with xlsx:
  // const worksheet = XLSX.utils.json_to_sheet(products);
  // const workbook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  // XLSX.writeFile(workbook, fileName);
};

export const exportShippingListToExcel = (shippingItems: any[], fileName: string = 'shipping-list.xlsx'): void => {
  console.log('Exporting shipping list to Excel:', shippingItems);
  alert(`Excel export functionality requires the 'xlsx' library. ${shippingItems.length} items would be exported to ${fileName}.`);
};

export const exportInvoiceToPDF = (invoiceData: Invoice, fileName: string = 'invoice.pdf'): void => {
  const doc = new jsPDF();

  // Add a title
  doc.setFontSize(22);
  doc.text('Invoice', 14, 22);

  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice ID: ${invoiceData.id}`, 14, 32);
  doc.text(`Customer: ${invoiceData.customerName}`, 14, 39);
  doc.text(`Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}`, 14, 46);
  
  if (invoiceData.dueDate) {
    doc.text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`, 14, 53);
  }

  // Prepare table data
  const tableColumn = ["Product Name", "Quantity", "Unit Price", "Total Price"];
  const tableRows: (string | number)[][] = [];

  invoiceData.items.forEach(item => {
    const itemData = [
      item.productName,
      item.quantity,
      `$${item.unitPrice.toFixed(2)}`,
      `$${item.totalPrice.toFixed(2)}`
    ];
    tableRows.push(itemData);
  });

  // Add table
  autoTable(doc, {
    startY: (invoiceData.dueDate ? 53 : 46) + 10, // Adjust startY based on whether dueDate is present
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 136, 229] }, // Example: Blue header (Tailwind's primary-like color)
    styles: { fontSize: 10 },
  });

  // Add totals
  let finalY = (doc as any).lastAutoTable.finalY; // Get Y position after table
  if (finalY === undefined) { // Fallback if finalY is not set
    finalY = (invoiceData.dueDate ? 53 : 46) + 10 + (invoiceData.items.length + 1) * 10; // Estimate
  }


  doc.setFontSize(10);
  const rightAlignX = doc.internal.pageSize.width - 14;

  doc.text('Subtotal:', rightAlignX - 40, finalY + 10);
  doc.text(`$${invoiceData.subTotal.toFixed(2)}`, rightAlignX, finalY + 10, { align: 'right' });

  doc.text(`Tax (${(invoiceData.taxRate * 100).toFixed(0)}%):`, rightAlignX - 40, finalY + 17);
  doc.text(`$${invoiceData.taxAmount.toFixed(2)}`, rightAlignX, finalY + 17, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Grand Total:', rightAlignX - 40, finalY + 26);
  doc.text(`$${invoiceData.grandTotal.toFixed(2)}`, rightAlignX, finalY + 26, { align: 'right' });

  doc.save(fileName);
};
