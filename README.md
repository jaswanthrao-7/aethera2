# AETHERA - Cognitive Bio-Elixir

Aethera is a cinematic, highly-animated, full-stack showcase application for a futuristic cognitive-enhancing energy drink. It integrates an immersive frontend with advanced scroll-triggered physics animations and a robust, secure Next.js API Routes backend powered by MongoDB and JWT authentication.

---

## 🚀 Key Feature Sets

### 🎨 Immersive Frontend
- **3D Mouse Parallax**: Fluid 3D canvas perspective tilts on floating product cans that follow mouse coordinates with calculated momentum.
- **GSAP & ScrollTrigger reveals**: Scroll-calibrated elements, staggered paragraph letters reveals, and fluid card transitions as they enter the screen viewport.
- **Holographic Glassmorphic Layouts**: Glossmorphic panels (`backdrop-blur`) utilizing subtle neon borders and background radial ambient glowing nodes.
- **Kinetic Custom Cursor**: Lag-free custom vector cursor trails tracking the mouse, which expand and invert colors over interactive nodes.
- **Circular Preloader**: Circular SVG ring that fills up linked with a countdown timer representing neural synapse boot sequences.
- **Confetti Actions**: Particle streams firing dynamically upon portal entry, cart dispatches, and pricing batch orders.

### 🛡️ Secure Server API Backend
- **MongoDB with Mongoose**: Singleton connection pooling ensuring optimal database queries without overloading pool connections.
- **Automatic Seed Operations**: If the database contains zero elixirs, the API automatically populates 3 premium drinks (Origin, Ignite, Zenith) with specific clinical specs, themes, and image nodes.
- **Secure Password Hashing**: Hashing algorithm utilizing `bcryptjs` for secure password encryption.
- **HttpOnly JWT Session Cookies**: Authentication utilizing JSON Web Tokens written into secure, client-inaccessible HttpOnly cookies.
- **Admin Control Dashboard**: Fully developed dashboard managing products (CRUD details, themes, prices), user accounts, and customer signal dispatches.

---

## 🛠️ Technology Integrations

- **Core**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Animations**: GSAP, ScrollTrigger, Framer Motion
- **Database**: MongoDB & Mongoose
- **Security**: JWT (`jsonwebtoken`), `bcryptjs`
- **Iconography**: Lucide React
- **Graticule**: Canvas-Confetti

---

## 💻 Local Setup Guide

Follow this step-by-step guide to run Aethera locally on your machine.

### 1. Prerequisite Installations
- Ensure you have **Node.js LTS (v24+)** installed on your system.
- Ensure you have **MongoDB Community Server** installed and running locally, or have a **MongoDB Atlas** connection URI.
  - *Download MongoDB*: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

### 2. Set Up Environment Variables
Create an active `.env.local` file by copying the template file:
```bash
cp .env.example .env.local
```
Ensure the variables are configured:
- `MONGODB_URI`: Point to your local database `mongodb://127.0.0.1:27017/aethera_db` or Atlas connection.
- `JWT_SECRET`: Input a long cryptographic sequence.

### 3. Run Development Server
Boot up the local Next.js dev server:
```bash
npm run dev
```

The application will launch on **[http://localhost:3000](http://localhost:3000)**.
Upon first scroll to the Showcase section or loading the database, the API will **automatically seed** the initial premium elixirs into your MongoDB collection!

### 4. Admin Portal Diagnostics Entry
To log in as an administrator:
1. Navigate to the **Portal Access** screen (click "PORTAL ACCESS" in the navbar, or go to `/login`).
2. Register a new account using the email: **`admin@aethera.com`** (the database automatically delegates the `'admin'` security role to this email during registration!).
3. Input any password (6+ characters) and click **Register**.
4. Log in with the newly registered `admin@aethera.com` credentials.
5. The navbar will display an **"ADMIN"** dashboard badge. Click it or navigate to **`/admin`** to manage products, view transmissions, and view active users!

---

## ☁️ Vercel Deployment Instructions

Aethera is optimized to deploy seamlessly to Vercel's serverless edge infrastructure.

### Step 1: Establish cloud MongoDB Database
1. Go to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** and sign up for a free shared cluster.
2. In the Database Access tab, create a database user and record their username and password.
3. In Network Access, whitelist `0.0.0.0/0` (allow connection access from all Vercel serverless nodes).
4. Click **Connect** -> **Drivers** to get your MongoDB connection URI (e.g., `mongodb+srv://username:password@cluster0.abcde.mongodb.net/aethera?retryWrites=true&w=majority`).

### Step 2: Deploy to Vercel
1. Push your local workspace directory to a private **GitHub**, **GitLab**, or **Bitbucket** repository.
2. Go to the **[Vercel Dashboard](https://vercel.com)**, click **Add New** -> **Project**, and import your repository.
3. In the **Environment Variables** panel, add the following fields:
   - `MONGODB_URI` = `YOUR_MONGODB_ATLAS_CONNECTION_URI`
   - `JWT_SECRET` = `YOUR_SECURE_JWT_SIGNING_KEY`
   - `NODE_ENV` = `production`
4. Click **Deploy**. Vercel will bundle the App Router assets and spin up the backend serverless API routes automatically!

---
*Developed by AETHERA LABS. Calibrate your performance frequency.*
