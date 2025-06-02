
'use client';

import React, { type ReactNode } from 'react';
import { ProductProvider } from './ProductContext';
import { FavoritesProvider } from './FavoritesContext';
import { InvoiceProvider } from './InvoiceContext'; // Import InvoiceProvider

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProductProvider>
      <FavoritesProvider>
        <InvoiceProvider> 
          {children}
        </InvoiceProvider>
      </FavoritesProvider>
    </ProductProvider>
  );
}
