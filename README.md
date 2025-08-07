# Nirabhi AI Content Moderator - Full Stack

This project has been architected as a full-stack application with a secure backend and a reactive frontend.

## Project Structure

- **/frontend**: Contains the React single-page application. This is the user interface that runs in the browser.
- **/backend**: Contains the Node.js/Express server. This server acts as a secure proxy, handling all communication with the Google Gemini API.

## How to Run

You will need to run two processes in separate terminals for the application to work correctly.

### 1. Running the Backend Server

The backend server is responsible for securely handling the API key and communicating with the Gemini API.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the 'backend' directory
# and add your Google API Key:
# API_KEY=YOUR_API_KEY_HERE

# Start the server
npm start
```
The backend will be running on `http://localhost:3001`.

### 2. Running the Frontend Application

The frontend is a standard React application. You can serve its `index.html` file using any static server. For development, a common tool is `serve`.

```bash
# If you don't have 'serve' installed globally:
npm install -g serve

# Navigate to the project root and serve the frontend directory
serve -s frontend
```
The frontend will typically be available at `http://localhost:3000`. You can then open this address in your web browser to use the application.

## How It Works

1.  The user interacts with the React **frontend**.
2.  When "Analyze Content" is clicked, the frontend sends the text to the **backend** at `http://localhost:3001/api/analyze`.
3.  The **backend** receives this request, securely adds the `API_KEY` from its environment variables, and calls the Google Gemini API.
4.  The Gemini API returns the analysis to the **backend**.
5.  The **backend** forwards the results back to the **frontend**, which then displays them to the user.

This architecture ensures that your `API_KEY` is never exposed to the public internet, which is a critical security best practice.
