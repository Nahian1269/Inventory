
'use client';
import type { Invoice } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import React, { createContext, useContext, ReactNode, useCallback } from 'react';

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  getInvoiceById: (invoiceId: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoMasterInvoices', []);

  const addInvoice = useCallback((invoice: Invoice) => {
    setInvoices(prevInvoices => [invoice, ...prevInvoices]); // Add new invoices to the beginning
  }, [setInvoices]);

  const getInvoiceById = useCallback((invoiceId: string) => {
    return invoices.find(inv => inv.id === invoiceId);
  }, [invoices]);

  return (
    <InvoiceContext.Provider value={{ invoices, addInvoice, getInvoiceById }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = (): InvoiceContextType => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};
