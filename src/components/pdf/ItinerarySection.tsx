
import React from "react";
import { format } from "date-fns";
import { ItineraryItem } from "@/types";

interface ItinerarySectionProps {
  itineraryItems: ItineraryItem[];
  hotelTotal: number;
}

const ItinerarySection: React.FC<ItinerarySectionProps> = ({ itineraryItems, hotelTotal }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-travel-blue">Daily Itinerary</h2>
      <div className="space-y-6">
        {itineraryItems
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-travel-blue">
                Day {index + 1} - {format(item.date, "EEEE, MMMM d")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-700">{item.location}</p>
                  
                  {item.activities && (
                    <div className="mt-3">
                      <p className="font-medium">Activities</p>
                      <p className="text-gray-700">{item.activities}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  {item.hotelName && (
                    <div>
                      <p className="font-medium">Accommodation</p>
                      <p className="text-gray-700">{item.hotelName}</p>
                      {item.hotelCost && (
                        <p className="text-gray-700 font-medium">
                          €{item.hotelCost.toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {item.localTravel && (
                    <div className="mt-3">
                      <p className="font-medium">Local Travel</p>
                      <p className="text-gray-700">{item.localTravel}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {item.notes && (
                <div className="mt-3">
                  <p className="font-medium">Notes</p>
                  <p className="text-gray-700">{item.notes}</p>
                </div>
              )}
            </div>
          ))}
        
        <div className="text-right font-medium pt-2">
          Accommodation Subtotal: <span className="font-bold">€{hotelTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySection;
