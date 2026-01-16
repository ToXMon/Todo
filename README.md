# Todo App with Deadlines

A full-stack todo application with deadline tracking and email notifications. Built with Node.js, React, and PostgreSQL (Supabase).

## Features

- ✅ Create, Read, Update, Delete todos (CRUD)
- 📅 Deadline management with date/time picker
- 🎯 Priority levels (High, Medium, Low)
- 📊 Status tracking (Pending, In Progress, Completed)
- 🔔 Email notifications for upcoming and overdue deadlines
- 📱 Mobile-responsive design
- 🔍 Filter and sort by status, priority, and due date

## Tech Stack

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Supabase)
- **Email**: Nodemailer
- **Deployment**: Vercel

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── jobs/           # Cron jobs (notifications)
│   │   └── index.js        # Entry point
│   └── database/
│       └── schema.sql      # Database schema
├── frontend/
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # React components
│   │   ├── context/        # React context (state)
│   │   └── styles/         # CSS styles
│   └── index.html
└── vercel.json             # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier available)
- Gmail account or SMTP service for emails

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `backend/database/schema.sql`
3. Copy your project URL and anon key from Settings > API

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

FRONTEND_URL=http://localhost:5173
```

**Gmail Setup**: Enable 2FA and create an [App Password](https://support.google.com/accounts/answer/185833).

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run Development Server

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` to use the app.

### 5. Run Notification Job (Optional)

```bash
cd backend
npm run notify
```

This runs the email notification checker (checks every hour).

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repo
2. Add environment variables in Settings > Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `EMAIL_FROM`
3. Deploy!

### 3. Set up Notifications (Vercel Cron)

For production notifications, set up a Vercel Cron job or use an external service like:
- Vercel Cron (requires Pro plan)
- GitHub Actions scheduled workflow
- External cron service (cron-job.org)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get single todo |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |
| GET | `/api/todos/due-soon` | Get todos due in 24h |
| GET | `/api/todos/overdue` | Get overdue todos |
| POST | `/api/users/login` | Login/register user |

## License

MIT