QuickAI
QuickAI is a full-stack AI SaaS application that allows users to generate AI content such as articles, blog titles, images, resume reviews, and image transformations. It also includes a community page where users can explore published creations.
🔗 Live Demo


Frontend: https://quick-ai-nine-liart.vercel.app


Backend: https://quick-ai-server-neon.vercel.app



✨ Features
🔐 Authentication


Secure authentication using Clerk


Protected routes for all AI and user actions


User-specific content tracking



🤖 AI Tools


✍️ Generate articles


📰 Generate blog titles


🎨 Generate AI images


🧼 Remove image background


✂️ Remove objects from images


📄 Resume review using AI



🌍 Community Page


View published creations from all users


Like / unlike community posts


Click-to-expand cards


Optimized image rendering (no oversized images)



📦 User Dashboard


View personal AI creations


Publish or unpublish creations


Track generated content history



🧱 Tech Stack
Frontend


React (Vite)


Tailwind CSS


Clerk (Auth)


Axios


React Markdown


Backend


Node.js


Express


Clerk Middleware


PostgreSQL (Neon)


Cloudinary


Multer


OpenAI APIs


Deployment


Vercel (Frontend & Backend)


Neon (PostgreSQL Database)


Cloudinary (Image storage)



📂 Project Structure
QuickAI/
│
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── vite.config.js
│   └── vercel.json
│
├── server/                 # Backend (Express)
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── vercel.json
│
└── README.md


🔌 API Routes
User Routes
GET  /api/user/get-user-creations
GET  /api/user/get-published-creations
POST /api/user/toggle-like-creation

AI Routes
POST /api/ai/generate-article
POST /api/ai/generate-blog-titles
POST /api/ai/generate-image
POST /api/ai/remove-image-background
POST /api/ai/remove-image-object
POST /api/ai/review-resume

All routes are protected using Clerk authentication.

🌐 CORS Configuration
The backend supports multiple origins and credentials:
app.use(cors({
  origin: true,
  credentials: true
}))

This allows seamless communication between the deployed frontend and backend.

🖼️ Image Handling


Images are stored securely in Cloudinary


Frontend uses responsive rendering:


Max height constraints


Preserved aspect ratio


Lazy loading for performance





⚙️ Environment Variables
Frontend (client/.env)
VITE_CLERK_PUBLISHABLE_KEY=your_key
VITE_SERVER_URL=https://your-backend-url

Backend (server/.env)
CLERK_SECRET_KEY=your_key
DATABASE_URL=your_neon_db_url
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
OPENAI_API_KEY=your_key


🛠️ Local Setup
1️⃣ Clone the repository
git clone https://github.com/Akanksh0301/QuickAI.git
cd QuickAI

2️⃣ Install dependencies
cd client
npm install

cd ../server
npm install

3️⃣ Run locally
# Frontend
cd client
npm run dev

# Backend
cd server
npm run dev


🚀 Deployment


Frontend deployed separately on Vercel


Backend deployed as Vercel Serverless Functions


Database hosted on Neon


Images served via Cloudinary



🧠 Future Improvements


Pagination for community feed


Search & filters


AI credit system


Admin moderation panel



👩‍💻 Author
Akanksha Chougule
GitHub: https://github.com/Akanksh0301


