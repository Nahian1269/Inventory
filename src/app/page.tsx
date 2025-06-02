
'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProducts } from '@/contexts/ProductContext';
import { DollarSign, Package, TrendingUp, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  totalProducts: number;
  totalInventoryValue: number;
  averageProductValue: number;
  mostStockedProduct: { name: string; quantity: number };
  isLoading: boolean;
}

export default function DashboardPage() {
  const { products } = useProducts();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    totalInventoryValue: 0,
    averageProductValue: 0,
    mostStockedProduct: { name: 'N/A', quantity: 0 },
    isLoading: true,
  });

  useEffect(() => {
    // products data is now reliably from client-side localStorage or initial state
    const calculatedTotalProducts = products.length;
    const calculatedTotalInventoryValue = products.reduce((sum, product) => sum + product.sellingPrice * product.quantity, 0);
    const calculatedAverageProductValue = calculatedTotalProducts > 0 ? calculatedTotalInventoryValue / calculatedTotalProducts : 0;
    
    let calculatedMostStockedProduct = { name: 'N/A', quantity: 0 };
    if (products.length > 0) {
      calculatedMostStockedProduct = products.reduce((max, p) => (p.quantity > max.quantity ? p : max), products[0]);
    }
    
    setDashboardData({
      totalProducts: calculatedTotalProducts,
      totalInventoryValue: calculatedTotalInventoryValue,
      averageProductValue: calculatedAverageProductValue,
      mostStockedProduct: calculatedMostStockedProduct,
      isLoading: false,
    });
  }, [products]);

  if (dashboardData.isLoading) {
    return (
      <div className="space-y-6">
        <Alert className="bg-primary/10 border-primary/30">
          <Info className="h-5 w-5 text-primary" />
          <AlertTitle className="font-headline text-primary">Welcome to InvoMaster!</AlertTitle>
          <AlertDescription>
            Manage your inventory, generate invoices, and discover insights with ease.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-1/4 mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-1/2 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Product Value</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-1/2 mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
          <Card className="shadow-lg">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Stocked</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Quick Actions</CardTitle>
            <CardDescription>Quickly navigate to common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Skeleton className="h-20 rounded-lg border" />
              <Skeleton className="h-20 rounded-lg border" />
              <Skeleton className="h-20 rounded-lg border" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/10 border-primary/30">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Welcome to InvoMaster!</AlertTitle>
        <AlertDescription>
          Manage your inventory, generate invoices, and discover insights with ease.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">{dashboardData.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Unique product entries</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">${dashboardData.totalInventoryValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-muted-foreground">Based on selling price</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Product Value</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">${dashboardData.averageProductValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-muted-foreground">Average value per product</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Stocked</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-headline truncate" title={dashboardData.mostStockedProduct.name}>{dashboardData.mostStockedProduct.name}</div>
            <p className="text-xs text-muted-foreground">{dashboardData.mostStockedProduct.quantity} units in stock</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Quick Actions</CardTitle>
          <CardDescription>Quickly navigate to common tasks.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ButtonLink href="/products" title="Manage Products" description="Add, edit, or remove products." />
            <ButtonLink href="/invoices" title="New Invoice" description="Generate a new sales invoice." />
            <ButtonLink href="/favorites" title="View Favorites" description="See your trending products." />
        </CardContent>
      </Card>

    </div>
  );
}

interface ButtonLinkProps {
    href: string;
    title: string;
    description: string;
}
const ButtonLink = ({ href, title, description }: ButtonLinkProps) => (
    <Link href={href} className="block p-4 rounded-lg border bg-card hover:bg-muted transition-colors">
        <h3 className="font-semibold font-headline text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
);
