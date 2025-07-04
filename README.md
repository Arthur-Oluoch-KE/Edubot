EduBot - Homework Helper for Kids
EduBot is a full-stack web application designed for children aged 8–14 to assist with homework across subjects like math, science, history, and language arts. Built for a hackathon, it features a React frontend with Vite, Tailwind CSS, and Framer Motion for a responsive and animated UI, and a Node.js/Express backend with TypeScript, integrating Hugging Face’s Mathstral-7B and xAI’s Grok APIs. The app is deployable on Vercel’s free tier.
Features

Frontend: React with Vite, Tailwind CSS, and Framer Motion for a mobile-friendly, animated chat interface.
Backend: Node.js/Express with TypeScript for local development and Vercel serverless API.
AI Integration: Mathstral-7B for math queries, Grok for general queries, with fallback support.
Input Validation: Basic regex-based filtering for inappropriate content.
UI Components: Chat area, input field, subject selector, and follow-up buttons ("Explain again," "Give a hint").
Error Handling: Handles API failures with fallback and displays loading animations.

Setup Instructions
Prerequisites

Node.js (v16+)
Vercel CLI (npm install -g vercel)
Hugging Face API key (free tier)
xAI Grok API key (may require credits)

Installation

Clone the repository:
git clone <repository-url>
cd edubot


Frontend Setup (client):
cd client
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion


Create client/.env with VITE_API_URL and VITE_VERCEL_API_URL.


Backend Setup (server):
cd ../server
npm install express node-fetch cors dotenv
npm install -D typescript ts-node @types/node @types/express @types/cors
npx tsc --init


Create server/.env with HUGGINGFACE_API_KEY, GROK_API_KEY, and PORT.


Run Locally:

Frontend: cd client && npm run dev
Backend: cd server && npx ts-node src/index.ts


Deploy to Vercel:

Run vercel in the root directory.
Set environment variables in Vercel’s dashboard.



Project Structure

client/: React frontend with Vite, Tailwind CSS, and Framer Motion.
server/: Node.js/Express backend with TypeScript for local development.
api/: Vercel serverless API (ask.ts).
vercel.json: Vercel configuration for deployment.

Usage

Select a subject (e.g., math, science) from the dropdown.
Type a question and submit or use follow-up buttons.
View AI responses with step-by-step explanations or engaging analogies.

Notes

Ensure API keys are valid and have sufficient credits (Grok API may require payment).
The UI is optimized for mobile and child-friendly interaction.
Deployed on Vercel’s free tier, with serverless API support.
