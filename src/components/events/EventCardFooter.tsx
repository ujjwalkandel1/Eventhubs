
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { formatNepaliCurrency } from '@/services/paymentService';
import { ArrowRight } from 'lucide-react';

interface EventCardFooterProps {
  priceValue: number;
  displayPrice: number;
}

const EventCardFooter: React.FC<EventCardFooterProps> = ({
  priceValue,
  displayPrice,
}) => {
  // Ensure price is within 500-5000 range
  const validatedPrice = priceValue === 0 ? 0 : 
    Math.max(500, Math.min(displayPrice, 5000));

  return (
    <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
      <span className="font-semibold">
        {priceValue === 0 ? 'Free' : formatNepaliCurrency(validatedPrice)}
      </span>
      <span className="text-xs px-3 py-1 rounded-full bg-event-light text-event-dark flex items-center">
        View Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
      </span>
    </CardFooter>
  );
};

export default EventCardFooter;
