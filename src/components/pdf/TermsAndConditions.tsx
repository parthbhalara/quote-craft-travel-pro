
import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
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
  );
};

export default TermsAndConditions;
