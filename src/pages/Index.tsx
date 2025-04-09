
import React from "react";
import { QuotationProvider } from "@/context/QuotationContext";
import QuotationWizard from "@/components/QuotationWizard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-travel-blue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Travel Quotation Pro</h1>
          <div className="text-sm">Travel Agent Dashboard</div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col h-[calc(100vh-64px)]">
        <QuotationProvider>
          <QuotationWizard />
        </QuotationProvider>
      </main>
    </div>
  );
};

export default Index;
