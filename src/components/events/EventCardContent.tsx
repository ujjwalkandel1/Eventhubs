
import React from 'react';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { CardContent } from '@/components/ui/card';

interface EventCardContentProps {
  title: string;
  location: string;
  attendees: number;
  timeUntilEvent: string;
}

const EventCardContent: React.FC<EventCardContentProps> = ({
  title,
  location,
  attendees,
  timeUntilEvent,
}) => {
  return (
    <CardContent className="flex-grow p-4">
      <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
        <CalendarDays className="h-3.5 w-3.5 mr-1" />
        <span>{timeUntilEvent}</span>
      </div>
      
      <h3 className="font-semibold text-lg line-clamp-2 mb-2">
        {title}
      </h3>
      
      <div className="flex items-center text-sm text-muted-foreground mb-2">
        <MapPin className="h-3.5 w-3.5 mr-1.5" />
        <span className="truncate">{location}</span>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground">
        <Users className="h-3.5 w-3.5 mr-1.5" />
        <span>{attendees || 0} attending</span>
      </div>
    </CardContent>
  );
};

export default EventCardContent;
