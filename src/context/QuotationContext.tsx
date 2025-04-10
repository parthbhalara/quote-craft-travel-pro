import { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Quotation,
  QuotationDetails,
  Transport,
  ItineraryItem,
  AdditionalCost,
  ServiceCharge,
  QuotationStep,
} from "@/types";

interface QuotationContextType {
  quotations: Quotation[];
  currentQuotation: Quotation | null;
  currentStep: QuotationStep;
  setCurrentStep: (step: QuotationStep) => void;
  createNewQuotation: (details: Omit<QuotationDetails, "id" | "createdAt" | "status">) => void;
  updateQuotationDetails: (details: Partial<QuotationDetails>) => void;
  addTransport: (transport: Omit<Transport, "id">) => void;
  updateTransport: (id: string, transport: Partial<Transport>) => void;
  removeTransport: (id: string) => void;
  addItineraryItem: (item: Omit<ItineraryItem, "id">) => void;
  updateItineraryItem: (id: string, item: Partial<ItineraryItem>) => void;
  removeItineraryItem: (id: string) => void;
  addAdditionalCost: (cost: Omit<AdditionalCost, "id">) => void;
  updateAdditionalCost: (id: string, cost: Partial<AdditionalCost>) => void;
  removeAdditionalCost: (id: string) => void;
  setServiceCharge: (serviceCharge: ServiceCharge) => void;
  saveQuotation: () => void;
  duplicateQuotation: (id: string) => void;
  editQuotation: (id: string) => void;
  deleteQuotation: (id: string) => void;
  calculateTotals: () => {
    transportTotal: number;
    hotelTotal: number;
    additionalCostsTotal: number;
    subtotal: number;
    serviceChargeAmount: number;
    grandTotal: number;
  };
  resetCurrentQuotation: () => void;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export const QuotationProvider = ({ children }: { children: ReactNode }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | null>(null);
  const [currentStep, setCurrentStep] = useState<QuotationStep>("details");

  // Create a new quotation
  const createNewQuotation = (details: Omit<QuotationDetails, "id" | "createdAt" | "status">) => {
    console.log("Creating new quotation with details:", details);
    const newQuotation: Quotation = {
      details: {
        ...details,
        id: uuidv4(),
        createdAt: new Date(),
        status: "draft",
      },
      transportOptions: [],
      itineraryItems: [],
      additionalCosts: [],
    };
    setCurrentQuotation(newQuotation);
    setCurrentStep("transport");
    console.log("New quotation created:", newQuotation);
  };

  // Update the details of the current quotation
  const updateQuotationDetails = (details: Partial<QuotationDetails>) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      details: {
        ...currentQuotation.details,
        ...details,
      },
    });
  };

  // Add a transport option
  const addTransport = (transport: Omit<Transport, "id">) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      transportOptions: [
        ...currentQuotation.transportOptions,
        { ...transport, id: uuidv4() },
      ],
    });
  };

  // Update a transport option
  const updateTransport = (id: string, transport: Partial<Transport>) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      transportOptions: currentQuotation.transportOptions.map((item) =>
        item.id === id ? { ...item, ...transport } : item
      ),
    });
  };

  // Remove a transport option
  const removeTransport = (id: string) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      transportOptions: currentQuotation.transportOptions.filter(
        (item) => item.id !== id
      ),
    });
  };

  // Add an itinerary item
  const addItineraryItem = (item: Omit<ItineraryItem, "id">) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      itineraryItems: [
        ...currentQuotation.itineraryItems,
        { ...item, id: uuidv4() },
      ],
    });
  };

  // Update an itinerary item
  const updateItineraryItem = (id: string, item: Partial<ItineraryItem>) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      itineraryItems: currentQuotation.itineraryItems.map((currentItem) =>
        currentItem.id === id ? { ...currentItem, ...item } : currentItem
      ),
    });
  };

  // Remove an itinerary item
  const removeItineraryItem = (id: string) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      itineraryItems: currentQuotation.itineraryItems.filter(
        (item) => item.id !== id
      ),
    });
  };

  // Add an additional cost
  const addAdditionalCost = (cost: Omit<AdditionalCost, "id">) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      additionalCosts: [
        ...(currentQuotation.additionalCosts || []),
        { ...cost, id: uuidv4() },
      ],
    });
  };

  // Update an additional cost
  const updateAdditionalCost = (id: string, cost: Partial<AdditionalCost>) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      additionalCosts: (currentQuotation.additionalCosts || []).map(
        (item) => (item.id === id ? { ...item, ...cost } : item)
      ),
    });
  };

  // Remove an additional cost
  const removeAdditionalCost = (id: string) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      additionalCosts: (currentQuotation.additionalCosts || []).filter(
        (item) => item.id !== id
      ),
    });
  };

  // Set service charge
  const setServiceCharge = (serviceCharge: ServiceCharge) => {
    if (!currentQuotation) return;
    setCurrentQuotation({
      ...currentQuotation,
      serviceCharge,
    });
  };

  // Save the current quotation
  const saveQuotation = () => {
    if (!currentQuotation) return;
    
    const existingIndex = quotations.findIndex(
      (q) => q.details.id === currentQuotation.details.id
    );
    
    if (existingIndex !== -1) {
      // Update existing quotation
      const updatedQuotations = [...quotations];
      updatedQuotations[existingIndex] = currentQuotation;
      setQuotations(updatedQuotations);
    } else {
      // Add new quotation
      setQuotations([...quotations, currentQuotation]);
    }
  };

  // Duplicate a quotation
  const duplicateQuotation = (id: string) => {
    const quotationToDuplicate = quotations.find((q) => q.details.id === id);
    if (!quotationToDuplicate) return;

    const duplicatedDetails = {
      ...quotationToDuplicate.details,
      id: uuidv4(),
      customerName: `${quotationToDuplicate.details.customerName} (Copy)`,
      createdAt: new Date(),
      status: "draft" as const,
    };

    const duplicatedQuotation = {
      ...quotationToDuplicate,
      details: duplicatedDetails,
    };

    setQuotations([...quotations, duplicatedQuotation]);
  };

  // Edit a quotation
  const editQuotation = (id: string) => {
    const quotationToEdit = quotations.find((q) => q.details.id === id);
    if (!quotationToEdit) return;
    setCurrentQuotation(quotationToEdit);
    setCurrentStep("details");
  };

  // Delete a quotation
  const deleteQuotation = (id: string) => {
    setQuotations(quotations.filter((q) => q.details.id !== id));
    if (currentQuotation?.details.id === id) {
      setCurrentQuotation(null);
    }
  };

  // Calculate totals for the quotation
  const calculateTotals = () => {
    if (!currentQuotation) {
      return {
        transportTotal: 0,
        hotelTotal: 0,
        additionalCostsTotal: 0,
        subtotal: 0,
        serviceChargeAmount: 0,
        grandTotal: 0,
      };
    }

    const { numberOfTravelers } = currentQuotation.details;

    // Calculate transport total
    const transportTotal = currentQuotation.transportOptions.reduce(
      (total, option) => total + option.costPerTraveler * numberOfTravelers,
      0
    );

    // Calculate hotel total
    const hotelTotal = currentQuotation.itineraryItems.reduce(
      (total, item) => total + (item.hotelCost || 0),
      0
    );

    // Calculate additional costs total
    const additionalCostsTotal = (currentQuotation.additionalCosts || []).reduce(
      (total, cost) => total + cost.amount,
      0
    );

    const subtotal = transportTotal + hotelTotal + additionalCostsTotal;

    // Calculate service charge
    let serviceChargeAmount = 0;
    if (currentQuotation.serviceCharge) {
      const { type, value } = currentQuotation.serviceCharge;
      serviceChargeAmount = type === "fixed" 
        ? value 
        : (subtotal * value) / 100;
    }

    const grandTotal = subtotal + serviceChargeAmount;

    return {
      transportTotal,
      hotelTotal,
      additionalCostsTotal,
      subtotal,
      serviceChargeAmount,
      grandTotal,
    };
  };

  // Reset current quotation
  const resetCurrentQuotation = () => {
    console.log("Resetting current quotation");
    setCurrentQuotation(null);
  };

  const value: QuotationContextType = {
    quotations,
    currentQuotation,
    currentStep,
    setCurrentStep,
    createNewQuotation,
    updateQuotationDetails,
    addTransport,
    updateTransport,
    removeTransport,
    addItineraryItem,
    updateItineraryItem,
    removeItineraryItem,
    addAdditionalCost,
    updateAdditionalCost,
    removeAdditionalCost,
    setServiceCharge,
    saveQuotation,
    duplicateQuotation,
    editQuotation,
    deleteQuotation,
    calculateTotals,
    resetCurrentQuotation,
  };

  return (
    <QuotationContext.Provider value={value}>
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotation = () => {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error("useQuotation must be used within a QuotationProvider");
  }
  return context;
};
