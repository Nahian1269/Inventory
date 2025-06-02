'use client';
import type { Product } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => boolean; // Returns true if successful, false if ID exists
  removeProduct: (productId: string) => void;
  updateProduct: (updatedProduct: Product) => boolean; // Returns true if successful
  getProductById: (productId: string) => Product | undefined;
  updateInventory: (productId: string, quantitySold: number) => boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('invoMasterProducts', []);

  const addProduct = useCallback((product: Product): boolean => {
    if (products.some(p => p.id === product.id)) {
      return false; // Product ID already exists
    }
    setProducts(prevProducts => [...prevProducts, product]);
    return true;
  }, [products, setProducts]);

  const removeProduct = useCallback((productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  }, [setProducts]);

  const updateProduct = useCallback((updatedProduct: Product): boolean => {
    let found = false;
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === updatedProduct.id) {
          found = true;
          return updatedProduct;
        }
        return p;
      })
    );
    return found;
  }, [setProducts]);
  
  const getProductById = useCallback((productId: string) => {
    return products.find(p => p.id === productId);
  }, [products]);

  const updateInventory = useCallback((productId: string, quantitySold: number): boolean => {
    const product = products.find(p => p.id === productId);
    if (product && product.quantity >= quantitySold) {
      const updatedProduct = { ...product, quantity: product.quantity - quantitySold };
      updateProduct(updatedProduct);
      return true;
    }
    return false; // Product not found or insufficient quantity
  }, [products, updateProduct]);

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, updateProduct, getProductById, updateInventory }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
