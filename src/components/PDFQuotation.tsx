
import React, { useRef } from "react";
import { format } from "date-fns";
import { usePDF } from "react-to-pdf";
import { Download, Printer, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useQuotation } from "@/context/QuotationContext";
import { useToast } from "@/hooks/use-toast";
import QuotationDocument from "./pdf/QuotationDocument";

const PDFQuotation: React.FC = () => {
  const { currentQuotation, calculateTotals, setCurrentStep } = useQuotation();
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);
  const { toPDF } = usePDF({
    filename: currentQuotation 
      ? `Travel_Quotation_${currentQuotation.details.customerName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
      : 'Travel_Quotation.pdf',
  });

  if (!currentQuotation) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quotation Found</h2>
        <p className="text-gray-500">Please create a new quotation first.</p>
        <Button className="mt-4" onClick={() => setCurrentStep("details")}>
          Start New Quotation
        </Button>
      </div>
    );
  }

  const totals = calculateTotals();

  const handleDownloadPDF = () => {
    toPDF();
    
    toast({
      title: "PDF Generated",
      description: "Your quotation PDF has been generated successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    setCurrentStep("summary");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quotation Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> Print
          </Button>
          <Button className="bg-travel-blue hover:bg-travel-blue-dark" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-1" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-8 shadow-sm" ref={pdfRef}>
        <QuotationDocument quotation={currentQuotation} totals={totals} />
      </div>
    </div>
  );
};

export default PDFQuotation;
