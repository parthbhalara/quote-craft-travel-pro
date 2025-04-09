
import React from "react";
import { format } from "date-fns";
import { QuotationDetails } from "@/types";

interface TravelDetailsSectionProps {
  details: QuotationDetails;
}

const TravelDetailsSection: React.FC<TravelDetailsSectionProps> = ({ details }) => {
  return (
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
  );
};

export default TravelDetailsSection;
