
import React from "react";
import { format } from "date-fns";
import {
  Edit2,
  Copy,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuotation } from "@/context/QuotationContext";
import { useToast } from "@/hooks/use-toast";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "draft":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "sent":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "accepted":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "declined":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "sent":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "accepted":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "declined":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const QuotationsList: React.FC = () => {
  const { quotations, editQuotation, duplicateQuotation, deleteQuotation, currentQuotation, resetCurrentQuotation } =
    useQuotation();
  const { toast } = useToast();

  const handleEdit = (id: string) => {
    editQuotation(id);
    toast({
      title: "Quotation opened for editing",
      description: "You can now make changes to this quotation.",
    });
  };

  const handleDuplicate = (id: string) => {
    duplicateQuotation(id);
    toast({
      title: "Quotation duplicated",
      description: "A copy of the quotation has been created.",
    });
  };

  const handleDelete = (id: string) => {
    deleteQuotation(id);
    toast({
      title: "Quotation deleted",
      description: "The quotation has been permanently removed.",
    });
  };

  const handleCreateNew = () => {
    resetCurrentQuotation();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quotation Management</h2>
          <p className="text-gray-500 mt-1">
            Manage all your customer quotations in one place.
          </p>
        </div>

        <Button onClick={handleCreateNew} className="bg-travel-blue hover:bg-travel-blue-dark">
          Create New Quotation
        </Button>
      </div>

      {quotations.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Travel Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => {
                // Calculate the total value
                let total = 0;
                const transportTotal = quotation.transportOptions.reduce(
                  (sum, t) => sum + t.costPerTraveler * quotation.details.numberOfTravelers,
                  0
                );
                const accommodationTotal = quotation.itineraryItems.reduce(
                  (sum, i) => sum + (i.hotelCost || 0),
                  0
                );
                const additionalTotal = (quotation.additionalCosts || []).reduce(
                  (sum, c) => sum + c.amount,
                  0
                );
                const subtotal = transportTotal + accommodationTotal + additionalTotal;
                
                if (quotation.serviceCharge) {
                  const { type, value } = quotation.serviceCharge;
                  const serviceCharge = type === "fixed" 
                    ? value 
                    : (subtotal * value) / 100;
                  total = subtotal + serviceCharge;
                } else {
                  total = subtotal;
                }

                return (
                  <TableRow key={quotation.details.id}>
                    <TableCell>
                      {format(quotation.details.createdAt, "PP")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {quotation.details.customerName}
                    </TableCell>
                    <TableCell>
                      {format(quotation.details.startDate, "PP")} - {format(quotation.details.endDate, "PP")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(quotation.details.status)}
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(quotation.details.status)}
                          <span className="capitalize">{quotation.details.status}</span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>€{total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(quotation.details.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicate(quotation.details.id)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Duplicate</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this quotation? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDelete(quotation.details.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-gray-50">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No quotations yet</h3>
          <p className="text-gray-500 text-center mb-6">
            Get started by creating your first customer quotation.
          </p>
          <Button onClick={handleCreateNew} className="bg-travel-blue hover:bg-travel-blue-dark">
            Create New Quotation
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuotationsList;
