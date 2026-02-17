AIFlix: AI-Powered Movie Discovery Engine
A full-stack MERN (MongoDB, Express, React, Node) application that revolutionizes movie discovery by integrating Gemini 2.0 Flash AI for mood-based recommendations.

🚀 Key Features
AI Discovery: Personalized movie suggestions based on user mood or natural language prompts using the Google Generative AI SDK.

Full-Stack Auth: Secure user authentication using JWT (JSON Web Tokens) and bcryptjs for password hashing.

Secure Sessions: Persistent login states using HTTP-Only cookies to protect against XSS attacks.

State Management: High-performance, lightweight global state handling with Zustand.

Dynamic UI: Responsive Netflix-inspired interface built with Tailwind CSS and Vite.

Watchlist: A personalized REST API to save and manage favorite films in MongoDB.

🛠️ Tech Stack
Frontend: React.js, Vite, Tailwind CSS, Zustand.

Backend: Node.js, Express.js.

Database: MongoDB Atlas.

AI Engine: Google Gemini AI.

Authentication: JWT, Cookie-Parser, BcryptJS.

🏗️ Architecture Overview
The project follows a modular client-server architecture. The frontend communicates with a RESTful API built on Express. External movie metadata is fetched from the TMDB API, while mood analysis is processed via Gemini AI.

⚙️ Installation & Setup
1. Clone the Repository
2. Backend Setup
Create a .env file in the backend folder:

Install dependencies and start:

3. Frontend Setup
Create a .env file in the frontend folder:

Install dependencies and start:

🛡️ Security Implementation
CORS Policy: Restricted to specific origins to prevent unauthorized cross-origin requests.

Input Validation: Backend validation to ensure data integrity during signup and login.

Credential Masking: Use of .env files and .gitignore to prevent leaking sensitive API keys.

💡 Lessons Learned
Handling Async AI States: Learned how to manage "Pending" request states and loading skeletons during AI generation.

Cookie Security: Mastered the implementation of SameSite and Secure attributes for cross-domain session management.

Debugging CORS: Resolved complex pre-flight request issues between disparate frontend and backend ports.
