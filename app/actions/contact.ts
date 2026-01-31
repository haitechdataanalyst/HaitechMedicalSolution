'use server';

import { z } from 'zod';
import { sendContactEmail } from '@/lib/email';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  try {
    const validatedFields = contactSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    });

    if (!validatedFields.success) {
      const fieldErrors: Record<string, string> = {};
      validatedFields.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      return {
        success: false,
        error: 'Please check the form for errors',
        fieldErrors,
      };
    }

    const data = validatedFields.data;

    await sendContactEmail({
      to: process.env.CONTACT_EMAIL || 'info@haitechmedical.com.au',
      from: data.email,
      name: data.name,
      subject: data.subject,
      message: data.message,
    });

    return { success: true };
  } catch (error) {
    console.error('Contact form error:', error);

    return {
      success: false,
      error: 'Failed to send message. Please try again or contact us directly.',
    };
  }
}
