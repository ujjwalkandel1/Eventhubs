
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { formatNepaliCurrency } from '@/services/paymentService';

interface EventRegistrationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  formattedDate: string;
  formattedTime: string;
  ticketCount: number;
  displayPrice: number;
  onProceedToPayment: () => void;
}

const EventRegistrationDialog: React.FC<EventRegistrationDialogProps> = ({
  isOpen,
  onOpenChange,
  eventTitle,
  formattedDate,
  formattedTime,
  ticketCount,
  displayPrice,
  onProceedToPayment
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Registration</DialogTitle>
          <DialogDescription>
            You're about to register for {ticketCount} ticket{ticketCount > 1 ? 's' : ''} to {eventTitle}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between mb-2 text-sm">
            <span>Event:</span>
            <span className="font-medium">{eventTitle}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Date & Time:</span>
            <span>{formattedDate} at {formattedTime}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm">
            <span>Tickets:</span>
            <span>{ticketCount}</span>
          </div>
          <div className="flex justify-between mb-2 text-sm font-bold">
            <span>Total Amount:</span>
            <span>{formatNepaliCurrency(displayPrice * ticketCount * 1.1)}</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onProceedToPayment}>Proceed to Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationDialog;
