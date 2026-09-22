import nodemailer from "nodemailer";
import { CartItem } from "@/types";

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
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
    const { to, customerEmail, customerName, customerPhone, customerCompany, pdfBuffer, items, message } = options;

    const transporter = createTransporter();

    const itemsList = items.map((item) => `- ${item.quantity}x ${item.productName} (${item.sku})`).join("\n");

    await transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@haitechmedical.com.au",
        to: to,
        replyTo: customerEmail,
        subject: `Quote Request from ${customerName}`,
        text: `
New quote request received from:

Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
${customerCompany ? `Company: ${customerCompany}` : ""}

Items requested:
${itemsList}

${message ? `Message:\n${message}` : ""}

Please find the detailed quote attached as PDF.
    `,
        html: `
<h2>New Quote Request</h2>

<h3>Customer Details</h3>
<p>
  <strong>Name:</strong> ${customerName}<br>
  <strong>Email:</strong> ${customerEmail}<br>
  <strong>Phone:</strong> ${customerPhone}<br>
  ${customerCompany ? `<strong>Company:</strong> ${customerCompany}<br>` : ""}
</p>

<h3>Items Requested</h3>
<ul>
  ${items.map((item) => `<li>${item.quantity}x ${item.productName} (${item.sku})</li>`).join("")}
</ul>

${message ? `<h3>Message</h3><p>${message}</p>` : ""}

<p><em>Detailed quote attached as PDF.</em></p>
    `,
        attachments: [
            {
                filename: `quote-${Date.now()}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf",
            },
        ],
    });
}

interface ContactEmailOptions {
    to: string;
    from: string;
    name: string;
    phone: string;
    state: string;
    postcode: string;
    country: string;
    subject: string;
    message: string;
}

export async function sendContactEmail(options: ContactEmailOptions) {
    const { to, from, name, phone, state, postcode, country, subject, message } = options;

    const transporter = createTransporter();

    const row = (label: string, value: string) => `
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top;">${label}</td>
          <td style="padding:8px 0;color:#111827;font-size:14px;vertical-align:top;">${value}</td>
        </tr>`;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@haitechmedical.com.au",
        to: to,
        replyTo: from,
        subject: `Haitech Website Lead: ${subject}`,
        text: `
New Haitech website lead:

Name: ${name}
Email: ${from}
Phone: ${phone}
State: ${state}
Postcode: ${postcode}
Country: ${country}
Subject: ${subject}

Message:
${message}
    `,
        html: `
<div style="background:#f3f4f6;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:#0f766e;padding:20px 24px;">
      <p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;">Haitech Medical</p>
      <h1 style="margin:4px 0 0;color:#ffffff;font-size:20px;">New Website Lead</h1>
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", name)}
        ${row("Email", `<a href="mailto:${from}" style="color:#0f766e;text-decoration:none;">${from}</a>`)}
        ${row("Phone", phone)}
        ${row("State", state)}
        ${row("Postcode", postcode)}
        ${row("Country", country)}
        ${row("Subject", subject)}
      </table>
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Message</p>
        <p style="margin:0;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message.replace(/\n/g, "<br>")}</p>
      </div>
    </div>
    <div style="padding:14px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">Sent from the contact form at haitech-group.com</p>
    </div>
  </div>
</div>
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
