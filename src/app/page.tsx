'use client';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useProducts } from '@/contexts/ProductContext';
import { DollarSign, Package, TrendingUp, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
  const { products } = useProducts();

  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((sum, product) => sum + product.sellingPrice * product.quantity, 0);
  const averageProductValue = totalProducts > 0 ? totalInventoryValue / totalProducts : 0;

  // Example: Find product with highest quantity (most stocked)
  const mostStockedProduct = products.reduce((max, p) => (p.quantity > max.quantity ? p : max), products[0] || { name: 'N/A', quantity: 0 });

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
            <div className="text-2xl font-bold font-headline">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Unique product entries</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">${totalInventoryValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-muted-foreground">Based on selling price</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Product Value</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-headline">${averageProductValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-muted-foreground">Average value per product</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Stocked</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-headline truncate" title={mostStockedProduct.name}>{mostStockedProduct.name}</div>
            <p className="text-xs text-muted-foreground">{mostStockedProduct.quantity} units in stock</p>
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
