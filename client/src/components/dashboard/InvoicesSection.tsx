import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, Receipt, ExternalLink } from "lucide-react";
import { Invoice } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface InvoicesSectionProps {
  userId: number | undefined;
}

export default function InvoicesSection({ userId }: InvoicesSectionProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fetch user invoices
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["/api/invoices"],
    enabled: !!userId,
  });
  
  // Format currency amount from cents to dollars
  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };
  
  // Get a badge for the invoice status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Billing & Invoices</CardTitle>
          <CardDescription>
            View and download your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingInvoices ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !invoices || invoices.length === 0 ? (
            <div className="text-center py-10">
              <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No invoices yet</h3>
              <p className="text-slate-500 mt-2">
                Your invoice history will appear here once you make a purchase.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice: Invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{formatAmount(invoice.amount)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        View
                      </Button>
                      {invoice.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(invoice.url, '_blank')}
                          className="ml-2"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Invoice Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              Invoice #{selectedInvoice?.id} - {selectedInvoice?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Date</h4>
                  <p>{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Status</h4>
                  <p>{getStatusBadge(selectedInvoice.status)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Amount</h4>
                  <p className="text-lg font-semibold">{formatAmount(selectedInvoice.amount)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Due Date</h4>
                  <p>
                    {selectedInvoice.dueDate
                      ? new Date(selectedInvoice.dueDate).toLocaleDateString()
                      : 'Paid immediately'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-500">Description</h4>
                <p>{selectedInvoice.description}</p>
              </div>
              
              {selectedInvoice.stripeInvoiceId && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Invoice ID</h4>
                  <p className="text-sm font-mono">{selectedInvoice.stripeInvoiceId}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
            
            {selectedInvoice?.url && (
              <Button
                variant="default"
                onClick={() => window.open(selectedInvoice.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}