# TaskTrack Server

A Node.js + Express backend for the TaskTrack project management application built with Clean Architecture and SOLID principles.

## Tech Stack

- Node.js
- Express
- Firebase Admin SDK
- Firestore Database
- dotenv

## Getting Started

### Prerequisites

- Node.js v16+
- npm
- Firebase project setup
- Firebase service account key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/tasktrack-server.git
cd tasktrack-server
```

2. Install dependencies:
```bash
npm install
```

3. Add your Firebase service account key:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate a new private key
   - Rename it to `serviceAccountKey.json`
   - Place it in the root of `tasktrack-server/`

4. Create a `.env` file in the root directory:
```
PORT=5000
```

5. Start the server:
```bash
node index.js
```

Or with auto-restart using nodemon:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Clean Architecture

This project follows Clean Architecture and SOLID principles.

```
Request
  → Route        (URL path + middleware)
    → Controller (req/res handling + input sanitization)
      → Service  (business logic)
        → Model  (Firestore queries)
          → Firestore
```

### SOLID Principles Applied

| Principle | Implementation |
|-----------|---------------|
| Single Responsibility | Each class has one job — Model for DB, Service for logic, Controller for req/res |
| Open/Closed | BaseModel and BaseController can be extended without modification |
| Liskov Substitution | UserModel and TaskModel extend BaseModel and work as drop-in replacements |
| Interface Segregation | UserController only handles users, TaskController only handles tasks |
| Dependency Inversion | Firebase config injected via firebase.config.js |

## API Endpoints

### Users

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| POST | `/users/register` | authMiddleware | Register new user in Firestore |
| GET | `/users/me` | authMiddleware | Get current user profile |
| GET | `/users` | adminMiddleware | Get all users (admin only) |

### Tasks

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| POST | `/tasks` | adminMiddleware | Create new task |
| GET | `/tasks` | adminMiddleware | Get all tasks |
| GET | `/tasks/stats/summary` | adminMiddleware | Get task counts by status (total, inProgress, completed, pending, completionRate) |
| GET | `/tasks/stats/monthly` | adminMiddleware | Get monthly task breakdown for last 6 months |
| PUT | `/tasks/:taskId/assign` | adminMiddleware | Assign task to employee |
| GET | `/tasks/my` | authMiddleware | Get logged-in user's tasks |
| PUT | `/tasks/:taskId/status` | authMiddleware | Update task status |

## Middleware

### authMiddleware
- Verifies Firebase Bearer token from request headers
- Attaches decoded user to `req.user`
- Returns 401 if token is missing or invalid

### adminMiddleware
- First runs authMiddleware to verify token
- Fetches user document from Firestore
- Checks if `user.role === 'admin'`
- Returns 403 if user is not an admin

## Base Classes

### BaseController
Reusable response methods for all controllers:

```javascript
this.sendSuccess(res, data, status)   // 200 response
this.sendError(res, message, status)  // 500 response
this.sendNotFound(res, message)       // 404 response
this.sendForbidden(res, message)      // 403 response
this.sendBadRequest(res, message)     // 400 response
```

### BaseModel
Reusable Firestore methods for all models:

```javascript
await this.findById(id)       // Get document by ID
await this.findAll()          // Get all documents (with Timestamp conversion)
await this.create(data)       // Create new document
await this.update(id, data)   // Update document
await this.delete(id)         // Delete document
await this.exists(id)         // Check if document exists
```

> **Note:** `findAll()` and `findById()` automatically convert Firestore Timestamps to ISO strings for consistent date handling on the frontend.

## Firestore Collections

### users
```json
{
  "uid": "firebase_user_id",
  "email": "user@email.com",
  "role": "employee | admin"
}
```

### tasks
```json
{
  "title": "Task title",
  "description": "Task description",
  "status": "backlog | in_progress | done",
  "assignedTo": "user_uid | null",
  "assignedEmail": "user@email.com | null",
  "createdAt": "Firestore Timestamp",
  "updatedAt": "Firestore Timestamp | null"
}
```

### activities
```json
{
  "type": "task_created | status_changed",
  "taskId": "task_document_id",
  "taskTitle": "Task title",
  "userEmail": "user@email.com | null",
  "nextStatus": "backlog | in_progress | done | null",
  "createdAt": "Firestore Timestamp"
}
```

## Input Sanitization

All inputs are validated in controllers before reaching services:

| Field | Validation |
|-------|-----------|
| title | Required, cannot be empty |
| description | Required, cannot be empty |
| status | Must be backlog, in_progress, or done |
| userId | Required for task assignment |
| userEmail | Required for task assignment |

## Performance Optimizations

### Backend Aggregation
Instead of sending all raw tasks to the frontend, the server pre-calculates and returns only the needed data:

- `GET /tasks/stats/summary` — returns task counts directly, no frontend counting needed
- `GET /tasks/stats/monthly` — returns pre-grouped monthly data for charts, no frontend grouping needed

### Cache Control
All routes have `no-store` cache headers to ensure polling always receives fresh data:

```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.set('Pragma', 'no-cache')
  next()
})
```

### Timestamp Conversion
All Firestore Timestamps are converted to ISO strings in `BaseModel` to prevent date filtering issues on the frontend:

```javascript
if (d.createdAt?.toDate) d.createdAt = d.createdAt.toDate().toISOString()
if (d.updatedAt?.toDate) d.updatedAt = d.updatedAt.toDate().toISOString()
```

## Security

- Never commit `serviceAccountKey.json`
- Never commit `.env`
- Both are already added to `.gitignore`
- All routes are protected with auth or admin middleware
- Employees can only update their own assigned tasks
- Admin email is captured from verified Firebase token on task creation

## Available Scripts

```bash
npm start    # Start server
npm run dev  # Start with nodemon (auto-restart)
```