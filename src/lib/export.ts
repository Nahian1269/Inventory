
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
  const companyName = "Generox";
  let yPos = 15;
  const pageHeight = doc.internal.pageSize.height;
  const bottomMargin = 20;


  // Add Company Name
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(companyName, 14, yPos);
  yPos += 10;

  // Add a title
  doc.setFontSize(22);
  doc.setFont(undefined, 'normal'); 
  doc.text('Invoice', 14, yPos);
  yPos += 10;

  // Add invoice details
  doc.setFontSize(10); 
  doc.text(`Invoice ID: ${invoiceData.id}`, 14, yPos);
  yPos += 6;
  doc.text(`Customer: ${invoiceData.customerName}`, 14, yPos);
  yPos += 6;
  doc.text(`Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString()}`, 14, yPos);
  yPos += 6;

  if (invoiceData.customerPhoneNumber) {
    doc.text(`Phone: ${invoiceData.customerPhoneNumber}`, 14, yPos);
    yPos += 6;
  }
  if (invoiceData.customerAddress) {
    doc.text(`Address:`, 14, yPos);
    // Handle multi-line address, ensuring it doesn't overflow yPos quickly
    const addressLines = doc.splitTextToSize(invoiceData.customerAddress, doc.internal.pageSize.width - 35); // 35 for padding
    addressLines.forEach((line: string) => {
      yPos += 5; // Increment yPos before printing each line of address
      if (yPos > pageHeight - bottomMargin - 20) { // Check for page overflow before address line
         doc.addPage();
         yPos = 15;
      }
      doc.text(line, 14, yPos);
    });
    yPos += 6; // Add some padding after the address block
  }
  
  if (invoiceData.dueDate) {
    doc.text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString()}`, 14, yPos);
    yPos += 6;
  }

  // Ensure yPos has enough space before table
  if (yPos > pageHeight - bottomMargin - 60) { // 60 as an estimate for table header + a few rows
      doc.addPage();
      yPos = 15;
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
    startY: yPos + 2, 
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 136, 229] }, 
    styles: { fontSize: 9, cellPadding: 1.5 },
    didDrawPage: (data) => { // Update yPos if table creates new page
        yPos = data.cursor?.y ?? yPos;
    }
  });

  let finalY = (doc as any).lastAutoTable.finalY; 
  if (finalY === undefined || finalY < yPos ) { 
    finalY = yPos + 5 + (invoiceData.items.length + 1) * 7; // Estimate if not available or too low
  }
  
  // Check if totals fit on current page, add new page if not
  if (finalY + 30 > pageHeight - bottomMargin) { // 30 for totals section height
    doc.addPage();
    finalY = 15; // Reset finalY for new page
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
