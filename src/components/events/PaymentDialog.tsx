
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { CreditCard, Phone, Loader2 } from 'lucide-react';
import { getNepaliPaymentMethods } from '@/services/paymentService';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBackClick: () => void;
  onPaymentSubmit: () => void;
  selectedPaymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  isProcessingPayment: boolean;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onOpenChange,
  onBackClick,
  onPaymentSubmit,
  selectedPaymentMethod,
  onPaymentMethodChange,
  phoneNumber,
  onPhoneNumberChange,
  isProcessingPayment
}) => {
  const paymentMethods = getNepaliPaymentMethods();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nepali Payment Options</DialogTitle>
          <DialogDescription>
            Select your preferred payment method to complete the booking.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <RadioGroup 
            value={selectedPaymentMethod} 
            onValueChange={(value) => onPaymentMethodChange(value)}
          >
            {paymentMethods.map(method => (
              <div key={method.id} className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 bg-muted flex items-center justify-center rounded">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span>{method.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (for payment)</Label>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input 
                id="phone" 
                placeholder="98XXXXXXXX" 
                value={phoneNumber} 
                onChange={(e) => onPhoneNumberChange(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the phone number registered with your {selectedPaymentMethod} account.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onBackClick}>Back</Button>
          <Button onClick={onPaymentSubmit} disabled={isProcessingPayment}>
            {isProcessingPayment ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
