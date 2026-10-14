CREATE TABLE "lead_cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"sku" varchar(100),
	"quantity" integer NOT NULL,
	"unit_price" integer,
	"customization" text,
	CONSTRAINT "chk_lead_cart_items_quantity" CHECK ("lead_cart_items"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" varchar(30) NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"state" varchar(100),
	"postcode" varchar(15),
	"country" varchar(2) NOT NULL,
	"subject" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"product_id" integer,
	"product_name" varchar(200),
	"product_sku" varchar(100),
	"selected_variant" varchar(200),
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"ip_address" "inet",
	"user_agent" text,
	"email_sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_leads_source" CHECK ("leads"."source" IN ('contact_form', 'product_quote', 'cart_quote')),
	CONSTRAINT "chk_leads_status" CHECK ("leads"."status" IN ('new', 'contacted', 'converted', 'closed'))
);
--> statement-breakpoint
ALTER TABLE "lead_cart_items" ADD CONSTRAINT "lead_cart_items_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_lead_cart_items_lead_id" ON "lead_cart_items" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "idx_leads_email" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_leads_ip_address" ON "leads" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "idx_leads_created_at" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_leads_status" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_leads_product_id" ON "leads" USING btree ("product_id");