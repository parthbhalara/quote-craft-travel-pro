
import React, { useRef } from "react";
import { format } from "date-fns";
import generatePDF from "react-to-pdf";
import { Download, Printer, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuotation } from "@/context/QuotationContext";
import { useToast } from "@/hooks/use-toast";

const PDFQuotation: React.FC = () => {
  const { currentQuotation, calculateTotals, setCurrentStep } = useQuotation();
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);

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
  const totals = calculateTotals();

  const handleDownloadPDF = () => {
    generatePDF({ 
      element: pdfRef.current,
      filename: `Travel_Quotation_${details.customerName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
      options: {
        // Adjust this scale if the PDF is too large or too small
        scale: 0.85,
      }
    });
    toast({
      title: "PDF Generated",
      description: "Your quotation PDF has been generated successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    setCurrentStep("summary");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quotation Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          <Button className="bg-travel-blue hover:bg-travel-blue-dark" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-1" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-8 shadow-sm" ref={pdfRef}>
        <div className="px-6 py-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center pb-6">
            <div>
              <h1 className="text-3xl font-bold text-travel-blue">Travel Quote</h1>
              <p className="text-gray-500">Generated on {format(new Date(), "PPP")}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-xl">TravelPro Agency</div>
              <div className="text-gray-500">Professional Travel Solutions</div>
              <div className="text-sm text-gray-500">contact@travelpro-agency.com</div>
              <div className="text-sm text-gray-500">+1 (555) 123-4567</div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Client Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">Client Information</h2>
              <div className="space-y-1">
                <div className="flex">
                  <div className="w-32 text-gray-500">Name:</div>
                  <div className="font-medium">{details.customerName}</div>
                </div>
                <div className="flex">
                  <div className="w-32 text-gray-500">Travelers:</div>
                  <div className="font-medium">{details.numberOfTravelers} {details.numberOfTravelers === 1 ? 'person' : 'people'}</div>
                </div>
                {details.budget && (
                  <div className="flex">
                    <div className="w-32 text-gray-500">Budget:</div>
                    <div className="font-medium">€{details.budget.toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Travel Details</h2>
              <div className="space-y-1">
                <div className="flex">
                  <div className="w-32 text-gray-500">Destinations:</div>
                  <div className="font-medium">{details.travelLocations}</div>
                </div>
                <div className="flex">
                  <div className="w-32 text-gray-500">Start Date:</div>
                  <div className="font-medium">{format(details.startDate, "PPP")}</div>
                </div>
                <div className="flex">
                  <div className="w-32 text-gray-500">End Date:</div>
                  <div className="font-medium">{format(details.endDate, "PPP")}</div>
                </div>
                <div className="flex">
                  <div className="w-32 text-gray-500">Duration:</div>
                  <div className="font-medium">
                    {Math.ceil((details.endDate.getTime() - details.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transport Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-travel-blue">Transportation</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 text-left border">From</th>
                  <th className="py-2 px-3 text-left border">To</th>
                  <th className="py-2 px-3 text-left border">Mode</th>
                  <th className="py-2 px-3 text-right border">Cost Per Person</th>
                  <th className="py-2 px-3 text-right border">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {transportOptions.map((option) => (
                  <tr key={option.id}>
                    <td className="py-2 px-3 border">{option.from}</td>
                    <td className="py-2 px-3 border">{option.to}</td>
                    <td className="py-2 px-3 border capitalize">{option.mode}</td>
                    <td className="py-2 px-3 text-right border">€{option.costPerTraveler.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right border">€{(option.costPerTraveler * details.numberOfTravelers).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="py-2 px-3 text-right border font-medium">
                    Transport Subtotal:
                  </td>
                  <td className="py-2 px-3 text-right border font-bold">
                    €{totals.transportTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Itinerary Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-travel-blue">Daily Itinerary</h2>
            <div className="space-y-6">
              {itineraryItems
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-travel-blue">
                      Day {index + 1} - {format(item.date, "EEEE, MMMM d")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-700">{item.location}</p>
                        
                        {item.activities && (
                          <div className="mt-3">
                            <p className="font-medium">Activities</p>
                            <p className="text-gray-700">{item.activities}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        {item.hotelName && (
                          <div>
                            <p className="font-medium">Accommodation</p>
                            <p className="text-gray-700">{item.hotelName}</p>
                            {item.hotelCost && (
                              <p className="text-gray-700 font-medium">
                                €{item.hotelCost.toFixed(2)}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {item.localTravel && (
                          <div className="mt-3">
                            <p className="font-medium">Local Travel</p>
                            <p className="text-gray-700">{item.localTravel}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {item.notes && (
                      <div className="mt-3">
                        <p className="font-medium">Notes</p>
                        <p className="text-gray-700">{item.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              
              <div className="text-right font-medium pt-2">
                Accommodation Subtotal: <span className="font-bold">€{totals.hotelTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Additional Costs */}
          {additionalCosts && additionalCosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-travel-blue">Additional Costs</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-3 text-left border">Description</th>
                    <th className="py-2 px-3 text-right border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {additionalCosts.map((cost) => (
                    <tr key={cost.id}>
                      <td className="py-2 px-3 border">{cost.description}</td>
                      <td className="py-2 px-3 text-right border">€{cost.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2 px-3 text-right border font-medium">
                      Additional Costs Subtotal:
                    </td>
                    <td className="py-2 px-3 text-right border font-bold">
                      €{totals.additionalCostsTotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          
          {/* Cost Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-travel-blue">Cost Summary</h2>
            <div className="border rounded-lg p-6 bg-gray-50">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1">Transport Total:</td>
                    <td className="py-1 text-right">€{totals.transportTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Accommodation Total:</td>
                    <td className="py-1 text-right">€{totals.hotelTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Additional Costs Total:</td>
                    <td className="py-1 text-right">€{totals.additionalCostsTotal.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-2 font-medium">Subtotal:</td>
                    <td className="py-2 text-right font-medium">€{totals.subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Service Charge {serviceCharge?.type === "percentage" && 
                      `(${serviceCharge.value}%)`
                    }:</td>
                    <td className="py-1 text-right">€{totals.serviceChargeAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t border-gray-300">
                    <td className="py-2 font-bold text-lg">Grand Total:</td>
                    <td className="py-2 text-right font-bold text-lg">€{totals.grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Terms and Conditions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-travel-blue">Terms and Conditions</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>1. This quotation is valid for 14 days from the issue date.</p>
              <p>2. A deposit of 25% is required to confirm the booking.</p>
              <p>3. Full payment is required 30 days before the travel start date.</p>
              <p>4. Cancellation policy applies as per our standard terms.</p>
              <p>5. Prices are subject to change based on availability.</p>
              <p>6. Travel insurance is strongly recommended.</p>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-gray-500 text-sm border-t pt-6 mt-8">
            <p>Thank you for choosing TravelPro Agency. We look forward to making your journey memorable!</p>
            <p className="mt-2">For any questions or adjustments, please contact your travel agent.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFQuotation;
