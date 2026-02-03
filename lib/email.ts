import nodemailer from 'nodemailer';
import { CartItem } from '@/types';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

interface QuoteEmailOptions {
  to: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerCompany?: string;
  pdfBuffer: Buffer;
  items: CartItem[];
  message?: string;
}

export async function sendQuoteEmail(options: QuoteEmailOptions) {
  const { 
    to, 
    customerEmail, 
    customerName, 
    customerPhone,
    customerCompany,
    pdfBuffer, 
    items,
    message 
  } = options;
  
  const transporter = createTransporter();
  
  const itemsList = items
    .map(item => `- ${item.quantity}x ${item.productName} (${item.sku})`)
    .join('\n');
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@haitechmedical.com.au',
    to: to,
    replyTo: customerEmail,
    subject: `Quote Request from ${customerName}`,
    text: `
New quote request received from:

Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
${customerCompany ? `Company: ${customerCompany}` : ''}

Items requested:
${itemsList}

${message ? `Message:\n${message}` : ''}

Please find the detailed quote attached as PDF.
    `,
    html: `
<h2>New Quote Request</h2>

<h3>Customer Details</h3>
<p>
  <strong>Name:</strong> ${customerName}<br>
  <strong>Email:</strong> ${customerEmail}<br>
  <strong>Phone:</strong> ${customerPhone}<br>
  ${customerCompany ? `<strong>Company:</strong> ${customerCompany}<br>` : ''}
</p>

<h3>Items Requested</h3>
<ul>
  ${items.map(item => `<li>${item.quantity}x ${item.productName} (${item.sku})</li>`).join('')}
</ul>

${message ? `<h3>Message</h3><p>${message}</p>` : ''}

<p><em>Detailed quote attached as PDF.</em></p>
    `,
    attachments: [
      {
        filename: `quote-${Date.now()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

interface ContactEmailOptions {
  to: string;
  from: string;
  name: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(options: ContactEmailOptions) {
  const { to, from, name, subject, message } = options;
  
  const transporter = createTransporter();
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@haitechmedical.com.au',
    to: to,
    replyTo: from,
    subject: `Contact Form: ${subject}`,
    text: `
New message from contact form:

Name: ${name}
Email: ${from}
Subject: ${subject}

Message:
${message}
    `,
    html: `
<h2>New Contact Form Message</h2>

<p>
  <strong>Name:</strong> ${name}<br>
  <strong>Email:</strong> ${from}<br>
  <strong>Subject:</strong> ${subject}
</p>

<h3>Message</h3>
<p>${message.replace(/\n/g, '<br>')}</p>
    `,
  });
}

interface SendEmailOptions {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(options: SendEmailOptions) {
  const { to, from, replyTo, subject, text, html } = options;
  
  const transporter = createTransporter();
  
  await transporter.sendMail({
    from: from,
    to: to,
    replyTo: replyTo || from,
    subject: subject,
    text: text,
    html: html,
  });
}
