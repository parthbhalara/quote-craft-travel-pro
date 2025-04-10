import React from "react";
import { AdditionalCost } from "@/types";

interface AdditionalCostsSectionProps {
  additionalCosts: AdditionalCost[];
  additionalCostsTotal: number;
}

const AdditionalCostsSection: React.FC<AdditionalCostsSectionProps> = ({ 
  additionalCosts, 
  additionalCostsTotal 
}) => {
  if (!additionalCosts || additionalCosts.length === 0) {
    return null;
  }

  return (
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
              <td className="py-2 px-3 text-right border">₹{cost.amount.toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td className="py-2 px-3 text-right border font-medium">
              Additional Costs Subtotal:
            </td>
            <td className="py-2 px-3 text-right border font-bold">
              ₹{additionalCostsTotal.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdditionalCostsSection;
