
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface PaymentDetails {
  eventId: string;
  userId: string;
  amount: number;
  tickets: number;
  paymentMethod: 'esewa' | 'khalti' | 'fonepay' | 'connectips';
  phoneNumber?: string;
}

export const initiateNepaliPayment = async (details: PaymentDetails) => {
  try {
    // Record the payment initiation in database
    const { data, error } = await supabase
      .from('event_bookings')
      .insert({
        event_id: details.eventId,
        user_id: details.userId,
        amount: details.amount,
        tickets: details.tickets,
        payment_status: 'pending',
        payment_method: details.paymentMethod,
        phone_number: details.phoneNumber
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Since we don't have actual integration with the payment gateways,
    // we'll simulate a successful payment for demo purposes
    const bookingId = data.id;
    
    toast({
      title: "Payment initiated",
      description: `Redirecting to ${details.paymentMethod} payment gateway...`,
    });
    
    // In a real implementation, we would redirect to the payment gateway
    // For demo, we'll simulate a successful payment after a short delay
    setTimeout(() => {
      completePayment(bookingId);
    }, 2000);
    
    return { success: true, bookingId };
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    toast({
      title: "Payment failed",
      description: error.message || "An error occurred during payment processing",
      variant: "destructive",
    });
    throw error;
  }
};

export const completePayment = async (bookingId: string) => {
  try {
    const { error } = await supabase
      .from('event_bookings')
      .update({ 
        payment_status: 'completed',
        payment_completed_at: new Date().toISOString()
      })
      .eq('id', bookingId);
      
    if (error) throw error;
    
    toast({
      title: "Payment successful",
      description: "Your ticket has been booked successfully!",
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Payment completion error:', error);
    toast({
      title: "Payment update failed",
      description: error.message || "An error occurred updating your payment",
      variant: "destructive",
    });
    throw error;
  }
};

export const getNepaliPaymentMethods = () => {
  return [
    { id: 'esewa', name: 'eSewa', logo: '/payment-logos/esewa.png' },
    { id: 'khalti', name: 'Khalti', logo: '/payment-logos/khalti.png' },
    { id: 'fonepay', name: 'Fonepay', logo: '/payment-logos/fonepay.png' },
    { id: 'connectips', name: 'ConnectIPS', logo: '/payment-logos/connectips.png' }
  ];
};

// Add currency formatting function for Nepali Rupees
export const formatNepaliCurrency = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `Rs ${numAmount.toLocaleString('ne-NP')}`;
};
