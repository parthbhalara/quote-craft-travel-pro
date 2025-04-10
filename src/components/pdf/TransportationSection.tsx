import React from "react";
import { Transport, QuotationDetails } from "@/types";

interface TransportationSectionProps {
  transportOptions: Transport[];
  numberOfTravelers: number;
  transportTotal: number;
}

const TransportationSection: React.FC<TransportationSectionProps> = ({ 
  transportOptions, 
  numberOfTravelers, 
  transportTotal 
}) => {
  return (
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
              <td className="py-2 px-3 text-right border">₹{option.costPerTraveler.toFixed(2)}</td>
              <td className="py-2 px-3 text-right border">₹{(option.costPerTraveler * numberOfTravelers).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={4} className="py-2 px-3 text-right border font-medium">
              Transport Subtotal:
            </td>
            <td className="py-2 px-3 text-right border font-bold">
              ₹{transportTotal.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TransportationSection;
