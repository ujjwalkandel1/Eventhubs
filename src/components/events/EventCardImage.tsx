
import React from 'react';
import { ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventCardImageProps {
  imageUrl: string | null;
  category: string;
  title: string;
  isUpcomingSoon: boolean;
  isPastEvent: boolean;
  availableSpots: number;
}

const EventCardImage: React.FC<EventCardImageProps> = ({
  imageUrl,
  category,
  title,
  isUpcomingSoon,
  isPastEvent,
  availableSpots,
}) => {
  return (
    <div className="relative">
      <div className="w-full aspect-video overflow-hidden bg-muted">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>
      
      <Badge className="absolute top-3 right-3 bg-event text-white">
        {category}
      </Badge>
      
      {isUpcomingSoon && (
        <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
          Coming Soon
        </Badge>
      )}
      
      {isPastEvent && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
          <Badge className="bg-black/80 text-white text-lg px-4 py-2">Past Event</Badge>
        </div>
      )}
      
      {!isPastEvent && availableSpots < 20 && (
        <div className="absolute bottom-0 left-0 right-0 bg-destructive/80 text-white text-center py-1 text-sm font-medium">
          Only {availableSpots} spots left!
        </div>
      )}
    </div>
  );
};

export default EventCardImage;
