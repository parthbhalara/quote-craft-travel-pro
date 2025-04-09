
import React from "react";

interface PDFFooterProps {
  companyName?: string;
}

const PDFFooter: React.FC<PDFFooterProps> = ({ companyName = "TravelPro Agency" }) => {
  return (
    <div className="text-center text-gray-500 text-sm border-t pt-6 mt-8">
      <p>Thank you for choosing {companyName}. We look forward to making your journey memorable!</p>
      <p className="mt-2">For any questions or adjustments, please contact your travel agent.</p>
    </div>
  );
};

export default PDFFooter;
