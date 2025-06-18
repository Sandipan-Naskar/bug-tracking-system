
# Bug Tracker Application

A comprehensive bug tracking web application built with React, Node.js, and MongoDB.

## Features

### ✅ Implemented Features

#### Task 1: Project Setup
- React frontend with Vite
- User registration and login system
- JWT-based authentication
- CORS handling

#### Task 2: UI & Bug Reporting Features
- **Bug CRUD Operations**: Create, read, update, and delete bug reports
- **Form Validations**: Required fields with proper validation
- **Visual Grouping**: Group bugs by status or severity
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Cards and Badges**: Color-coded severity and status indicators

#### Task 3: AI Tag Generator
- **AI-Powered Tagging**: Automatic tag generation based on bug content
- **Manual Tag Management**: Add, edit, and remove tags
- **Tag-Based Filtering**: Filter bugs by tags
- **Smart Tag Suggestions**: Context-aware tag recommendations

#### Task 4: Dockerization
- **Frontend Dockerfile**: Containerized React application
- **Backend Dockerfile**: Containerized Node.js API
- **Docker Compose**: Complete orchestration with MongoDB
- **Environment Configuration**: Proper environment variable handling

#### Task 5: User Features & Enhancements
- **Pagination**: Efficient handling of large bug lists
- **Advanced Filtering**: Filter by status, severity, assignee, priority
- **Sorting Options**: Sort by date, severity, status, priority, title
- **Browser Notifications**: Real-time notifications for assignments
- **Email Notifications**: Automated email alerts for bug assignments
- **Due Date Tracking**: Cron job for due date reminders

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose
- **AI Integration**: Mock AI service (ready for OpenAI/Groq integration)
- **DevOps**: Docker, Docker Compose
- **Notifications**: Web Notifications API, Nodemailer

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd bug-tracker

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```

### Manual Setup

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend Setup
```bash
npm install
npm run dev
```

## Environment Configuration

Copy `backend/.env.example` to `backend/.env` and configure:

```env
MONGO_URI=mongodb://localhost:27017/bugtracker
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Bugs
- `GET /api/bugs` - Get bugs with pagination and filters
- `POST /api/bugs` - Create new bug
- `PUT /api/bugs/:id` - Update bug
- `DELETE /api/bugs/:id` - Delete bug

## Project Structure

```
bug-tracker/
├── src/                          # Frontend React application
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Main application pages
│   ├── services/               # API and notification services
│   └── types/                  # TypeScript type definitions
├── backend/                     # Node.js API server
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── Dockerfile             # Backend container configuration
├── docker-compose.yml          # Multi-service orchestration
├── Dockerfile                  # Frontend container configuration
└── README.md                   # This file
```

## Features Overview

### Bug Management
- Create detailed bug reports with all necessary fields
- Edit and update bug information
- Delete bugs with confirmation
- Visual status and severity indicators

### Organization & Filtering
- Group bugs by status or severity
- Advanced filtering by multiple criteria
- Sort by various attributes
- Pagination for performance

### Notifications
- Browser push notifications
- Email notifications for assignments
- Due date reminders via cron jobs

### AI Integration
- Automatic tag generation based on bug content
- Smart categorization suggestions
- Enhanced searchability through AI-generated tags

## Development

### Adding New Features
1. Follow the component-based architecture
2. Add proper TypeScript types
3. Implement responsive design
4. Add appropriate tests

### Deployment
The application is fully containerized and ready for deployment on any Docker-compatible platform.

## License

This project is for educational purposes and follows the assignment requirements.
