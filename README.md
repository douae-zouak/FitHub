# FitHub - Modern Fitness E-Commerce & Coaching Platform

A premium fitness platform combining Decathlon-style equipment sales with subscription-based coaching services.

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI Icons:** Lucide React
- **Authentication:** NextAuth.js
- **State Management:** React Context

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + Google OAuth (Passport.js)
- **API:** RESTful architecture

### ML Service
- **Framework:** Flask/FastAPI (Python)
- **Models:** Customer Segmentation + Product Recommendations
- **Integration:** REST API endpoints

## Project Structure

```
project
├── frontend/          # Next.js application
│   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── public/
├── backend/           # Express.js API
│   └── src/
│       ├── config/
│       ├── models/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       └── utils/
└── ml-service/        # Python ML microservice
    ├── models/
    └── api/
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.9+ (for ML service)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### ML Service Setup
```bash
cd ml-service/similarity
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

```bash
cd ml-service/customer_segmentation
python -m venv segenv
source segenv/bin/activate  # On Windows: segenv\Scripts\activate
pip install -r requirements-segmentation.txt
```



