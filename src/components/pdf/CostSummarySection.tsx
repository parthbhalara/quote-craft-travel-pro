import React from "react";
import { ServiceCharge } from "@/types";

interface CostSummarySectionProps {
  totals: {
    transportTotal: number;
    hotelTotal: number;
    additionalCostsTotal: number;
    subtotal: number;
    serviceChargeAmount: number;
    grandTotal: number;
  };
  serviceCharge?: ServiceCharge;
}

const CostSummarySection: React.FC<CostSummarySectionProps> = ({ totals, serviceCharge }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-travel-blue">Cost Summary</h2>
      <div className="border rounded-lg p-6 bg-gray-50">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-1">Transport Total:</td>
              <td className="py-1 text-right">₹{totals.transportTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-1">Accommodation Total:</td>
              <td className="py-1 text-right">₹{totals.hotelTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-1">Additional Costs Total:</td>
              <td className="py-1 text-right">₹{totals.additionalCostsTotal.toFixed(2)}</td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="py-2 font-medium">Subtotal:</td>
              <td className="py-2 text-right font-medium">₹{totals.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-1">Service Charge {serviceCharge?.type === "percentage" && 
                `(${serviceCharge.value}%)`
              }:</td>
              <td className="py-1 text-right">₹{totals.serviceChargeAmount.toFixed(2)}</td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="py-2 font-bold text-lg">Grand Total:</td>
              <td className="py-2 text-right font-bold text-lg">₹{totals.grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostSummarySection;
