
import React from "react";
import { QuotationProvider } from "@/context/QuotationContext";
import QuotationWizard from "@/components/QuotationWizard";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Travel Quotation Pro</h1>
          <div className="text-sm">Travel Agent Dashboard</div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <QuotationProvider>
          <QuotationWizard />
          <Toaster />
        </QuotationProvider>
      </main>
    </div>
  );
};

export default Index;
