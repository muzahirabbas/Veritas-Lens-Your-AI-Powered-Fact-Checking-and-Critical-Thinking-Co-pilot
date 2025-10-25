# Veritas Lens: Your AI-Powered Fact Checker and Critical Thinking Co-pilot

Veritas Lens is a sophisticated browser extension that acts as an AI-powered co-pilot for the modern web user. It transforms passive online consumption into an active, critical engagement with information by providing on-demand fact-checking, source analysis, and nuanced counterarguments for any text you select online.

## \#\# Why It Matters

In an era of information overload and rampant misinformation, the ability to think critically about what we read is more important than ever. Veritas Lens is designed to empower every user with the tools of a professional fact-checker. It encourages you to question what you read, understand diverse perspectives, and cultivate a more nuanced and informed worldview, turning your browser into a tool for digital enlightenment.

-----

## \#\# Core Features

  * **On-Demand Verifier**: Highlight any sentence or claim on a webpage, and the Verifier engine will analyze it, provide a "Veracity Score" on a scale from 0 to 100, summarize its findings, and present the high-authority sources it used for verification.
  * **The Dialectic Engine**: Go beyond true or false. For any statement you highlight, the Dialectic Engine generates multiple, well-reasoned counterarguments from diverse perspectives (e.g., economic, ethical, social), helping you understand the complexity and nuance behind any topic.
  * **Source Trust Score**: The extension icon in your toolbar acts as an ambient, at-a-glance rating of the current website's trustworthiness, changing color based on a curated index of sources.
  * **YouTube In-Video Verifier**: Activate Veritas Lens on any YouTube video with a transcript to extract a list of the main factual claims made in the video. You can then fact-check each claim individually.

-----

## \#\# Amazing Use Cases

  * **For Students:** Instantly vet sources for a research paper. Generate counterarguments to find weaknesses in your own thesis and strengthen your arguments.
  * **For Professionals:** Quickly fact-check claims in industry news, market reports, or articles shared by colleagues before making critical decisions.
  * **For Everyday News Consumers:** Uncover potential bias in a political article, verify a startling headline before sharing it, or simply gain a deeper understanding of a complex global event.
  * **For the Curious Mind:** Challenge your own beliefs by highlighting a statement you agree with and asking the Dialectic Engine to provide intelligent counterpoints.

-----

## \#\# Tech Stack

  * **Frontend**: [React.js](https://reactjs.org/) (with Vite), [Tailwind CSS](https://tailwindcss.com/)
  * **Backend**: [Flask](https://flask.palletsprojects.com/) (Python)
  * **AI Engine**: Google's [Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/) via the official Python SDK.
  * **Browser Compatibility**: Built with WebExtension APIs for Chrome, Firefox, and other Chromium-based browsers.
  * **Deployment**: The backend is containerized with [Docker](https://www.docker.com/) for easy deployment on services like [Google Cloud Run](https://cloud.google.com/run).

-----

## \#\# Getting Started (Local Development)

Follow these steps to get Veritas Lens running on your local machine.

### \#\#\# Prerequisites

  * [Node.js](https://nodejs.org/) (v18 or later)
  * [Python](https://www.python.org/) (v3.9 or later) & Pip
  * [Docker Desktop](https://www.docker.com/products/docker-desktop/) (required for deployment, optional for local setup)
  * A **Google Gemini API Key**. Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### \#\#\# 1. Backend API Setup (Flask)

1.  **Navigate to the backend directory:**
    ```bash
    cd api-backend
    ```
2.  **Create and activate a virtual environment:**
3.  
    ```bash
    # Create the environment
    python -m venv venv
    # Activate it (macOS/Linux)
    source venv/bin/activate
    # Activate it (Windows)
    venv\Scripts\activate
    ```
4.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5.  **Set up environment variables:**
      * Create a `.env` file by copying the example: `cp .env.example .env` (or `copy` on Windows).
      * Open the `.env` file and paste in your Gemini API key.
6.  **Run the Flask server:**
    ```bash
    flask run
    ```
    The API will now be running at `http://127.0.0.1:5000`. Keep this terminal open.

### \#\#\# 2. Frontend Extension Setup (React)

1.  **Open a new terminal** and navigate to the frontend directory:
    ```bash
    cd extension-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Build the extension and watch for changes:**
    ```bash
    npm run build:watch
    ```
    This will create a `dist` folder and automatically rebuild it when you save changes. Keep this terminal open.

### \#\#\# 3. Loading the Extension in Your Browser

1.  Open Chrome/Edge and navigate to `chrome://extensions` or Firefox and navigate to `about:debugging`.
2.  Enable **"Developer mode"** (usually a toggle in the top-right corner).
3.  Click **"Load unpacked"** (or "Load Temporary Add-on" in Firefox).
4.  Select the `veritas-lens/extension-frontend/dist` folder.
5.  The Veritas Lens icon will appear in your toolbar, and the extension is now active\!

-----

## \#\# Deployment

### \#\#\# Backend Deployment (Google Cloud Run)

The API is ready to be deployed as a Docker container.

1.  **Build the Docker Image:** From the `api-backend` directory, run:
    ```bash
    docker build -t veritas-lens-api .
    ```
2.  **(Optional) Test the container locally:**
    ```bash
    docker run -p 8080:8080 -e GEMINI_API_KEY="YOUR_API_KEY" veritas-lens-api
    ```
3.  **Deploy to Google Cloud Run:**
      * Follow the [Google Cloud guide](https://www.google.com/search?q=https://cloud.google.com/run/docs/deploying-source-code%23container) to push your container image to Google's Artifact Registry and deploy the image as a service.
      * **Crucially**, during the setup process, you must configure the service to use a **secret** for the `GEMINI_API_KEY` environment variable. This ensures your key is never exposed.
      * Once deployed, Cloud Run will give you a public URL for your API.

### \#\#\# Frontend Deployment (Extension Stores)

1.  **Update the API URL:** In the frontend code (e.g., `src/components/SidePanel.jsx`), change the `API_BASE_URL` from `http://127.0.0.1:5000` to your public Google Cloud Run URL.
2.  **Create a production build:** In the `extension-frontend` directory, run:
    ```bash
    npm run build
    ```
3.  **Package the extension:**
      * Open the `extension-frontend/dist` folder.
      * Select all the files and folders inside it and compress them into a `.zip` file.
      * This `.zip` file is what you will upload to the Chrome Web Store, Firefox Browser ADD-ONS, etc.

-----

## \#\# Future Roadmap

Veritas Lens is just getting started. Potential future features include:

  * **User Accounts & History:** Allow users to sign in and save a history of their verifications.
  * **Wider Platform Support:** Integrate with other platforms like X (Twitter), Facebook, and specific news sites.
  * **Advanced Analysis:** Offer deeper analysis on logical fallacies, author tone, and statistical claims.
  * **Swappable AI Models:** Allow users to choose between different AI models (e.g., models focused on brevity, detail, or specific domains).
