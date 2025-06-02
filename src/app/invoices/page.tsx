
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/contexts/ProductContext';
import type { Product, InvoiceItem, Invoice } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, PlusCircle, Trash2, Download, User, CalendarDays, Phone, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportInvoiceToPDF } from '@/lib/export';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInvoices } from '@/contexts/InvoiceContext'; // Import useInvoices

export default function InvoicesPage() {
  const { products, getProductById, updateInventory } = useProducts();
  const { addInvoice } = useInvoices(); // Get addInvoice function
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);


  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    setSearchResults(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearchTerm) ||
          p.id.toLowerCase().includes(lowerSearchTerm)
      ).slice(0, 5) // Limit results
    );
  }, [searchTerm, products]);


  const addProductToInvoice = (product: Product) => {
    if (product.quantity <= 0) {
      toast({ title: "Out of Stock", description: `${product.name} is currently out of stock.`, variant: "destructive" });
      return;
    }
    
    setInvoiceItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.quantity) {
          return prevItems.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice } : item
          );
        } else {
          toast({ title: "Max Quantity Reached", description: `Cannot add more ${product.name} than available in stock.`, variant: "destructive" });
          return prevItems;
        }
      }
      return [
        ...prevItems,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.sellingPrice,
          totalPrice: product.sellingPrice,
        },
      ];
    });
    setSearchTerm(''); 
    setSearchResults([]);
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    const product = getProductById(productId);
    if (!product) return;

    if (newQuantity <= 0) {
      removeInvoiceItem(productId);
      return;
    }
    if (newQuantity > product.quantity) {
      toast({ title: "Insufficient Stock", description: `Only ${product.quantity} units of ${product.name} available.`, variant: "destructive"});
      setInvoiceItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: product.quantity, totalPrice: product.quantity * item.unitPrice } : item
        )
      );
      return;
    }
    setInvoiceItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice } : item
      )
    );
  };
  
  const removeInvoiceItem = (productId: string) => {
    setInvoiceItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const subTotal = useMemo(() => invoiceItems.reduce((sum, item) => sum + item.totalPrice, 0), [invoiceItems]);
  const taxRate = 0.1; 
  const taxAmount = subTotal * taxRate;
  const grandTotal = subTotal + taxAmount;

  const handleGenerateInvoice = () => {
    if (!customerName) {
      toast({ title: "Missing Information", description: "Please enter customer name.", variant: "destructive" });
      return;
    }
    if (invoiceItems.length === 0) {
      toast({ title: "Empty Invoice", description: "Please add products to the invoice.", variant: "destructive" });
      return;
    }

    let allUpdatesSuccessful = true;
    invoiceItems.forEach(item => {
      const success = updateInventory(item.productId, item.quantity);
      if (!success) {
        allUpdatesSuccessful = false;
        const product = getProductById(item.productId);
        toast({
          title: "Inventory Update Failed",
          description: `Could not update inventory for ${product?.name || item.productId}. Sale not completed.`,
          variant: "destructive"
        });
      }
    });

    if (allUpdatesSuccessful) {
      const invoiceData: Invoice = { // Ensure type is Invoice
        id: `INV-${Date.now()}`,
        customerName,
        customerPhoneNumber: customerPhoneNumber || undefined,
        customerAddress: customerAddress || undefined,
        invoiceDate,
        items: invoiceItems,
        subTotal,
        taxRate,
        taxAmount,
        grandTotal,
      };
      
      exportInvoiceToPDF(invoiceData, `Invoice_${customerName.replace(/\s/g, '_')}_${invoiceData.id}.pdf`);
      addInvoice(invoiceData); // Save invoice to context
      toast({ title: 'Invoice Generated!', description: `Invoice for ${customerName} created, saved, and inventory updated.` });
      
      setInvoiceItems([]);
      setCustomerName('');
      setCustomerPhoneNumber('');
      setCustomerAddress('');
      setSearchTerm('');
    }
  };
  
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create New Invoice</CardTitle>
          <CardDescription>Search for products and add them to the invoice. Inventory will be updated upon generation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="customerName" className="flex items-center mb-1"><User className="w-4 h-4 mr-2 text-muted-foreground" />Customer Name</Label>
              <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter customer name" />
            </div>
            <div>
              <Label htmlFor="invoiceDate" className="flex items-center mb-1"><CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />Invoice Date</Label>
              <Input id="invoiceDate" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="customerPhoneNumber" className="flex items-center mb-1"><Phone className="w-4 h-4 mr-2 text-muted-foreground" />Customer Phone (Optional)</Label>
              <Input id="customerPhoneNumber" value={customerPhoneNumber} onChange={(e) => setCustomerPhoneNumber(e.target.value)} placeholder="Enter customer phone number" />
            </div>
            <div>
              <Label htmlFor="customerAddress" className="flex items-center mb-1"><Home className="w-4 h-4 mr-2 text-muted-foreground" />Customer Address (Optional)</Label>
              <Textarea id="customerAddress" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Enter customer address" rows={3}/>
            </div>
          </div>

          <div className="relative">
            <Label htmlFor="productSearch" className="flex items-center mb-1"><Search className="w-4 h-4 mr-2 text-muted-foreground" />Product Search (ID or Name)</Label>
            <Input
              id="productSearch"
              placeholder="Start typing to search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)} 
            />
            {isSearchFocused && searchResults.length > 0 && (
              <Card className="absolute z-10 w-full mt-1 shadow-lg max-h-60 overflow-y-auto">
                <ScrollArea className="max-h-60">
                <CardContent className="p-2">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-muted rounded-md cursor-pointer flex justify-between items-center"
                      onClick={() => addProductToInvoice(product)}
                    >
                      <div>
                        <p className="font-medium">{product.name} <span className="text-xs text-muted-foreground">({product.id})</span></p>
                        <p className="text-xs text-muted-foreground">In Stock: {product.quantity} | Price: ${product.sellingPrice.toFixed(2)}</p>
                      </div>
                      <PlusCircle className="h-5 w-5 text-primary" />
                    </div>
                  ))}
                </CardContent>
                </ScrollArea>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {invoiceItems.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceItems.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value))}
                        min="1"
                        className="w-20 h-8"
                      />
                    </TableCell>
                    <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.totalPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeInvoiceItem(item.productId)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex flex-col items-end space-y-2 pt-6">
            <div className="flex justify-between w-full max-w-xs text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full max-w-xs text-sm">
              <span>Tax ({ (taxRate * 100).toFixed(0) }%):</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full max-w-xs text-lg font-bold text-primary pt-2 border-t">
              <span>Grand Total:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </CardFooter>
        </Card>
      )}
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleGenerateInvoice} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Download className="mr-2 h-5 w-5" />
          Generate Invoice & Update Stock
        </Button>
      </div>
    </div>
  );
}
