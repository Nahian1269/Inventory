'use client';
import React from 'react';
import { ProductForm } from './components/product-form';
import { ProductTable } from './components/product-table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { exportProductsToExcel } from '@/lib/export';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ProductsPage() {
  const { products } = useProducts();

  const handleExport = () => {
    exportProductsToExcel(products, 'invoMaster_products.xlsx');
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Product</CardTitle>
          <CardDescription>Fill in the details to add a new product to your inventory.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="font-headline text-2xl">Product Inventory</CardTitle>
            <CardDescription>View, manage, and export your current product stock.</CardDescription>
          </div>
          <Button onClick={handleExport} variant="outline" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </CardHeader>
        <CardContent>
          <ProductTable />
        </CardContent>
      </Card>
    </div>
  );
}
