
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, isPast, isFuture } from 'date-fns';
import { Card } from '@/components/ui/card';
import { EventData } from '@/services/eventService';
import EventCardImage from './EventCardImage';
import EventCardContent from './EventCardContent';
import EventCardFooter from './EventCardFooter';
import { getEventImageUrl, prepareEventPrice } from './EventCardUtils';

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const eventDate = new Date(event.date + 'T' + event.time);
  const timeUntilEvent = formatDistanceToNow(eventDate, { addSuffix: true });
  const isPastEvent = isPast(eventDate);
  const isUpcomingSoon = isFuture(eventDate) && ((eventDate.getTime() - new Date().getTime()) < (30 * 24 * 60 * 60 * 1000)); // Within 30 days
  const availableSpots = (event.capacity || 100) - (event.attendees || 0);
  
  // Get image based on category or use the event's image if provided
  const imageUrl = getEventImageUrl(event.image_url, event.category);
  
  // Process price data for display
  const { priceValue, displayPrice } = prepareEventPrice(event.price);
  
  return (
    <Link to={`/events/${event.id}`}>
      <Card className="event-card h-full flex flex-col">
        <EventCardImage 
          imageUrl={imageUrl}
          category={event.category}
          title={event.title}
          isUpcomingSoon={isUpcomingSoon}
          isPastEvent={isPastEvent}
          availableSpots={availableSpots}
        />
        
        <EventCardContent
          title={event.title}
          location={event.location}
          attendees={event.attendees || 0}
          timeUntilEvent={timeUntilEvent}
        />
        
        <EventCardFooter
          priceValue={priceValue}
          displayPrice={displayPrice}
        />
      </Card>
    </Link>
  );
};

export default EventCard;
