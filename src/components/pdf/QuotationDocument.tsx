
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Quotation } from "@/types";
import PDFHeader from "./PDFHeader";
import ClientInfoSection from "./ClientInfoSection";
import TravelDetailsSection from "./TravelDetailsSection";
import TransportationSection from "./TransportationSection";
import ItinerarySection from "./ItinerarySection";
import AdditionalCostsSection from "./AdditionalCostsSection";
import CostSummarySection from "./CostSummarySection";
import TermsAndConditions from "./TermsAndConditions";
import PDFFooter from "./PDFFooter";

interface QuotationDocumentProps {
  quotation: Quotation;
  totals: {
    transportTotal: number;
    hotelTotal: number;
    additionalCostsTotal: number;
    subtotal: number;
    serviceChargeAmount: number;
    grandTotal: number;
  };
}

const QuotationDocument: React.FC<QuotationDocumentProps> = ({ quotation, totals }) => {
  const { details, transportOptions, itineraryItems, additionalCosts, serviceCharge } = quotation;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <PDFHeader documentTitle="Travel Quote" />
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <ClientInfoSection details={details} />
        <TravelDetailsSection details={details} />
      </div>
      
      <TransportationSection 
        transportOptions={transportOptions} 
        numberOfTravelers={details.numberOfTravelers}
        transportTotal={totals.transportTotal}
      />
      
      <ItinerarySection 
        itineraryItems={itineraryItems} 
        hotelTotal={totals.hotelTotal} 
      />
      
      {additionalCosts && additionalCosts.length > 0 && (
        <AdditionalCostsSection 
          additionalCosts={additionalCosts} 
          additionalCostsTotal={totals.additionalCostsTotal} 
        />
      )}
      
      <CostSummarySection totals={totals} serviceCharge={serviceCharge} />
      
      <TermsAndConditions validityDays={14} depositPercentage={25} paymentDaysBefore={30} />
      
      <PDFFooter companyName="TravelPro Agency" />
    </div>
  );
};

export default QuotationDocument;
