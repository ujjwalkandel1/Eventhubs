
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { EventData } from '@/services/eventService';
import { format } from 'date-fns';

interface EventHeaderProps {
  event: EventData;
  formattedDate: string;
  formattedTime: string;
  isOwner: boolean;
  onDeleteClick: () => void;
}

const EventHeader: React.FC<EventHeaderProps> = ({ 
  event, 
  formattedDate, 
  formattedTime, 
  isOwner,
  onDeleteClick
}) => {
  return (
    <div className="bg-gradient-to-r from-event/20 to-secondary p-6 sm:p-8 md:p-12 animate-fade-in">
      <div className="container">
        <Link 
          to="/events" 
          className="inline-flex items-center text-sm font-medium mb-6 hover:text-primary transition-all duration-300 hover:-translate-x-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Events
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate-slide-in-left">
            <Badge className="mb-4 bg-event text-white">
              {event.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 transform transition-transform hover:scale-[1.02]">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {[
                { Icon: Calendar, text: formattedDate },
                { Icon: Clock, text: formattedTime },
                { Icon: MapPin, text: event.location },
                { Icon: Users, text: `${event.attendees} attending` }
              ].map(({ Icon, text }, index) => (
                <div 
                  key={text} 
                  className={`flex items-center text-sm animate-fade-in-delayed`} 
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            
            {isOwner && (
              <div className="flex gap-2 mb-6">
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/events/${event.id}/edit`} className="flex items-center">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Event
                  </Link>
                </Button>
                <Button size="sm" variant="destructive" onClick={onDeleteClick}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Event
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
