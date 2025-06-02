'use client';
import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/contexts/ProductContext';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, DollarSign, Hash, ImageIcon, Package, Tag, Text, Truck } from 'lucide-react';

const productSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  buyingPrice: z.coerce.number().min(0, 'Buying price must be non-negative'),
  shippingCost: z.coerce.number().min(0, 'Shipping cost must be non-negative'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be non-negative'),
  shipmentDate: z.string().min(1, 'Shipment date is required'), // Consider using a date picker
  quantity: z.coerce.number().int().min(0, 'Quantity must be a non-negative integer'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().min(1, 'Description is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm({ productToEdit, onFormSubmit }: { productToEdit?: Product, onFormSubmit?: () => void }) {
  const { addProduct, updateProduct } = useProducts();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: productToEdit || {
      id: '',
      name: '',
      buyingPrice: 0,
      shippingCost: 0,
      sellingPrice: 0,
      shipmentDate: new Date().toISOString().split('T')[0], // Default to today
      quantity: 0,
      imageUrl: '',
      description: '',
    },
  });

  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
    const productData: Product = { ...data };
    let success = false;
    if (productToEdit) {
      success = updateProduct(productData);
      if (success) {
        toast({ title: 'Product Updated', description: `${data.name} has been updated successfully.` });
        if (onFormSubmit) onFormSubmit();
      } else {
         toast({ title: 'Error', description: 'Failed to update product.', variant: 'destructive' });
      }
    } else {
      success = addProduct(productData);
      if (success) {
        toast({ title: 'Product Added', description: `${data.name} has been added successfully.` });
        reset(); // Reset form after successful addition
      } else {
        toast({ title: 'Error', description: `Product with ID ${data.id} already exists.`, variant: 'destructive' });
      }
    }
  };

  const formFields = [
    { name: 'id', label: 'Product ID', type: 'text', icon: Hash, disabled: !!productToEdit },
    { name: 'name', label: 'Product Name', type: 'text', icon: Package },
    { name: 'description', label: 'Description', type: 'textarea', icon: Text },
    { name: 'buyingPrice', label: 'Buying Price', type: 'number', icon: DollarSign },
    { name: 'shippingCost', label: 'Shipping Cost', type: 'number', icon: Truck },
    { name: 'sellingPrice', label: 'Selling Price', type: 'number', icon: Tag },
    { name: 'quantity', label: 'Quantity', type: 'number', icon: Package },
    { name: 'shipmentDate', label: 'Shipment Date', type: 'date', icon: CalendarIcon },
    { name: 'imageUrl', label: 'Image URL (Optional)', type: 'text', icon: ImageIcon },
  ] as const;


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map(field => (
          <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <Label htmlFor={field.name} className="flex items-center mb-1">
              <field.icon className="w-4 h-4 mr-2 text-muted-foreground" />
              {field.label}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea id={field.name} {...register(field.name)} rows={3} />
            ) : (
              <Input
                id={field.name}
                type={field.type}
                step={field.type === 'number' ? '0.01' : undefined}
                {...register(field.name)}
                disabled={field.disabled}
              />
            )}
            {errors[field.name] && <p className="text-sm text-destructive mt-1">{errors[field.name]?.message}</p>}
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
        {productToEdit ? 'Update Product' : 'Add Product'}
      </Button>
    </form>
  );
}
