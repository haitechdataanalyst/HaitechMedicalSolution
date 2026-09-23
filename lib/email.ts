import nodemailer from "nodemailer";
import { CartItem } from "@/types";

// ── Brand ─────────────────────────────────────────────────────────────────
// Kept in sync with the site's actual tokens (app/globals.css: --color-navy-900,
// --color-primary-500/200/700) — not arbitrary colors, so notification emails
// read as the same brand as the website. The logo needs an absolute URL since
// email clients fetch it from the recipient's inbox, not this codebase.
const BRAND = {
    navy: "#091c2e",
    primary: "#1fb6cd",
    primaryLight: "#99e5ed",
    primaryText: "#1980a6",
    logoUrl: "https://medical.haitech-group.com/haitech_medical_logo.png",
};

/** One label/value row inside an `emailSection` table. */
export function emailRow(label: string, valueHtml: string): string {
    return `
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top;">${label}</td>
          <td style="padding:8px 0;color:#111827;font-size:14px;vertical-align:top;">${valueHtml}</td>
        </tr>`;
}

/** A titled group of rows (e.g. "Customer", "Product"). */
export function emailSection(title: string, rowsHtml: string): string {
    return `
      <h2 style="margin:20px 0 8px;font-size:12px;color:${BRAND.primaryText};text-transform:uppercase;letter-spacing:0.6px;">${title}</h2>
      <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>`;
}

/** Free-text content (e.g. a message field), set apart from the structured rows above it. */
export function emailMessageBlock(label: string, text: string): string {
    return `
      <div style="margin-top:20px;padding:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;">
        <p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.4px;">${label}</p>
        <p style="margin:0;color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap;">${text.replace(/\n/g, "<br>")}</p>
      </div>`;
}

/** Wraps a notification email's body in the shared Haitech-branded shell: logo header, dark title band, dark footer. */
export function emailShell(options: { eyebrow: string; title: string; bodyHtml: string; footerText: string }): string {
    const { eyebrow, title, bodyHtml, footerText } = options;
    return `
<div style="background:#f3f4f6;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:${BRAND.primary};height:4px;line-height:4px;font-size:0;">&nbsp;</div>
    <div style="background:#ffffff;padding:24px 24px 20px;text-align:center;border-bottom:1px solid #e5e7eb;">
      <img src="${BRAND.logoUrl}" alt="Haitech Medical Solutions" width="170" style="display:inline-block;height:auto;max-width:170px;" />
    </div>
    <div style="background:${BRAND.navy};padding:16px 24px;">
      <p style="margin:0;color:${BRAND.primaryLight};font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:bold;">${eyebrow}</p>
      <h1 style="margin:4px 0 0;color:#ffffff;font-size:19px;font-weight:600;">${title}</h1>
    </div>
    <div style="padding:24px;">
      ${bodyHtml}
    </div>
    <div style="padding:14px 24px;background:${BRAND.navy};">
      <p style="margin:0;color:#8fb3c9;font-size:11px;">${footerText}</p>
    </div>
  </div>
</div>`;
}

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

    const bodyHtml =
        emailSection(
            "Contact",
            emailRow("Name", name) +
                emailRow("Email", `<a href="mailto:${from}" style="color:${BRAND.primaryText};text-decoration:none;">${from}</a>`) +
                emailRow("Phone", phone) +
                emailRow("State", state) +
                emailRow("Postcode", postcode) +
                emailRow("Country", country)
        ) +
        emailSection("Subject", emailRow("Subject", subject)) +
        emailMessageBlock("Message", message);

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
        html: emailShell({
            eyebrow: "Haitech Medical",
            title: "New Website Lead",
            bodyHtml,
            footerText: "Sent from the contact form at haitech-group.com",
        }),
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
