import React from "react";
import { QuotationDetails } from "@/types";

interface ClientInfoSectionProps {
  details: QuotationDetails;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({ details }) => {
  return (
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
            <div className="font-medium">₹{details.budget.toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientInfoSection;
