'use client';

import { useActionState } from 'react';
import { submitContactForm, ContactFormState } from '@/app/actions/contact';
import { Input, Textarea, Button } from '@/components/ui';
import { CheckIcon } from '@/components/icons';

const initialState: ContactFormState = {
  success: false,
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckIcon size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Error Message */}
      {state.error && !state.fieldErrors && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      <Input
        label="Subject"
        name="subject"
        type="text"
        required
        placeholder="How can we help?"
        error={state.fieldErrors?.subject}
      />

      <Textarea
        label="Message"
        name="message"
        required
        placeholder="Your message..."
        rows={6}
        error={state.fieldErrors?.message}
      />

      <Button
        type="submit"
        size="lg"
        isLoading={isPending}
        disabled={isPending}
      >
        {isPending ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
