# Student Mark Analysis System

A comprehensive full-stack web application for managing and analyzing student marks in engineering colleges. Built with React, Node.js/Express, and PostgreSQL.

## Overview

The Student Mark Analysis System provides a centralized platform for:
- **Students**: View marks, analyze performance, track GPA, and generate performance reports
- **Teachers**: Enter and manage student marks, analyze subject performance, and track class statistics
- **Administrators**: Manage users, generate reports, analyze GPA distribution, identify top performers and struggling students

## Features

### Student Features
- View all marks across subjects and exams
- Performance analysis dashboard with GPA tracking
- Visual charts for grade distribution
- Personal statistics and progress tracking

### Teacher Features
- Easy mark entry interface for students
- Subject-wise performance analysis
- Class statistics and student rankings
- Mark correction and update capabilities

### Admin Features
- User management (create/edit students and teachers)
- Subject management
- Comprehensive reporting system:
  - GPA reports with CGPA calculations
  - Student marks reports
  - Failed students identification
  - Top performers ranking
  - System-wide statistics

## Tech Stack

### Frontend
- **React** 19.2.4 - UI framework
- **Vite** 8.0.0 - Build tool and dev server
- **Axios** 1.13.6 - HTTP client
- **CSS3** - Responsive styling with gradient designs

### Backend
- **Node.js** with **Express** 4.18.2 - REST API server
- **PostgreSQL** 8.11 - Relational database (Neon serverless)
- **JWT** 9.0.2 - Authentication and authorization
- **bcryptjs** 2.4.3 - Password hashing
- **Helmet** 7.0.0 - Security headers
- **Express Rate Limit** 7.0.0 - API rate limiting

### Database
- **Neon PostgreSQL** - Serverless, encrypted, always on

## Prerequisites

- Node.js 14+ and npm
- PostgreSQL connection string (Neon or local PostgreSQL)
- Git

## Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd student_mark_analysis
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Environment Setup

#### Backend Configuration (`server/.env`)
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
JWT_SECRET=your-secret-key-minimum-32-characters
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend Configuration
Create `.env` in root directory:
```
VITE_API_URL=http://localhost:5000/api
```

### 5. Database Setup
```bash
cd server
npm run seed
cd ..
```

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin@123` |
| Teacher | `teacher1` | `teacher@123` |
| Student | `student1` | `student@123` |

## Deployment

For detailed deployment instructions, see:
- [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) - Environment variable setup for Vercel + Render
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide with 3 options

### Quick Deploy (Vercel + Render)

1. **Backend on Render**: See [DEPLOYMENT.md](./DEPLOYMENT.md#option-2-render--vercel-frontend--backend-separate)
2. **Frontend on Vercel**: See [DEPLOYMENT.md](./DEPLOYMENT.md#option-2-render--vercel-frontend--backend-separate)

## Project Structure

```
student_mark_analysis/
├── server/                 # Backend API
│   ├── controllers/        # Route controllers
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, validation, error handling
│   ├── config/             # Database configuration
│   ├── utils/              # Helper functions (GPA, JWT, password)
│   └── index.js            # Express server entry point
├── src/                    # Frontend React app
│   ├── components/         # React components
│   │   ├── admin/          # Admin-only pages
│   │   ├── student/        # Student-only pages
│   │   └── teacher/        # Teacher-only pages
│   ├── context/            # React Context (Authentication)
│   ├── styles/             # CSS files
│   ├── utils/              # API client, utilities
│   └── main.jsx            # React entry point
├── public/                 # Static assets
├── ENV_SETUP_GUIDE.md     # Environment variable guide
├── DEPLOYMENT.md          # Deployment documentation
└── package.json           # Project dependencies
```

## API Documentation

For complete API endpoint documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Key Endpoints

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

**Admin:**
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/report` - All marks report
- `GET /api/admin/gpa-report` - GPA calculations
- `GET /api/admin/failed-students` - Failed students list
- `GET /api/admin/top-performers` - Top performers ranking

**Student:**
- `GET /api/student/marks` - View student marks
- `GET /api/student/performance` - Performance analytics

**Teacher:**
- `POST /api/teacher/marks` - Enter marks
- `GET /api/teacher/class-analysis` - Class statistics

## Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
cd server
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start server
npm run seed         # Seed test data
```

## Features Documentation

- [GPA Calculator Implementation](./GPA_CALCULATOR_IMPLEMENTATION.md) - How GPA calculations work
- [System Documentation](./SYSTEM_FIXED.md) - System improvements and fixes
- [Testing Guide](./TESTING.md) - Testing procedures and scenarios

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Features

- JWT-based authentication with 32+ character secret
- Password hashing with bcryptjs
- SQL injection prevention with parameterized queries
- CORS protection
- Rate limiting on API endpoints
- Helmet security headers
- SSL/TLS encryption for database connections

## Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Database connection failed
1. Verify `DATABASE_URL` in `server/.env`
2. Check PostgreSQL connection string format
3. Ensure SSL mode is enabled for Neon

### Frontend can't reach backend
1. Verify `VITE_API_URL` is set correctly
2. Check backend is running on port 5000
3. Clear browser cache and restart dev server

### Marks not displaying
1. Check database connection
2. Verify test data was seeded: `npm run seed`
3. Check browser console for API errors

## Performance Optimization

- React Vite build optimized (~400KB production bundle)
- Database connection pooling for Neon
- API response caching for read-only endpoints
- Lazy loading of components

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check [TROUBLESHOOTING.md](./TESTING.md) section
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. Check browser console for error messages
4. Verify environment variables are set correctly

## Version

Current Version: 1.0.0

Last Updated: March 2026
