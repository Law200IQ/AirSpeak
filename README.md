# YallahLive Voice Chat Application

A real-time voice chat application built with React, Node.js, and Socket.IO.

## Project Structure
- `/backend` - Node.js/Express backend server
- `/src` - React frontend application

## Deployment Instructions

### Backend Deployment
1. Create an account on your preferred hosting platform (Heroku, Railway, or Render)
2. Create a new web service
3. Set the following environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: Port for the server (usually set automatically by the platform)
   - `NODE_ENV`: Set to "production"
4. Connect your GitHub repository and deploy the backend directory

### Frontend Deployment
1. Create an account on Vercel or Netlify
2. Connect your GitHub repository
3. Set the build settings:
   - Build command: `npm run build`
   - Output directory: `build`
4. Set environment variables:
   - `REACT_APP_API_URL`: Your backend server URL

## Local Development
1. Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Frontend:
   ```bash
   npm install
   npm start
   ```
