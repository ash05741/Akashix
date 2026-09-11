# AkashixCore 🌌

AkashixCore is a full-stack SaaS worldbuilding platform engineered to manage complex character entities and interconnected lore. Built entirely within the JavaScript/TypeScript ecosystem, it provides writers and game developers with a centralized, responsive dashboard to track entity attributes, faction relationships, and dynamic story elements in real-time.

## 🚀 Live Demo
https://akashix-frontend.vercel.app/

## ✨ Key Features
* **Complete CRUD Architecture:** Seamless creation, reading, updating, and deletion of Character and Lore entities via a custom API gateway.
* **Instant State Synchronization:** Utilizes Apollo Client's in-memory cache to update the UI instantly upon successful database mutations without triggering page reloads.
* **Strict Type Safety:** End-to-end TypeScript implementation ensuring exact type conformity between the React frontend interfaces and the GraphQL backend responses.
* **Fluid UI/UX:** Built with Tailwind CSS and Framer Motion for responsive, mobile-optimized layouts and highly polished modal transitions.
* **AI Lore Enhancement:** Integrated AI text generation to polish and expand upon user-drafted worldbuilding concepts.

## 🛠️ Technical Stack
**Frontend:**
* React (Function Components & Hooks)
* TypeScript
* Apollo Client (GraphQL Data Fetching & Caching)
* Tailwind CSS
* Framer Motion
* Lucide React (Iconography)

**Backend:**
* Node.js & Express
* Apollo Server (GraphQL API)
* MongoDB & Mongoose
* GraphQL (Strict typeDefs and modular resolvers)

## 🏗️ Architecture & Deployment
* **Frontend Hosting:** Vercel (Optimized for edge caching and fast global delivery).
* **Backend Hosting:** Render (Kept continuously active via UptimeRobot HTTP polling to eliminate cold start latency).
* **Database:** MongoDB Atlas (Cloud-hosted NoSQL cluster).

## 💻 Local Development Setup

**1. Clone the repository**
```bash
git clone [https://github.com/ash05741/Akashix.git](https://github.com/ash05741/Akashix.git)
cd Akashix

**2. Start Backend**
```bash
cd Backend
npm install
npm run dev
```

**3. Create .env file in the backend directory and add your MongoDB URI:**
```
MONGODB_URI=your_cluster_string_here
PORT=4000
```

**4. Start Frontend**
```bash
cd Frontend
npm install
npm run dev
