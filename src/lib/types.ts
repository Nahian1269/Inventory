
export interface Product {
  id: string; // User-defined Product ID, should be unique
  name: string;
  buyingPrice: number;
  shippingCost: number;
  sellingPrice: number;
  shipmentDate: string; // ISO date string
  quantity: number;
  imageUrl?: string; // URL for the product image
  description: string; // Product description
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string; // Auto-generated or user-defined
  customerName: string; 
  customerPhoneNumber?: string; // Optional customer phone number
  customerAddress?: string; // Optional customer address
  items: InvoiceItem[];
  subTotal: number;
  taxRate: number; // Percentage, e.g., 0.05 for 5%
  taxAmount: number;
  grandTotal: number;
  invoiceDate: string; // ISO date string
  dueDate?: string; // ISO date string
}

// For AI suggestions payload
export interface AISuggestionPayload {
  productDescriptions: string[];
  customerData: string;
  numberOfSuggestions: number;
}
