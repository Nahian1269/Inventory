'use client';
import type { Product } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface FavoritesContextType {
  favoriteProducts: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteProducts, setFavoriteProducts] = useLocalStorage<Product[]>('invoMasterFavorites', []);

  const addFavorite = useCallback((product: Product) => {
    setFavoriteProducts(prevFavorites => {
      if (prevFavorites.some(p => p.id === product.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, product];
    });
  }, [setFavoriteProducts]);

  const removeFavorite = useCallback((productId: string) => {
    setFavoriteProducts(prevFavorites => prevFavorites.filter(p => p.id !== productId));
  }, [setFavoriteProducts]);

  const isFavorite = useCallback((productId: string) => {
    return favoriteProducts.some(p => p.id === productId);
  }, [favoriteProducts]);

  return (
    <FavoritesContext.Provider value={{ favoriteProducts, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
