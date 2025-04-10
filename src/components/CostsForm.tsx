import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuotation } from "@/context/QuotationContext";
import { useToast } from "@/hooks/use-toast";

const additionalCostSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
});

const serviceChargeSchema = z.object({
  type: z.enum(["fixed", "percentage"]),
  value: z.coerce.number().min(0, "Service charge cannot be negative"),
});

type AdditionalCostFormValues = z.infer<typeof additionalCostSchema>;
type ServiceChargeFormValues = z.infer<typeof serviceChargeSchema>;

const CostsForm: React.FC = () => {
  const { 
    currentQuotation, 
    addAdditionalCost, 
    updateAdditionalCost, 
    removeAdditionalCost, 
    setServiceCharge,
    calculateTotals,
    setCurrentStep,
  } = useQuotation();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const additionalCostForm = useForm<AdditionalCostFormValues>({
    resolver: zodResolver(additionalCostSchema),
    defaultValues: {
      description: "",
      amount: 0,
    },
  });

  const serviceChargeForm = useForm<ServiceChargeFormValues>({
    resolver: zodResolver(serviceChargeSchema),
    defaultValues: {
      type: currentQuotation?.serviceCharge?.type || "fixed",
      value: currentQuotation?.serviceCharge?.value || 0,
    },
  });

  const onSubmitAdditionalCost = (values: AdditionalCostFormValues) => {
    if (editingId) {
      updateAdditionalCost(editingId, values);
      toast({
        title: "Additional cost updated",
        description: `${values.description} has been updated.`,
      });
    } else {
      addAdditionalCost(values);
      toast({
        title: "Additional cost added",
        description: `${values.description} has been added.`,
      });
    }
    additionalCostForm.reset({
      description: "",
      amount: 0,
    });
    setEditingId(null);
  };

  const onSubmitServiceCharge = (values: ServiceChargeFormValues) => {
    setServiceCharge(values);
    toast({
      title: "Service charge updated",
      description: `Service charge set to ${values.type === "fixed" ? "₹" + values.value : values.value + "%"}.`,
    });
  };

  const handleEditAdditionalCost = (id: string) => {
    const cost = currentQuotation?.additionalCosts?.find((c) => c.id === id);
    if (cost) {
      additionalCostForm.reset({
        description: cost.description,
        amount: cost.amount,
      });
      setEditingId(id);
    }
  };

  const handleDeleteAdditionalCost = (id: string) => {
    removeAdditionalCost(id);
    toast({
      title: "Additional cost removed",
      description: "The additional cost has been removed.",
    });
  };

  const handleContinue = () => {
    setCurrentStep("summary");
  };

  const handleBack = () => {
    setCurrentStep("itinerary");
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Additional Costs & Service Charges</h2>
        <p className="text-gray-500 mt-1">
          Add any additional costs and specify your service charge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Additional Costs</h3>
            
            <Form {...additionalCostForm}>
              <form onSubmit={additionalCostForm.handleSubmit(onSubmitAdditionalCost)} className="space-y-4">
                <FormField
                  control={additionalCostForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Tour guide, Insurance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={additionalCostForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Cost amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-travel-teal hover:bg-travel-teal/90">
                    <Plus className="mr-2 h-4 w-4" />
                    {editingId ? "Update Cost" : "Add Cost"}
                  </Button>
                </div>
              </form>
            </Form>

            {(currentQuotation?.additionalCosts?.length || 0) > 0 ? (
              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Added Costs</h4>
                {currentQuotation?.additionalCosts?.map((cost) => (
                  <Card key={cost.id}>
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{cost.description}</p>
                        <p className="text-sm text-gray-500">₹{cost.amount.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAdditionalCost(cost.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAdditionalCost(cost.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="mt-4 p-4 bg-gray-50 rounded-md text-center text-sm text-gray-500">
                No additional costs added yet
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Service Charge</h3>
            
            <Form {...serviceChargeForm}>
              <form onSubmit={serviceChargeForm.handleSubmit(onSubmitServiceCharge)} className="space-y-4">
                <FormField
                  control={serviceChargeForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Charge Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="fixed" />
                            <Label htmlFor="fixed">Fixed Amount</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="percentage" id="percentage" />
                            <Label htmlFor="percentage">Percentage</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={serviceChargeForm.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {serviceChargeForm.watch("type") === "fixed" 
                          ? "Amount (₹)" 
                          : "Percentage (%)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={serviceChargeForm.watch("type") === "fixed"
                            ? "Service fee amount"
                            : "Service fee percentage"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="bg-travel-blue hover:bg-travel-blue-dark">
                    Apply Service Charge
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-base font-medium mb-3">Cost Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Transport:</span>
                  <span className="font-medium">₹{totals.transportTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Accommodation:</span>
                  <span className="font-medium">₹{totals.hotelTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Additional Costs:</span>
                  <span className="font-medium">₹{totals.additionalCostsTotal.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-sm">Subtotal:</span>
                  <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Service Charge {currentQuotation?.serviceCharge?.type === "percentage" && 
                    `(${currentQuotation.serviceCharge.value}%)`
                  }:</span>
                  <span className="font-medium">₹{totals.serviceChargeAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          &larr; Back
        </Button>
        <Button 
          onClick={handleContinue} 
          className="bg-travel-blue hover:bg-travel-blue-dark"
        >
          Continue to Summary &rarr;
        </Button>
      </div>
    </div>
  );
};

export default CostsForm;
