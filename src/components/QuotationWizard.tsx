
import React from "react";
import { useQuotation } from "@/context/QuotationContext";
import { cn } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuotationDetailsForm from "./QuotationDetailsForm";
import TransportForm from "./TransportForm";
import ItineraryForm from "./ItineraryForm";
import CostsForm from "./CostsForm";
import QuotationSummary from "./QuotationSummary";
import PDFQuotation from "./PDFQuotation";
import QuotationsList from "./QuotationsList";
import { ScrollArea } from "@/components/ui/scroll-area";

const QuotationWizard: React.FC = () => {
  const { currentStep, currentQuotation, setCurrentStep } = useQuotation();

  console.log("QuotationWizard rendering, currentStep:", currentStep, "currentQuotation:", currentQuotation ? "exists" : "null");

  return (
    <div className="h-full flex flex-col">
      {currentQuotation ? (
        <div className="h-full flex flex-col">
          <div className="bg-white border-b px-4 py-3">
            <Tabs
              value={currentStep}
              className="w-full"
              onValueChange={(value) => setCurrentStep(value as any)}
            >
              <TabsList className="grid grid-cols-6 w-full">
                <TabsTrigger
                  value="details"
                  className={cn(
                    currentStep === "details" ? "bg-blue-600 text-white" : ""
                  )}
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="transport"
                  className={cn(
                    currentStep === "transport" ? "bg-blue-600 text-white" : ""
                  )}
                >
                  Transport
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className={cn(
                    currentStep === "itinerary" ? "bg-blue-600 text-white" : ""
                  )}
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger
                  value="costs"
                  className={cn(
                    currentStep === "costs" ? "bg-blue-600 text-white" : ""
                  )}
                >
                  Costs
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className={cn(
                    currentStep === "summary" ? "bg-blue-600 text-white" : ""
                  )}
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className={cn(
                    currentStep === "preview" ? "bg-blue-600 text-white" : ""
                  )}
                >
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <ScrollArea className="flex-grow p-6 overflow-auto">
            <div className="container max-w-5xl mx-auto">
              {currentStep === "details" && <QuotationDetailsForm />}
              {currentStep === "transport" && <TransportForm />}
              {currentStep === "itinerary" && <ItineraryForm />}
              {currentStep === "costs" && <CostsForm />}
              {currentStep === "summary" && <QuotationSummary />}
              {currentStep === "preview" && <PDFQuotation />}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <ScrollArea className="flex-grow p-6 overflow-auto">
          <div className="container max-w-5xl mx-auto">
            <QuotationsList />
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default QuotationWizard;
