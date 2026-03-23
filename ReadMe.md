# TaskTrack Server
 
A Node.js + Express backend for the TaskTrack project management application.
 
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
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/users/register` | Auth | Register new user in Firestore |
| GET | `/users/me` | Auth | Get current user profile |

## Middleware
 
### authMiddleware
- Verifies Firebase Bearer token
- Attaches decoded user to `req.user`
- Returns 401 if token is missing or invalid
 
### adminMiddleware
- First runs authMiddleware
- Checks if user role is `admin` in Firestore
- Returns 403 if user is not an admin
 
## Firestore Collections
 
### users
```
{
  uid: "firebase_user_id",
  email: "user@email.com",
  role: "employee" | "admin"
}
```
 
## Security
 
- Never commit `serviceAccountKey.json`
- Never commit `.env`
- Both are already added to `.gitignore`
 
## Available Scripts
 
```bash
npm start    # Start server
npm run dev  # Start with nodemon (auto-restart)
```