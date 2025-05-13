
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { registerForFreeEvent } from '@/services/eventService';
import { toast } from 'sonner';

interface EventRegistrationHandlerProps {
  eventId: string;
  price: number;
  title: string;
  date: string;
  time: string;
  onOpenPaymentDialog: () => void;
}

const EventRegistrationHandler: React.FC<EventRegistrationHandlerProps> = ({
  eventId,
  price,
  title,
  date,
  time,
  onOpenPaymentDialog
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registering, setRegistering] = useState(false);
  
  const handleRegistration = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { 
        state: { 
          returnUrl: `/events/${eventId}`,
          message: "Please login to register for this event"
        }
      });
      return;
    }
    
    // If event is free, register directly
    if (price === 0) {
      setRegistering(true);
      try {
        const result = await registerForFreeEvent(eventId);
        if (result) {
          toast.success('Registration successful!');
          navigate(`/events/${eventId}/confirmation`, {
            state: {
              eventTitle: title,
              ticketCount: 1,
              totalAmount: 0,
              paymentMethod: 'free'
            }
          });
        }
      } catch (error) {
        console.error('Registration failed:', error);
        toast.error('Registration failed. Please try again.');
      } finally {
        setRegistering(false);
      }
    } else {
      // For paid events, open the payment dialog
      onOpenPaymentDialog();
    }
  };
  
  return (
    <Button 
      onClick={handleRegistration} 
      disabled={registering}
      className="w-full"
    >
      {registering ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering</>
      ) : price === 0 ? (
        'Register Now (Free)'
      ) : (
        'Register Now'
      )}
    </Button>
  );
};

export default EventRegistrationHandler;
