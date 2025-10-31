# 🌍 BookIt: Experiences & Slots

**BookIt** is a fullstack web application that allows users to explore travel experiences, view available slots, and make bookings in a clean and responsive interface.

This project was built as part of the **Fullstack Intern Assignment**, focusing on real-world end-to-end development — from frontend UI design to backend data handling and API integration.

---

## 🚀 Live Links

- **Frontend (Vercel):** [https://bookit-65a9nml03-shronghanates-projects.vercel.app](https://bookit-65a9nml03-shronghanates-projects.vercel.app)
- **Backend (Railway):** [https://talented-reverence-production.up.railway.app](https://talented-reverence-production.up.railway.app)
- **Figma Design:** [HD-Booking (Figma)](https://www.figma.com/design/8X6E1Ev8YdtZ3erV0Iifvb/HD-booking?node-id=0-1&p=f&t=K4scwnxfIHmfbb2a-0)

---

## 🧩 Project Overview

### 🎯 Objective
To develop a **complete booking platform** where users can:
- Browse curated experiences
- View details and available slots
- Apply promo codes and taxes
- Complete bookings and see confirmation

---

## 🖥️ Frontend

### 🔹 Tech Stack
- **React + TypeScript** (Vite)
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API requests

### 🔹 Key Features
- **Home Page:** Fetch and display list of experiences.
- **Details Page:** Show experience info, available dates & slots.
- **Checkout Page:** Collect user details, apply promo codes, calculate total.
- **Result Page:** Display booking confirmation or failure.
- **Responsive Design:** Mobile-first with clean UI spacing and typography.
- **Form Validation:** Basic checks for name, email, and guest count.
- **State Management:** Using React hooks for clean and efficient logic.

## ⚙️ Backend

### 🔹 Tech Stack
- **Node.js + Express**
- **MongoDB (Mongoose)**
- **CORS & dotenv** for configuration
- Hosted on **Railway**


# Clone the repository
git clone https://github.com/<your-username>/bookit.git

cd bookit

# Install frontend dependencies
npm install

# Setup backend
cd backend

npm install

# Create a .env file in the backend folder with your MongoDB connection string and port
PORT=5000

MONGO_URI=mongodb+srv://bookit_user:Bookit123!@cluster0.unp2meq.mongodb.net/bookitDB?retryWrites=true&w=majority

# Start backend server
npm run dev

# Setup frontend environment variables
cd ..

# Create a .env file in the root directory with API URL
VITE_API_URL=http://localhost:5000/api

# Run the frontend app
npm run dev

