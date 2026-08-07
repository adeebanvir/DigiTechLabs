# DigiTech - Next-Gen E-Commerce Platform

A modern, high-performance e-commerce web application built with **React**, **Tailwind CSS**, **Firebase Firestore**, and **Cloudinary**. Featuring role-based authentication, real-time dynamic database updates, custom interactive analytics dashboards, and an automated data migration suite.

---

##  Tech Stack

- **Frontend Framework**: React 18 with TypeScript & Vite
- **Styling & UI**: Tailwind CSS, Lucide Icons, Framer Motion
- **Database & Auth**: Firebase Firestore & Firebase Authentication
- **Media Storage**: Cloudinary (Image CDN & Unsigned Upload Presets)
- **Data Visualization**: Custom SVG & Recharts Analytics Charts

---

## ✨ Key Features

###  Role-Based Access Control (RBAC)
- **Customer Portal**: Browse products, search, filter by category, manage cart, place orders, view order status, update account profile, and manage notifications.
- **Admin Control Center**: Secure dashboard reserved for administrative users (`isAdmin = true`) with full access to manage store operations, product inventory, and site settings.

###  Admin Analytics & Operations
- **Interactive Dashboards**: Real-time sales charts, revenue metrics, order status breakdowns, and customer insights.
- **Catalog Management**: Add, edit, and organize products, categories, stock inventory, tax rates, and store policies.
- **Order Processing**: Review customer orders, update delivery statuses, and filter by payment state.
- **Branding & Footer Control**: Dynamic controls to edit store tagline and manage up to 4 customizable social media links.

###  Media & Asset Management
- **Cloudinary Integration**: Direct image uploads with instant preview, CDN optimization, and media library organization.

###  Data Backup & Migration Suite
- **JSON Export & Import**: One-click download of full database snapshots across all Firestore collections.
- **Cross-Project Transfer**: Transfer all collections directly to a new Firebase project using target API keys.
- **Cloudinary Asset Migration**: Re-upload image libraries directly to a target Cloudinary cloud account.

---

##  Getting Started

Follow these steps to set up the project locally:

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Fill in your own credentials in `.env`:

```env
# Firebase Configuration (Required for Database & Auth)
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Cloudinary Configuration (Required for Media Uploads)
VITE_CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
VITE_CLOUDINARY_UPLOAD_PRESET="your-unsigned-upload-preset"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Optional Email SMTP Settings (For Contact Forms)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="user@example.com"
SMTP_PASS="your-smtp-password"
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

##  Production Build

To compile a production-ready bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

##  Firebase Security Rules

Make sure to deploy the security rules provided in `firestore.rules` to your Firebase Firestore database to enforce role-based permissions:

```bash
firebase deploy --only firestore:rules
```
