import PDFDocument from "pdfkit";
import { CartItem } from "@/types";
import { formatCurrency, calculateCartTotal } from "./cart";
import siteConfig from "@/data/site-config.json";

interface QuotePDFData {
    customer: {
        name: string;
        email: string;
        phone: string;
        company?: string;
    };
    items: CartItem[];
    message?: string;
}

export async function generateQuotePDF(data: QuotePDFData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        // Header
        doc.fontSize(24).fillColor("#0066CC").text("Haitech Medical", 50, 50).fontSize(10).fillColor("#666").text("Premium Medical & Dental Equipment", 50, 80).moveDown();

        // Quote Title
        doc.fontSize(18)
            .fillColor("#000")
            .text("Quote Request", 50, 120)
            .fontSize(10)
            .fillColor("#666")
            .text(
                `Date: ${new Date().toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}`,
                50,
                145
            )
            .text(`Reference: QR-${Date.now().toString(36).toUpperCase()}`, 50, 160)
            .moveDown();

        // Horizontal line
        doc.strokeColor("#ddd").lineWidth(1).moveTo(50, 185).lineTo(550, 185).stroke();

        // Customer Information
        doc.fontSize(14)
            .fillColor("#0066CC")
            .text("Customer Information", 50, 205)
            .fontSize(10)
            .fillColor("#000")
            .text(`Name: ${data.customer.name}`, 50, 230)
            .text(`Email: ${data.customer.email}`, 50, 245)
            .text(`Phone: ${data.customer.phone}`, 50, 260);

        let yPosition = 275;
        if (data.customer.company) {
            doc.text(`Company: ${data.customer.company}`, 50, yPosition);
            yPosition += 15;
        }

        yPosition += 25;

        // Items Header
        doc.fontSize(14).fillColor("#0066CC").text("Requested Items", 50, yPosition);

        yPosition += 25;

        // Table header
        doc.fontSize(9)
            .fillColor("#666")
            .text("ITEM", 50, yPosition, { width: 200 })
            .text("SKU", 260, yPosition, { width: 80 })
            .text("QTY", 350, yPosition, { width: 40, align: "center" })
            .text("UNIT PRICE", 400, yPosition, { width: 70, align: "right" })
            .text("TOTAL", 480, yPosition, { width: 70, align: "right" });

        yPosition += 15;

        // Line under header
        doc.strokeColor("#ddd").lineWidth(1).moveTo(50, yPosition).lineTo(550, yPosition).stroke();

        yPosition += 10;

        // Items
        data.items.forEach((item) => {
            // Check if we need a new page
            if (yPosition > 700) {
                doc.addPage();
                yPosition = 50;
            }

            doc.fontSize(10)
                .fillColor("#000")
                .text(item.productName, 50, yPosition, { width: 200 })
                .text(item.sku, 260, yPosition, { width: 80 })
                .text(item.quantity.toString(), 350, yPosition, { width: 40, align: "center" })
                .text(item.basePrice ? formatCurrency(item.basePrice) : "POA", 400, yPosition, { width: 70, align: "right" })
                .text(item.basePrice ? formatCurrency(item.basePrice * item.quantity) : "POA", 480, yPosition, { width: 70, align: "right" });

            yPosition += 18;

            // Add customization details if present
            if (item.customization && Object.keys(item.customization).length > 0) {
                doc.fontSize(8).fillColor("#666");
                Object.entries(item.customization).forEach(([key, value]) => {
                    doc.text(`    • ${key}: ${value}`, 60, yPosition);
                    yPosition += 12;
                });
                yPosition += 5;
            }
        });

        // Total section
        yPosition += 10;
        doc.strokeColor("#ddd").lineWidth(1).moveTo(350, yPosition).lineTo(550, yPosition).stroke();

        yPosition += 15;

        const total = calculateCartTotal(data.items);
        const hasAllPrices = data.items.every((item) => item.basePrice !== undefined);

        doc.fontSize(11)
            .fillColor("#000")
            .text("Subtotal:", 400, yPosition, { width: 70, align: "right" })
            .text(hasAllPrices ? formatCurrency(total) : "POA", 480, yPosition, { width: 70, align: "right" });

        yPosition += 18;

        doc.text("GST (10%):", 400, yPosition, { width: 70, align: "right" }).text(hasAllPrices ? formatCurrency(total * 0.1) : "POA", 480, yPosition, { width: 70, align: "right" });

        yPosition += 18;

        doc.fontSize(12)
            .font("Helvetica-Bold")
            .text("TOTAL:", 400, yPosition, { width: 70, align: "right" })
            .text(hasAllPrices ? formatCurrency(total * 1.1) : "POA", 480, yPosition, { width: 70, align: "right" })
            .font("Helvetica");

        // Message section
        if (data.message) {
            yPosition += 40;

            if (yPosition > 650) {
                doc.addPage();
                yPosition = 50;
            }

            doc.fontSize(12)
                .fillColor("#0066CC")
                .text("Additional Notes", 50, yPosition)
                .fontSize(10)
                .fillColor("#000")
                .text(data.message, 50, yPosition + 20, { width: 500 });
        }

        // Footer
        const footerY = doc.page.height - 80;

        doc.fontSize(8)
            .fillColor("#666")
            .text("This is a quote request. Final pricing may vary based on customization options and shipping.", 50, footerY, { width: 500, align: "center" })
            .text(`${siteConfig.company.name} | ${siteConfig.emails.contact} | ${siteConfig.company.phone}`, 50, footerY + 15, { width: 500, align: "center" })
            .text("haitechmedical.com.au", 50, footerY + 30, { width: 500, align: "center" });

        doc.end();
    });
}
