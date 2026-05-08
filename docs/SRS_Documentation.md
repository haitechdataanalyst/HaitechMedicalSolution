# Software Requirements Specification (SRS)
## Project: Haitech Medical
**Version:** 1.0  
**Status:** Final Draft  
**Author:** Antigravity AI  
**Date Modified:** March 13, 2026

---

## Table of Contents
1. [Introduction](#1-introduction)
   - 1.1 [Document Purpose](#11-document-purpose)
   - 1.2 [Product Scope](#12-product-scope)
   - 1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
   - 1.4 [References](#14-references)
   - 1.5 [Document Overview](#15-document-overview)
2. [Product Overview](#2-product-overview)
   - 2.1 [Product Perspective](#21-product-perspective)
   - 2.2 [Product Functions](#22-product-functions)
   - 2.3 [Product Constraints](#23-product-constraints)
   - 2.4 [User Characteristics](#24-user-characteristics)
   - 2.5 [Assumptions and Dependencies](#25-assumptions-and-dependencies)
   - 2.6 [Apportioning of Requirements](#26-apportioning-of-requirements)
3. [Requirements](#3-requirements)
   - 3.1 [External Interfaces](#31-external-interfaces)
   - 3.2 [Functional Requirements](#32-functional-requirements)
   - 3.3 [Quality of Service (Non-Functional)](#33-quality-of-service)
   - 3.4 [Compliance](#34-compliance)
   - 3.5 [Design and Implementation](#35-design-and-implementation)
   - 3.6 [AI/ML Requirements](#36-aiml)
4. [Verification](#4-verification)
5. [Appendixes](#5-appendixes)

---

## Revision History
| Name | Date | Reason For Changes | Version |
| :--- | :--- | :--- | :--- |
| Antigravity | 2026-03-13 | Initial baseline for Phase 1 | 0.1 |
| Antigravity | 2026-03-13 | Full integration of Phase 2 Requirements | 1.0 |

---

## 1. Introduction
This document provides a comprehensive specification of the requirements for the Haitech Medical e-commerce platform. It integrates established Phase 1 features with newly defined Phase 2 requirements to create a unified technical blueprint.

### 1.1 Document Purpose
The purpose of this SRS is to define the full functional and non-functional requirements of the Haitech Medical system. This document is intended for project stakeholders, developers, QA engineers, and system administrators. It serves as the primary reference for system behavior, data structures, and security protocols throughout the software development lifecycle.

### 1.2 Product Scope
**Haitech Medical** is a specialized e-commerce platform designed for medical and dental professionals. It facilitates the discovery, customization, and purchase of high-precision optical and surgical equipment.
- **Inclusions**: Full product catalog, dynamic filtering, PDF quote/invoice generation, JWT-based user authentication, role-based access control, integrated payment processing, order lifecycle management (pipeline), an admin dashboard for operations, SEO optimization, and an AI-driven support chatbot.
- **Exclusions**: Physical shipping logistics, inventory warehousing software, and hardware manufacturing processes.

### 1.3 Definitions, Acronyms, and Abbreviations
| Term | Definition |
| :--- | :--- |
| **JWT** | JSON Web Token - A compact, URL-safe means of representing claims to be transferred between two parties. |
| **RBAC** | Role-Based Access Control - Restricting system access to authorized users based on their roles. |
| **CRUD** | Create, Read, Update, Delete - The four basic functions of persistent storage. |
| **RAG** | Retrieval-Augmented Generation - A technique to give an LLM access to external data (product catalog). |
| **SEO** | Search Engine Optimization - Improving the quality and quantity of website traffic from search engines. |
| **ORM** | Object-Relational Mapping - A technique that lets you query and manipulate data from a database using an object-oriented paradigm (e.g., Prisma). |

### 1.4 References
- **Next.js 15+** Documentation: Framework for building the application.
- **Stripe API Reference**: For payment gateway integration.
- **WCAG 2.1**: Accessibility standards for web content.
- **ISO 27001**: Reference for security and data protection standards.

### 1.5 Document Overview
This document is divided into four main sections. Section 2 describes the high-level context and target users. Section 3 details every verifiable requirement organized by area (Functional, Interface, QoS, AI). Section 4 defines how these requirements will be tested, and Section 5 contains supplemental data dictionaries and glossaries.

---

## 2. Product Overview

### 2.1 Product Perspective
The Haitech Medical platform replaces a legacy static catalog with a modern, high-performance web application. It acts as the central digital storefront for Haitech Group's medical division, integrating with email services (Nodemailer/Resend) and payment providers (Stripe) to deliver a seamless end-to-end shopping experience.

### 2.2 Product Functions
- **High-Resolution Catalog**: Dynamic rendering of Loupes, Headlights, and Instruments.
- **Advanced User Accounts**: Secure login, order history, and saved preferences.
- **Order Pipeline**: Step-by-step transaction flow from cart to fulfillment.
- **Smart Admin Panel**: Centralized control for product inventory, price adjustments, and order management.
- **Quote Automation**: On-the-fly PDF generation for professional quotes.
- **Intelligent Support**: AI Chatbot capable of answering product-specific technical questions.

### 2.3 Product Constraints
- **Technology Stack**: React 19, Next.js 15/16, Tailwind CSS 4, TypeScript.
- **Database**: Relational database (PostgreSQL) with structured schema for order integrity.
- **Hosting**: Vercel or similar cloud environments supporting Edge/Serverless functions.
- **Security**: Mandatory SSL/TLS, JWT for all sensitive API routes.

### 2.4 User Characteristics
- **Professional Practitioners**: Surgeons and Dentists. They require detailed technical specs and fast, reliable checkout.
- **Medical Students**: Looking for introductory equipment, requiring educational product descriptions.
- **Store Administrators**: Manage product listings, update stock, and process orders. Requires a low-latency management interface.

### 2.5 Assumptions and Dependencies
- **Payment Gateway**: Assumes Stripe or PayPal availability in the target regions (AUD/NZD markets).
- **Email Delivery**: Dependent on the reliability of SMTP/API providers (e.g., AWS SES or Resend).
- **AI Model**: Dependent on an LLM provider (OpenAI/Anthropic) for chatbot functionality.

### 2.6 Apportioning of Requirements
All requirements in this document are targeted for the **Final Release (v1.0)**, incorporating all Phase 2 integrations.

---

## 3. Requirements

### 3.1 External Interfaces

#### 3.1.1 User Interfaces
- **UI-01**: The system must use a "Glassmorphism" and high-end aesthetic as per brand guidelines.
- **UI-02**: Fully responsive layout (Mobile, Tablet, Desktop) using Tailwind CSS 4.
- **UI-03**: Interactive product previews including gallery sliders and variant selectors.

#### 3.1.2 Software Interfaces
- **SI-01 (Database)**: Use of Prisma or Drizzle ORM to interface with a PostgreSQL database.
- **SI-02 (Payments)**: Integration with Stripe's "Checkout Session" and "Payment Intent" APIs.
- **SI-03 (Email)**: SMTP/API integration for sending transactional emails (Order confirmation, password reset).

### 3.2 Functional Requirements

#### 3.2.1 User Authentication & Authorization
- **REQ-FUNC-01 (Registration)**: Users can sign up with email/password or OAuth (Google/LinkedIn).
- **REQ-FUNC-02 (JWT Auth)**: Use of secure HTTP-only cookies to store JWT tokens.
- **REQ-FUNC-03 (RBAC)**: Admin users can access `/admin` dashboard; regular users are restricted to `/profile` and checkout.

#### 3.2.2 Product Management (CRUD)
- **REQ-FUNC-04 (Creation)**: Admins can create new products with descriptions, prices, categories, and images.
- **REQ-FUNC-05 (Categorization)**: Products must be linkable to multiple categories (e.g., Loupes -> Ergomonic).
- **REQ-FUNC-06 (Variants)**: Support for product options (e.g., 2.5x vs 3.5x magnification) with price modifiers.

#### 3.2.3 Order Processing Pipeline
- **REQ-FUNC-07 (Cart)**: Persistence of cart items between sessions for logged-in users.
- **REQ-FUNC-08 (Order Flow)**: 
  1. Cart -> 2. Shipping Info -> 3. Payment -> 4. Confirmation.
- **REQ-FUNC-09 (Status)**: Automated status updates: `PENDING` -> `PAID` -> `PROCESSING` -> `SHIPPED`.

#### 3.2.4 Transactional Emails
- **REQ-FUNC-10**: The system shall send an automated PDF invoice upon successful payment.
- **REQ-FUNC-11**: The system shall send a "Shipping Notification" email when the admin updates an order to `SHIPPED`.

### 3.3 Quality of Service

#### 3.3.1 Security
- **REQ-SEC-01 (Validation)**: All API inputs must be validated using Zod schemas.
- **REQ-SEC-02 (Encryption)**: PII (Personally Identifiable Information) must be encrypted at rest if stored.
- **REQ-SEC-03 (Rate Limiting)**: Implement Upstash or similar rate-limiting on authentication and search endpoints.

#### 3.3.2 Performance
- **REQ-PERF-01**: Core Web Vitals (LCP, FID, CLS) must stay in the "Good" range on Google Search Console.
- **REQ-PERF-02**: Search results must be returned in < 200ms using database indexing.

#### 3.3.3 SEO
- **REQ-SEO-01**: Automatic sitemap generation at `/sitemap.xml`.
- **REQ-SEO-02**: Meta tags (Title, Description, OpenGraph) must be dynamically generated for every product page based on product data.

### 3.6 AI/ML (Chatbot)
- **REQ-ML-01 (Chatbot Integration)**: A floating chat widget must be available on all pages.
- **REQ-ML-02 (Knowledge Base)**: The chatbot must use a RAG pipeline to answer specific questions about loupe magnification, focal distance, and Medesy instrument materials.
- **REQ-ML-03 (Security)**: The chatbot must have a strict set of instructions to refuse any medical diagnostic queries.

---

## 4. Verification

| ID | Requirement | Method | Success Criteria |
| :--- | :--- | :--- | :--- |
| VER-01 | REQ-FUNC-02 (JWT) | Test | Token cannot be accessed via `document.cookie` (HttpOnly). |
| VER-02 | REQ-PERF-02 (Search) | Analysis | Average search response < 200ms with 10k items. |
| VER-03 | REQ-FUNC-10 (Invoice) | Demo | File generated is a valid PDF containing correct order totals. |
| VER-04 | REQ-SEC-03 (Rate Limit)| Test | Third attempt at login within 1 sec results in 429 Error. |

---

## 5. Appendixes

### 5.1 Technology Stack Summary
- **Frontend**: Next.js 15, React 19, Lucide Icons, Lordicon.
- **Backend**: Next.js API Routes (Route Handlers).
- **Database**: PostgreSQL (Neon/Supabase).
- **Styling**: Tailwind CSS 4, Vanilla CSS Modules.
- **Tools**: Prettier, ESLint, TypeScript.

### 5.2 Glossary
- **Loupes**: Vision enhancement glasses used by medical professionals.
- **Medesy**: A premium brand of dental and surgical instruments integrated into the catalog.
- **Ergo-Loups**: Specialized ergonomic loupes designed to reduce neck strain.
