
import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CheckCircle, Calendar, ArrowRight, Download } from 'lucide-react';
import { formatNepaliCurrency } from '@/services/paymentService';

const EventConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    eventTitle?: string;
    ticketCount?: number;
    totalAmount?: number;
    paymentMethod?: string;
  } | null;
  
  // If there's no state, it means the user navigated directly to this page
  // Redirect them to the events page
  React.useEffect(() => {
    if (!state) {
      navigate('/events');
    }
  }, [state, navigate]);
  
  if (!state) {
    return null; // Return null while redirecting
  }
  
  const { eventTitle, ticketCount, totalAmount, paymentMethod } = state;
  
  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a ticket
    alert('Ticket download feature would be implemented here');
  };
  
  return (
    <div className="container max-w-3xl py-12 px-4">
      <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground max-w-lg">
          Your payment was successful and your booking for {eventTitle} has been confirmed. 
          Check your email for your e-tickets.
        </p>
      </div>
      
      <Card className="mb-8 animate-slide-up">
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Your event tickets are ready</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Event</span>
            <span className="font-medium">{eventTitle}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Tickets</span>
            <span>{ticketCount} ticket{ticketCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="capitalize">{paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-bold">{formatNepaliCurrency(totalAmount || 0)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDownloadTicket} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Ticket
          </Button>
          <Button asChild className="flex items-center gap-2">
            <Link to="/dashboard">
              My Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center animate-fade-in-delayed">
        <p className="text-muted-foreground mb-4">Want to explore more events?</p>
        <Button asChild variant="outline">
          <Link to="/events">Browse Events</Link>
        </Button>
      </div>
    </div>
  );
};

export default EventConfirmationPage;
