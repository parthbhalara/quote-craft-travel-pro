import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, eachDayOfInterval } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils";
import { useQuotation } from "@/context/QuotationContext";
import { useToast } from "@/hooks/use-toast";

const itinerarySchema = z.object({
  date: z.date(),
  location: z.string().min(1, "Location is required"),
  activities: z.string().optional(),
  hotelName: z.string().optional(),
  hotelCost: z.coerce.number().min(0, "Hotel cost cannot be negative").optional(),
  localTravel: z.string().optional(),
  notes: z.string().optional(),
});

type ItineraryFormValues = z.infer<typeof itinerarySchema>;

const ItineraryForm: React.FC = () => {
  const { 
    currentQuotation, 
    addItineraryItem, 
    updateItineraryItem, 
    removeItineraryItem, 
    setCurrentStep,
  } = useQuotation();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const dateRange = useMemo(() => {
    if (!currentQuotation) return [];
    
    return eachDayOfInterval({
      start: currentQuotation.details.startDate,
      end: currentQuotation.details.endDate,
    });
  }, [currentQuotation]);
  
  const [activeDate, setActiveDate] = useState<Date | null>(
    dateRange.length > 0 ? dateRange[0] : null
  );

  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: {
      date: activeDate || new Date(),
      location: "",
      activities: "",
      hotelName: "",
      hotelCost: undefined,
      localTravel: "",
      notes: "",
    },
  });
  
  // When activeDate changes, update the form's date field
  React.useEffect(() => {
    if (activeDate) {
      form.setValue("date", activeDate);
    }
  }, [activeDate, form]);

  const onSubmit = (values: ItineraryFormValues) => {
    if (editingId) {
      updateItineraryItem(editingId, values);
      toast({
        title: "Itinerary updated",
        description: `Itinerary for ${format(values.date, "PP")} has been updated.`,
      });
    } else {
      addItineraryItem(values);
      toast({
        title: "Itinerary added",
        description: `Itinerary for ${format(values.date, "PP")} has been added.`,
      });
    }
    
    form.reset({
      date: activeDate || new Date(),
      location: "",
      activities: "",
      hotelName: "",
      hotelCost: undefined,
      localTravel: "",
      notes: "",
    });
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const item = currentQuotation?.itineraryItems.find((i) => i.id === id);
    if (item) {
      setActiveDate(item.date);
      form.reset({
        date: item.date,
        location: item.location,
        activities: item.activities,
        hotelName: item.hotelName,
        hotelCost: item.hotelCost,
        localTravel: item.localTravel,
        notes: item.notes,
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    removeItineraryItem(id);
    toast({
      title: "Itinerary removed",
      description: "The itinerary item has been removed.",
    });
  };

  const handleContinue = () => {
    if (currentQuotation?.itineraryItems.length === 0) {
      toast({
        title: "No itinerary items added",
        description: "Please add at least one itinerary item before continuing.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep("costs");
  };

  const handleBack = () => {
    setCurrentStep("transport");
  };

  // Get itinerary items for the active date
  const activeDateItems = useMemo(() => {
    if (!currentQuotation || !activeDate) return [];
    
    return currentQuotation.itineraryItems.filter(
      (item) => format(item.date, "yyyy-MM-dd") === format(activeDate, "yyyy-MM-dd")
    );
  }, [currentQuotation, activeDate]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Daily Itinerary</h2>
        <p className="text-gray-500 mt-1">
          Create a day-by-day plan for the trip including accommodations and activities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-lg font-medium mb-4">Travel Dates</h3>
            <div className="flex flex-col space-y-2">
              {dateRange.map((date) => {
                // Check if we have items for this date
                const hasItems = currentQuotation?.itineraryItems.some(
                  (item) => format(item.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                );
                
                return (
                  <Button
                    key={date.toISOString()}
                    variant={activeDate && format(activeDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") ? "default" : "outline"}
                    className={cn(
                      "justify-start",
                      hasItems && "border-travel-teal text-travel-teal hover:text-travel-teal"
                    )}
                    onClick={() => setActiveDate(date)}
                  >
                    {format(date, "EEE, MMM d")}
                    {hasItems && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-travel-teal-light text-travel-teal rounded-full">
                        Planned
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="add">Add Itinerary</TabsTrigger>
              <TabsTrigger value="view">View Items ({activeDateItems.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="mt-0">
              {activeDate && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <p className="text-sm font-medium">
                        Adding itinerary for:{" "}
                        <span className="text-travel-blue font-semibold">
                          {format(activeDate, "EEEE, MMMM d, yyyy")}
                        </span>
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City or specific location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="hotelName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hotel Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Accommodation name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="hotelCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hotel Cost (₹) (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Cost per night"
                                {...field}
                                value={field.value === undefined ? "" : field.value}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? undefined : parseFloat(value));
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="activities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Planned Activities (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description of planned activities"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="localTravel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Local Travel (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Local transport details"
                              className="resize-none h-20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any other details for this day"
                              className="resize-none h-20"
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
                        {editingId ? "Update Itinerary" : "Add to Itinerary"}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </TabsContent>
            
            <TabsContent value="view" className="mt-0">
              {activeDateItems.length > 0 ? (
                <div className="space-y-4">
                  {activeDateItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{item.location}</h4>
                            {item.hotelName && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Accommodation</p>
                                <p className="text-sm">{item.hotelName} {item.hotelCost && `- ₹${item.hotelCost}`}</p>
                              </div>
                            )}
                            {item.activities && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Activities</p>
                                <p className="text-sm">{item.activities}</p>
                              </div>
                            )}
                            {item.localTravel && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Local Travel</p>
                                <p className="text-sm">{item.localTravel}</p>
                              </div>
                            )}
                            {item.notes && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Notes</p>
                                <p className="text-sm">{item.notes}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-md bg-gray-50 p-6 text-center">
                  <h3 className="text-sm font-medium text-gray-900">No itinerary items for this date</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Select "Add Itinerary" to create activities for {format(activeDate || new Date(), "MMMM d, yyyy")}.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
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
          Continue &rarr;
        </Button>
      </div>
    </div>
  );
};

export default ItineraryForm;
