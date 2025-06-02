'use client';
import React from 'react';
import { useProducts } from '@/contexts/ProductContext';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportShippingListToExcel } from '@/lib/export';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ShippingItem {
  id: string;
  name: string;
  sellingPrice: number;
  imageUrl?: string;
  quantity: number; // Assuming we ship all available quantity or a defined amount
}

export default function ShippingPage() {
  const { products } = useProducts();

  // For this example, all products with quantity > 0 are shippable.
  // In a real app, this might come from orders or a specific "to ship" status.
  const shippingList: ShippingItem[] = products
    .filter(p => p.quantity > 0)
    .map(p => ({
      id: p.id,
      name: p.name,
      sellingPrice: p.sellingPrice,
      imageUrl: p.imageUrl,
      quantity: p.quantity, // Or a specific quantity from an order
    }));

  const handleExport = () => {
    const exportData = shippingList.map(item => ({
      'Product ID': item.id,
      'Name': item.name,
      'Price': item.sellingPrice,
      'Quantity': item.quantity,
      'Image URL': item.imageUrl || 'N/A',
    }));
    exportShippingListToExcel(exportData, 'invoMaster_shipping_list.xlsx');
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="font-headline text-2xl">Shipping List</CardTitle>
            <CardDescription>View products ready for shipping and export the list.</CardDescription>
          </div>
          <Button onClick={handleExport} variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download className="mr-2 h-4 w-4" />
            Export Shipping List
          </Button>
        </CardHeader>
        <CardContent>
          {shippingList.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No products currently marked for shipping or all products are out of stock.</p>
          ) : (
            <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Quantity to Ship</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        src={item.imageUrl || `https://placehold.co/60x60.png?text=${item.name.substring(0,2)}`}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded aspect-square object-cover"
                        data-ai-hint="product shipping"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">${item.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
