'use client';

import React, { type ReactNode } from 'react';
import { ProductProvider } from './ProductContext';
import { FavoritesProvider } from './FavoritesContext';
// Import other providers here if needed, e.g., InvoiceProvider

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProductProvider>
      <FavoritesProvider>
        {/* <InvoiceProvider> */}
          {children}
        {/* </InvoiceProvider> */}
      </FavoritesProvider>
    </ProductProvider>
  );
}
