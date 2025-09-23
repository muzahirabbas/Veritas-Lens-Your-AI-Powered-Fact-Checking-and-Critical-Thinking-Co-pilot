
// This file is the entry point for Vite's dev server, but it's not directly
// used by the extension's content scripts. The content scripts (`content.js` and `youtubeInjector.js`)
// create their own React roots and render the <App /> component directly into the page.
// This setup allows us to use Vite for development while ensuring the extension
// injects its UI correctly on live websites.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// This is for the dev environment only (e.g., when running `npm run dev`)
// to see the component on a blank page.
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        {/* Simulating a text selection for dev preview */}
        <App initialSelection={"The Earth is flat."} onClose={() => console.log("Close clicked")} />
      </React.StrictMode>,
    )
}
