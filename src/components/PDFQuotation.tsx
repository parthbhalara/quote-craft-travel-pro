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
  
  // Configure PDF options
  const { toPDF, targetRef } = usePDF({
    filename: currentQuotation 
      ? `Travel_Quotation_${currentQuotation.details.customerName.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
      : 'Travel_Quotation.pdf',
    method: 'save',
    page: { 
      margin: 20,
      format: 'a4',
      orientation: 'portrait'
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: true
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  });

  if (!currentQuotation) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quotation Found</h2>
        <p className="text-gray-500 mb-4">Please create a new quotation first.</p>
        <Button className="mt-4" onClick={() => setCurrentStep("details")}>
          Start New Quotation
        </Button>
      </div>
    );
  }

  const totals = calculateTotals();

  const handleDownloadPDF = async () => {
    try {
      await toPDF();
      toast({
        title: "PDF Generated",
        description: "Your quotation PDF has been generated successfully.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
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
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-1" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-8 shadow-sm" ref={targetRef}>
        <QuotationDocument quotation={currentQuotation} totals={totals} />
      </div>
    </div>
  );
};

export default PDFQuotation;
