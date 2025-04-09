
import { z } from "zod";

// Schema for basic quotation details
export const quotationDetailsSchema = z.object({
  id: z.string(),
  customerName: z.string().min(2, "Customer name is required"),
  numberOfTravelers: z.number().min(1, "At least one traveler is required"),
  startDate: z.date(),
  endDate: z.date(),
  travelLocations: z.string().min(3, "Travel locations are required"),
  budget: z.number().optional(),
  createdAt: z.date(),
  status: z.enum(["draft", "sent", "accepted", "declined"])
});

// Schema for transport options
export const transportSchema = z.object({
  id: z.string(),
  from: z.string().min(1, "Origin is required"),
  to: z.string().min(1, "Destination is required"),
  mode: z.enum(["plane", "train", "bus"]),
  costPerTraveler: z.number().min(0, "Cost cannot be negative"),
  date: z.date().optional(),
  notes: z.string().optional()
});

// Schema for itinerary items
export const itineraryItemSchema = z.object({
  id: z.string(),
  date: z.date(),
  location: z.string().min(1, "Location is required"),
  activities: z.string().optional(),
  hotelName: z.string().optional(),
  hotelCost: z.number().min(0, "Hotel cost cannot be negative").optional(),
  localTravel: z.string().optional(),
  notes: z.string().optional()
});

// Schema for additional costs
export const additionalCostSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount cannot be negative"),
});

// Schema for service charges
export const serviceChargeSchema = z.object({
  type: z.enum(["fixed", "percentage"]),
  value: z.number().min(0, "Service charge cannot be negative"),
});

// Schema for the complete quotation
export const quotationSchema = z.object({
  details: quotationDetailsSchema,
  transportOptions: z.array(transportSchema),
  itineraryItems: z.array(itineraryItemSchema),
  additionalCosts: z.array(additionalCostSchema).optional(),
  serviceCharge: serviceChargeSchema.optional(),
});

// Exported types based on schemas
export type QuotationDetails = z.infer<typeof quotationDetailsSchema>;
export type Transport = z.infer<typeof transportSchema>;
export type ItineraryItem = z.infer<typeof itineraryItemSchema>;
export type AdditionalCost = z.infer<typeof additionalCostSchema>;
export type ServiceCharge = z.infer<typeof serviceChargeSchema>;
export type Quotation = z.infer<typeof quotationSchema>;

// Type for form steps
export type QuotationStep = "details" | "transport" | "itinerary" | "costs" | "summary" | "preview";
