
'use client';
import React from 'react';
import { useInvoices } from '@/contexts/InvoiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { exportInvoiceToPDF } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

export default function InvoiceHistoryPage() {
  const { invoices } = useInvoices();
  const { toast } = useToast();

  const handleViewPdf = (invoice: import('@/lib/types').Invoice) => {
    exportInvoiceToPDF(invoice, `Invoice_${invoice.customerName.replace(/\s/g, '_')}_${invoice.id}.pdf`);
    toast({ title: 'PDF Download Started', description: `Downloading invoice ${invoice.id}.` });
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Invoice History</CardTitle>
          <CardDescription>View and manage your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No invoices found in your history.</p>
          ) : (
            <div className="rounded-md border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Grand Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">${invoice.grandTotal.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewPdf(invoice)}>
                          <Eye className="mr-2 h-4 w-4" /> View PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
