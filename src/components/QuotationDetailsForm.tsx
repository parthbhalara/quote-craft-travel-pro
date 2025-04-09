
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useQuotation } from "@/context/QuotationContext";

const formSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  numberOfTravelers: z.coerce.number().min(1, "At least one traveler is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }).refine(
    (date) => date > new Date(),
    "End date must be in the future"
  ),
  travelLocations: z.string().min(3, "Travel locations are required"),
  budget: z.coerce.number().optional(),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

type FormValues = z.infer<typeof formSchema>;

const QuotationDetailsForm: React.FC = () => {
  const { createNewQuotation, currentQuotation, updateQuotationDetails, setCurrentStep } = useQuotation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: currentQuotation
      ? {
          customerName: currentQuotation.details.customerName,
          numberOfTravelers: currentQuotation.details.numberOfTravelers,
          startDate: currentQuotation.details.startDate,
          endDate: currentQuotation.details.endDate,
          travelLocations: currentQuotation.details.travelLocations,
          budget: currentQuotation.details.budget || undefined,
        }
      : {
          customerName: "",
          numberOfTravelers: 1,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          travelLocations: "",
          budget: undefined,
        },
  });

  const onSubmit = (values: FormValues) => {
    if (currentQuotation) {
      updateQuotationDetails(values);
      setCurrentStep("transport");
    } else {
      createNewQuotation(values);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
        <p className="text-gray-500 mt-1">
          Enter the basic information about the customer and their travel plans.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfTravelers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Travelers</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Number of travelers"
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
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
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

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
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
                        disabled={(date) =>
                          date < form.getValues("startDate")
                        }
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
            name="travelLocations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Travel Locations</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter travel destinations (e.g., Paris, Rome, Barcelona)"
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
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Customer budget (if known)"
                    {...field}
                    value={field.value || ""}
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

          <div className="flex justify-end">
            <Button type="submit" className="bg-travel-blue hover:bg-travel-blue-dark">
              {currentQuotation ? "Update Details" : "Create Quotation"} &rarr;
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuotationDetailsForm;
