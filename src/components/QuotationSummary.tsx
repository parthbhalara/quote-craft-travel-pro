import React from "react";
import { format } from "date-fns";
import { Check, Calendar, MapPin, Users, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuotation } from "@/context/QuotationContext";

const QuotationSummary: React.FC = () => {
  const { currentQuotation, calculateTotals, saveQuotation, setCurrentStep } = useQuotation();
  const totals = calculateTotals();

  if (!currentQuotation) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quotation Found</h2>
        <p className="text-gray-500">Please create a new quotation first.</p>
        <Button className="mt-4" onClick={() => setCurrentStep("details")}>
          Start New Quotation
        </Button>
      </div>
    );
  }

  const { details, transportOptions, itineraryItems, additionalCosts, serviceCharge } = currentQuotation;

  const handleSaveAndPreview = () => {
    saveQuotation();
    setCurrentStep("preview");
  };

  const handleBack = () => {
    setCurrentStep("costs");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quotation Summary</h2>
        <p className="text-gray-500 mt-1">
          Review all quotation details before generating the PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-travel-blue" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium">{details.customerName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Number of Travelers</div>
                <div className="font-medium">{details.numberOfTravelers}</div>
              </div>
              {details.budget && (
                <div>
                  <div className="text-sm text-gray-500">Budget</div>
                  <div className="font-medium">₹{details.budget.toFixed(2)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-travel-blue" />
              Travel Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Start Date</div>
                <div className="font-medium">{format(details.startDate, "PPP")}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">End Date</div>
                <div className="font-medium">{format(details.endDate, "PPP")}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium">
                  {Math.ceil((details.endDate.getTime() - details.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-travel-blue" />
              Destinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="text-sm text-gray-500">Travel Locations</div>
              <div className="font-medium">{details.travelLocations}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transport Options</CardTitle>
          <CardDescription>
            {transportOptions.length} transport options added
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Cost Per Traveler</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transportOptions.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>{option.from}</TableCell>
                  <TableCell>{option.to}</TableCell>
                  <TableCell>
                    <span className="capitalize">{option.mode}</span>
                  </TableCell>
                  <TableCell>₹{option.costPerTraveler.toFixed(2)}</TableCell>
                  <TableCell>₹{(option.costPerTraveler * details.numberOfTravelers).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Transport Subtotal:
                </TableCell>
                <TableCell className="font-bold">
                  ₹{totals.transportTotal.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Itinerary</CardTitle>
          <CardDescription>
            {itineraryItems.length} days of itinerary planned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {itineraryItems
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        Day {Math.floor((item.date.getTime() - details.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} - {format(item.date, "EEEE, MMMM d")}
                      </h4>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                    {item.hotelCost && (
                      <Badge variant="outline" className="bg-travel-teal-light text-travel-teal border-travel-teal">
                        ₹{item.hotelCost.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {item.hotelName && (
                      <div>
                        <p className="font-medium">Accommodation</p>
                        <p className="text-gray-500">{item.hotelName}</p>
                      </div>
                    )}
                    
                    {item.activities && (
                      <div>
                        <p className="font-medium">Activities</p>
                        <p className="text-gray-500">{item.activities}</p>
                      </div>
                    )}
                    
                    {item.localTravel && (
                      <div>
                        <p className="font-medium">Local Travel</p>
                        <p className="text-gray-500">{item.localTravel}</p>
                      </div>
                    )}
                    
                    {item.notes && (
                      <div>
                        <p className="font-medium">Notes</p>
                        <p className="text-gray-500">{item.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            <div className="text-right font-medium pt-2">
              Accommodation Subtotal: <span className="font-bold">₹{totals.hotelTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-travel-blue" />
            Cost Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {additionalCosts && additionalCosts.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Additional Costs</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {additionalCosts.map((cost) => (
                      <TableRow key={cost.id}>
                        <TableCell>{cost.description}</TableCell>
                        <TableCell className="text-right">₹{cost.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium">Additional Costs Subtotal:</TableCell>
                      <TableCell className="text-right font-bold">
                        ₹{totals.additionalCostsTotal.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Transport Total:</span>
                  <span>₹{totals.transportTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accommodation Total:</span>
                  <span>₹{totals.hotelTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Costs Total:</span>
                  <span>₹{totals.additionalCostsTotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge {serviceCharge?.type === "percentage" && 
                    `(${serviceCharge.value}%)`
                  }:</span>
                  <span>₹{totals.serviceChargeAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span>₹{totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {details.budget && (
              <div className={cn(
                "p-3 rounded-md flex justify-between items-center",
                totals.grandTotal <= details.budget ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              )}>
                <div className="flex items-center">
                  {totals.grandTotal <= details.budget ? (
                    <Check className="h-5 w-5 mr-2" />
                  ) : (
                    <span className="text-xl mr-2">!</span>
                  )}
                  <span>Customer Budget: ₹{details.budget.toFixed(2)}</span>
                </div>
                <div className="font-medium">
                  {totals.grandTotal <= details.budget 
                    ? `₹${(details.budget - totals.grandTotal).toFixed(2)} under budget`
                    : `₹${(totals.grandTotal - details.budget).toFixed(2)} over budget`
                  }
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          &larr; Back
        </Button>
        <Button 
          onClick={handleSaveAndPreview} 
          className="bg-travel-blue hover:bg-travel-blue-dark"
        >
          Save & Preview PDF &rarr;
        </Button>
      </div>
    </div>
  );
};

export default QuotationSummary;
