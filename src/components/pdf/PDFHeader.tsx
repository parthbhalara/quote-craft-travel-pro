
import React from "react";
import { format } from "date-fns";

interface PDFHeaderProps {
  documentTitle: string;
}

const PDFHeader: React.FC<PDFHeaderProps> = ({ documentTitle }) => {
  return (
    <div className="flex justify-between items-center pb-6">
      <div>
        <h1 className="text-3xl font-bold text-travel-blue">{documentTitle}</h1>
        <p className="text-gray-500">Generated on {format(new Date(), "PPP")}</p>
      </div>
      <div className="text-right">
        <div className="font-bold text-xl">TravelPro Agency</div>
        <div className="text-gray-500">Professional Travel Solutions</div>
        <div className="text-sm text-gray-500">contact@travelpro-agency.com</div>
        <div className="text-sm text-gray-500">+1 (555) 123-4567</div>
      </div>
    </div>
  );
};

export default PDFHeader;
