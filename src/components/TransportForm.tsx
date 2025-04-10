import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plane, Train, Bus, Plus, X } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuotation } from "@/context/QuotationContext";
import { useToast } from "@/hooks/use-toast";

const transportSchema = z.object({
  from: z.string().min(1, "Origin is required"),
  to: z.string().min(1, "Destination is required"),
  mode: z.enum(["plane", "train", "bus"]),
  costPerTraveler: z.coerce.number().min(0, "Cost cannot be negative"),
  date: z.date().optional(),
  notes: z.string().optional(),
});

type TransportFormValues = z.infer<typeof transportSchema>;

const TransportForm: React.FC = () => {
  const { 
    currentQuotation, 
    addTransport, 
    updateTransport, 
    removeTransport, 
    setCurrentStep,
  } = useQuotation();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<TransportFormValues>({
    resolver: zodResolver(transportSchema),
    defaultValues: {
      from: "",
      to: "",
      mode: "plane",
      costPerTraveler: 0,
      notes: "",
    },
  });

  const onSubmit = (values: TransportFormValues) => {
    if (editingId) {
      updateTransport(editingId, values);
      toast({
        title: "Transport updated",
        description: `Transport from ${values.from} to ${values.to} has been updated.`,
      });
    } else {
      addTransport(values);
      toast({
        title: "Transport added",
        description: `Transport from ${values.from} to ${values.to} has been added.`,
      });
    }
    form.reset({
      from: "",
      to: "",
      mode: "plane",
      costPerTraveler: 0,
      date: undefined,
      notes: "",
    });
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const transport = currentQuotation?.transportOptions.find(
      (t) => t.id === id
    );
    if (transport) {
      form.reset({
        from: transport.from,
        to: transport.to,
        mode: transport.mode,
        costPerTraveler: transport.costPerTraveler,
        date: transport.date,
        notes: transport.notes,
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    removeTransport(id);
    toast({
      title: "Transport removed",
      description: "The transport option has been removed.",
    });
  };

  const handleContinue = () => {
    if (currentQuotation?.transportOptions.length === 0) {
      toast({
        title: "No transport options added",
        description: "Please add at least one transport option before continuing.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep("itinerary");
  };

  const handleBack = () => {
    setCurrentStep("details");
  };

  const transportModeIcons = {
    plane: <Plane className="h-5 w-5" />,
    train: <Train className="h-5 w-5" />,
    bus: <Bus className="h-5 w-5" />,
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Transport Options</h2>
        <p className="text-gray-500 mt-1">
          Add transportation details for each leg of the journey.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <Input placeholder="Origin location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder="Destination location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mode of Transport</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="plane">
                        <div className="flex items-center">
                          <Plane className="h-4 w-4 mr-2" />
                          <span>Plane</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="train">
                        <div className="flex items-center">
                          <Train className="h-4 w-4 mr-2" />
                          <span>Train</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bus">
                        <div className="flex items-center">
                          <Bus className="h-4 w-4 mr-2" />
                          <span>Bus</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costPerTraveler"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Per Traveler (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Cost per person"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about this transport"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="bg-travel-teal hover:bg-travel-teal/90">
              <Plus className="mr-2 h-4 w-4" />
              {editingId ? "Update Transport" : "Add Transport"}
            </Button>
          </div>
        </form>
      </Form>

      {currentQuotation?.transportOptions.length ? (
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold">Added Transport Options</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentQuotation.transportOptions.map((transport) => (
              <Card key={transport.id} className="overflow-hidden">
                <div className={cn("p-2 flex items-center gap-2", 
                  transport.mode === "plane" ? "bg-sky-100" :
                  transport.mode === "train" ? "bg-emerald-100" :
                  "bg-amber-100"
                )}>
                  {transportModeIcons[transport.mode]}
                  <span className="font-medium capitalize">{transport.mode}</span>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        {transport.from} &rarr; {transport.to}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {transport.date ? format(transport.date, "PP") : "No date specified"}
                      </p>
                      <p className="mt-2 font-medium">
                        ₹{transport.costPerTraveler} per traveler
                      </p>
                      {transport.notes && (
                        <p className="mt-1 text-sm text-gray-600">{transport.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(transport.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(transport.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-md bg-amber-50 p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">No transport options added yet</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>Add at least one transport option before proceeding.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBack}>
          &larr; Back
        </Button>
        <Button 
          onClick={handleContinue} 
          className="bg-travel-blue hover:bg-travel-blue-dark"
        >
          Continue &rarr;
        </Button>
      </div>
    </div>
  );
};

export default TransportForm;
