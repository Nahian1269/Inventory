'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useProducts } from '@/contexts/ProductContext';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Star, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductForm } from './product-form'; // For editing
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFavorites } from '@/contexts/FavoritesContext';

export function ProductTable() {
  const { products, removeProduct } = useProducts();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleRemove = (product: Product) => {
    removeProduct(product.id);
    toast({ title: 'Product Removed', description: `${product.name} has been removed.` });
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };
  
  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
      toast({ title: 'Removed from Favorites', description: `${product.name} removed from favorites.` });
    } else {
      addFavorite(product);
      toast({ title: 'Added to Favorites', description: `${product.name} added to favorites.` });
    }
  };

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No products in inventory yet. Add some products to get started!</p>;
  }

  return (
    <>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="text-right">Selling Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Shipment Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Image
                    src={product.imageUrl || `https://placehold.co/60x60.png?text=${product.name.substring(0,2)}`}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded aspect-square object-cover"
                    data-ai-hint="product image"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">{product.id}</TableCell>
                <TableCell className="text-right">${product.sellingPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">{product.quantity}</TableCell>
                <TableCell>{new Date(product.shipmentDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleFavorite(product)}>
                        <Star className={`mr-2 h-4 w-4 ${isFavorite(product.id) ? 'fill-yellow-400 text-yellow-500' : ''}`} /> 
                        {isFavorite(product.id) ? 'Unfavorite' : 'Favorite'}
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Remove
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently remove "{product.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemove(product)} className="bg-destructive hover:bg-destructive/90">
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {productToEdit && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">Edit Product: {productToEdit.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <ProductForm productToEdit={productToEdit} onFormSubmit={() => setIsEditModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
