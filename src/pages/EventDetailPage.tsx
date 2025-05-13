import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventById, deleteEvent, fixEventPricing } from '@/services/eventService';
import { initiateNepaliPayment } from '@/services/paymentService';

// Imported components
import EventHeader from '@/components/events/EventHeader';
import EventPriceCard from '@/components/events/EventPriceCard';
import EventContent from '@/components/events/EventContent';
import EventRegistrationDialog from '@/components/events/EventRegistrationDialog';
import PaymentDialog from '@/components/events/PaymentDialog';
import DeleteEventDialog from '@/components/events/DeleteEventDialog';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [ticketCount, setTicketCount] = useState(1);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('esewa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Run this once when component mounts to fix any outdated pricing
  useEffect(() => {
    const runPriceFix = async () => {
      try {
        await fixEventPricing();
      } catch (error) {
        console.error("Error fixing event pricing:", error);
      }
    };
    
    runPriceFix();
  }, []);
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id!),
    enabled: !!id
  });
  
  const deleteMutation = useMutation({
    mutationFn: () => deleteEvent(id!),
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    },
    onError: (error) => {
      toast.error('Failed to delete event', {
        description: error.message
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="container py-12 text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  
  const eventDate = new Date(event.date + 'T' + event.time);
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');
  
  // Apply price range validation (500-5000)
  let priceValue = typeof event.price === 'string' ? parseFloat(event.price) : (event.price || 0);
  
  // If price is outside valid range and not free, adjust for display
  if (priceValue !== 0 && (priceValue < 500 || priceValue > 5000)) {
    // Legacy data adjustment - clamp to valid range
    priceValue = Math.max(500, Math.min(priceValue, 5000));
  }
  
  // Use priceValue directly without additional display adjustment
  const displayPrice = priceValue;
  
  const availableSpots = (event.capacity || 100) - (event.attendees || 0);
  const isOwner = user && event.user_id === user.id;
  
  const increaseTicketCount = () => {
    if (ticketCount < 10) {
      setTicketCount(ticketCount + 1);
    }
  };
  
  const decreaseTicketCount = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };
  
  
  const handleRegisterClick = () => {
    if (!user) {
      toast('Login Required', {
        description: "Please login to register for this event"
      });
      navigate("/login", { state: { returnUrl: `/events/${id}` } });
      return;
    }
    
    setIsRegisterDialogOpen(true);
  };
  
  const handleConfirmRegistration = () => {
    setIsRegisterDialogOpen(false);
    setIsPaymentDialogOpen(true);
  };
  
  const handlePayment = async () => {
    if (!user || !id) return;
    
    // Validate phone number for Nepali payment methods
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Display price is higher for better Nepali currency standards
      const totalAmount = displayPrice * ticketCount * 1.1;
      
      await initiateNepaliPayment({
        eventId: id,
        userId: user.id,
        amount: totalAmount,
        tickets: ticketCount,
        paymentMethod: selectedPaymentMethod as any,
        phoneNumber
      });
      
      // Close dialogs after successful payment initiation
      setIsPaymentDialogOpen(false);
      setIsProcessingPayment(false);
      
      // Navigate to a confirmation or success page
      navigate(`/events/${id}/confirmation`, { 
        state: { 
          eventTitle: event.title,
          ticketCount,
          totalAmount,
          paymentMethod: selectedPaymentMethod 
        } 
      });
    } catch (error) {
      setIsProcessingPayment(false);
      console.error('Payment error:', error);
    }
  };
  
  const handleShareEvent = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link Copied!', {
          description: "Event link copied to clipboard"
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };
  
  const handleDeleteEvent = () => {
    deleteMutation.mutate();
  };
  
  return (
    <main className="pb-16">
      {/* Event Header Section */}
      <EventHeader 
        event={event}
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        isOwner={isOwner}
        onDeleteClick={() => setIsDeleteAlertOpen(true)}
      />
      
      <div className="container flex justify-end">
        {/* Price Card */}
        <div className="lg:w-1/3">
          <EventPriceCard
            id={id!}
            title={event.title}
            date={event.date}
            time={event.time}
            price={displayPrice}
          />
        </div>
      </div>
      
      {/* Event Content Section */}
      <EventContent event={event} />
      
      {/* Registration Dialog */}
      <EventRegistrationDialog 
        isOpen={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
        eventTitle={event.title}
        formattedDate={formattedDate}
        formattedTime={formattedTime}
        ticketCount={ticketCount}
        displayPrice={displayPrice}
        onProceedToPayment={handleConfirmRegistration}
      />
      
      {/* Payment Dialog */}
      <PaymentDialog 
        isOpen={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        onBackClick={() => {
          setIsPaymentDialogOpen(false);
          setIsRegisterDialogOpen(true);
        }}
        onPaymentSubmit={handlePayment}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={setPhoneNumber}
        isProcessingPayment={isProcessingPayment}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteEventDialog 
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirmDelete={handleDeleteEvent}
      />
    </main>
  );
};

export default EventDetailPage;
