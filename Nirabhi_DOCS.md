# Nirabhi AI - Project Documentation

**Version:** 1.0.0
**Status:** Hackathon-Ready Full-Stack MVP

## 1. Project Overview

Nirabhi AI is a Community Intelligence Platform designed to transform content moderation from a reactive chore into a proactive, human-centric strategy. It leverages the Google Gemini API to provide moderators with powerful tools to analyze content, automate actions, and gain insights into community health.

The core philosophy is not to replace human moderators, but to empower them with a "Co-pilot" that handles the tedious parts of the job, allowing them to focus on nuanced decisions and community engagement.

## 2. Core Features

The platform is built on three pillars:

*   **The Co-pilot (Triage Dashboard):** An interactive dashboard where moderators can paste content for analysis. It provides AI-powered insights, highlighting problematic phrases and categorizing potential violations for rapid review.
*   **The Guard (Automation Engine):** A server-side, rules-based engine that allows administrators to define custom automation. If the AI detects a specific category (e.g., "SPAM"), The Guard can automatically take a pre-defined action (e.g., "BLOCK"), ensuring consistent enforcement of clear-cut policies.
*   **The Analyst (Analytics Summary):** A dashboard component that provides a high-level overview of the analyzed content and the actions taken by The Guard. It helps moderators and managers spot trends and measure the overall health of the content batch.

## 3. Architecture Deep Dive

Nirabhi AI is a full-stack monorepo application, ensuring a clean separation of concerns and enhanced security.

*   **`./backend` (The Brain):**
    *   **Stack:** Node.js, Express, TypeScript.
    *   **Responsibilities:**
        *   **Security:** Securely manages the `API_KEY` in an `.env` file, ensuring it is never exposed to the client.
        *   **API Proxy:** Acts as the sole intermediary between the frontend and the Google Gemini API.
        *   **Business Logic:** Contains the core logic for "The Guard," including storing and executing automation rules.
        *   **API Server:** Exposes a set of RESTful endpoints for the frontend to consume.

*   **`./frontend` (The Face):**
    *   **Stack:** React, TypeScript, Tailwind CSS.
    *   **Responsibilities:**
        *   **User Interface:** Renders all UI components, including the Home page and the interactive Dashboard.
        *   **State Management:** Manages the application's client-side state (e.g., loading states, user input, API results).
        *   **User Experience:** Provides a polished, responsive, and intuitive experience for the moderator.

*   **Data Flow (A User's Journey):**
    1.  A moderator pastes content into the textarea on the **frontend** and clicks "Analyze Content."
    2.  The frontend makes a `POST` request to its own **backend** at `/api/analyze`.
    3.  The **backend** receives the request. It then calls the Google Gemini API, including the secret `API_KEY`.
    4.  After Gemini responds, the **backend** runs the server-side "Guard" simulation, comparing the AI's analysis against the stored rules.
    5.  The **backend** bundles the AI analysis and the simulation report into a single JSON object and sends it back to the **frontend**.
    6.  The **frontend** receives the combined data and updates the UI to display the "Triage Results" and "Analytics Summary."

## 4. Local Development Setup

Follow these steps to run the project on your local machine.

**Prerequisites:**
*   Node.js (v18 or later)
*   npm (or yarn/pnpm)

**Instructions:**

You will need **two terminal windows**.

**Terminal 1: Run the Backend**
```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create a file named .env in this directory and add your key
#    The file should contain one line:
#    API_KEY=YOUR_GEMINI_API_KEY_HERE

# 4. Start the server
npm start
```
> The backend will now be running on `http://localhost:3001`.

**Terminal 2: Run the Frontend**
```bash
# 1. If you don't have the 'serve' package, install it globally
npm install -g serve

# 2. From the project's ROOT directory, run the following command
serve -s frontend
```
> The frontend will be available at a URL like `http://localhost:3000`. Open this in your browser.

## 5. API Reference

The backend exposes the following endpoints:

*   **`POST /api/analyze`**: The core analysis endpoint.
    *   **Request Body:** `{ "lines": ["comment 1", "comment 2"] }`
    *   **Response Body:** `{ "analysis": [AnalysisResult], "simulation": [SimulatedAction] }`

*   **`GET /api/rules`**: Fetches all automation rules.
    *   **Response Body:** `[Rule]`

*   **`POST /api/rules`**: Creates a new automation rule.
    *   **Request Body:** `{ "category": "SPAM", "action": "BLOCK" }`
    *   **Response Body:** `Rule`

*   **`DELETE /api/rules/:id`**: Deletes a rule by its ID.
    *   **Response:** `204 No Content`

## 6. Strategic Roadmap (The Future of Nirabhi)

This MVP is the foundation. The following roadmap outlines the path to a market-leading product.

#### Phase 1: Deepening Core Functionality
1.  **The Live Sentinel (Real-time Moderation):** Integrate with WebSockets to create a live dashboard that analyzes content from chat rooms or comment sections as it appears in real-time.
2.  **Advanced Analytics & Trend Reporting:** Create a dedicated "Analyst" page with time-series graphs (e.g., violations over time), heatmaps (most triggered rules), and AI-generated weekly "Community Health" summaries.

#### Phase 2: Expanding Capabilities
3.  **The Multimedia Guard (Image & Video Moderation):** Leverage multimodal models to extend analysis capabilities to images and videos, flagging visual policy violations.
4.  **The Reputation Engine:** Implement a user-scoring system that tracks violation history. Content from low-trust users could be automatically escalated for high-priority review.

#### Phase 3: Enterprise & Integration
5.  **Closing the Loop (Platform Integration):** Develop API connectors for platforms like Discord, Discourse, etc., allowing moderators to take action (delete, warn, ban) directly from the Nirabhi dashboard.
6.  **The Chameleon (Custom Fine-Tuning):** For enterprise clients, offer the ability to fine-tune the AI model on their specific community's historical data and unique guidelines for unparalleled accuracy.

## 7. Contribution & Maintenance

*   **Code Style:** The project uses TypeScript for both frontend and backend. Please adhere to the existing code style and patterns.
*   **Adding Features:** Follow the established architecture. A new feature will likely involve creating or modifying a backend endpoint and then building the corresponding UI component on the frontend to consume it.
*   **Security:** Never commit the `.env` file or any secret keys to version control. The `.gitignore` file is configured to prevent this.
