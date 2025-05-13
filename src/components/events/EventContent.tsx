
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventData } from '@/services/eventService';

interface EventContentProps {
  event: EventData;
}

const EventContent: React.FC<EventContentProps> = ({ event }) => {
  return (
    <div className="container py-8">
      <Tabs defaultValue="details">
        <TabsList className="mb-8 animate-fade-in">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          {event.image_url && (
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full max-h-96 object-cover rounded-lg mb-6"
            />
          )}
          
          <div>
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="location">
          <div className="bg-secondary p-6 rounded-lg mb-6">
            <h3 className="font-bold mb-2">Location</h3>
            <p className="text-muted-foreground">{event.location}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventContent;
