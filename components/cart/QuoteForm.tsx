'use client';

import { useActionState, useEffect, useState } from 'react';
import { useCart } from './CartProvider';
import { submitQuoteRequest, QuoteFormState } from '@/app/actions/quote';
import { Input, Textarea, Button } from '@/components/ui';
import { CheckIcon, ArrowBackIcon } from '@/components/icons';

interface QuoteFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const initialState: QuoteFormState = {
  success: false,
};

export default function QuoteForm({ onBack, onSuccess }: QuoteFormProps) {
  const { items, clearCart } = useCart();
  const [state, formAction, isPending] = useActionState(submitQuoteRequest, initialState);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      clearCart();
      // Delay before closing to show success message
      const timer = setTimeout(() => {
        onSuccess();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, clearCart, onSuccess]);

  if (showSuccess) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIcon size={32} className="text-success" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Quote Request Sent!</h3>
        <p className="text-muted">We&apos;ll be in touch shortly with your quote.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-4"
      >
        <ArrowBackIcon size={16} />
        Back to cart
      </button>

      <p className="text-sm text-muted mb-6">
        Fill in your details below and we&apos;ll send you a detailed quote for your selected items.
      </p>

      {/* Error Message */}
      {state.error && !state.fieldErrors && (
        <div className="mb-4 p-3 bg-error/10 border border-error rounded-lg text-sm text-error">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Hidden cart items */}
        <input
          type="hidden"
          name="cartItems"
          value={JSON.stringify(items)}
        />

        <Input
          label="Full Name"
          name="name"
          type="text"
          required
          placeholder="John Smith"
          error={state.fieldErrors?.name}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          required
          placeholder="john@example.com"
          error={state.fieldErrors?.email}
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          required
          placeholder="+61 400 000 000"
          error={state.fieldErrors?.phone}
        />

        <Input
          label="Company (Optional)"
          name="company"
          type="text"
          placeholder="Your Dental Practice"
          error={state.fieldErrors?.company}
        />

        <Textarea
          label="Additional Notes (Optional)"
          name="message"
          placeholder="Any special requirements or questions..."
          error={state.fieldErrors?.message}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={isPending}
          disabled={isPending}
        >
          {isPending ? 'Sending...' : 'Submit Quote Request'}
        </Button>
      </form>
    </div>
  );
}
