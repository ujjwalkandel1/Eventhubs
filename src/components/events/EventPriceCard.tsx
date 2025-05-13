
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNepaliCurrency } from '@/services/paymentService';
import { Calendar, Clock } from 'lucide-react';
import EventRegistrationDialog from './EventRegistrationDialog';
import EventRegistrationHandler from './EventRegistrationHandler';

interface EventPriceCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  price: string | number;
  availableSpots?: number;
  ticketCount?: number;
  onIncreaseTickets?: () => void;
  onDecreaseTickets?: () => void;
  onRegisterClick?: () => void;
  onShareClick?: () => Promise<void>;
}

const EventPriceCard: React.FC<EventPriceCardProps> = ({ 
  id, 
  title, 
  date, 
  time, 
  price, 
  availableSpots,
  ticketCount = 1,
  onIncreaseTickets,
  onDecreaseTickets,
  onRegisterClick,
  onShareClick
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const displayPrice = typeof price === 'string' ? parseFloat(price) : price;
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = new Date(date + 'T' + time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
        <CardDescription>
          {displayPrice === 0 ? 'Free Event' : formatNepaliCurrency(displayPrice)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>{formattedTime}</span>
        </div>
        
        <EventRegistrationHandler
          eventId={id}
          price={displayPrice}
          title={title}
          date={date}
          time={time}
          onOpenPaymentDialog={() => setIsDialogOpen(true)}
        />
      </CardContent>

      <EventRegistrationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        eventTitle={title}
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        ticketCount={ticketCount}
        displayPrice={displayPrice}
        onProceedToPayment={onRegisterClick || (() => {})}
      />
    </Card>
  );
};

export default EventPriceCard;
