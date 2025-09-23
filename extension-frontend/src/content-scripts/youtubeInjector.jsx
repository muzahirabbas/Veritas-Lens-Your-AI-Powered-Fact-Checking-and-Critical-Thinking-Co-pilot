import '../index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';

const INJECT_BUTTON_ID = 'veritas-lens-youtube-button';
const ROOT_ID = 'veritas-lens-root';

function injectButton() {
  console.log('Veritas Lens: Attempting to inject button...');

  // Check if button already exists
  if (document.getElementById(INJECT_BUTTON_ID)) {
    console.log('Veritas Lens: Button already exists.');
    return;
  }

  // A more robust selector for YouTube's action bar
  const targetContainer = document.querySelector('#actions-inner');

  if (!targetContainer) {
    console.log('Veritas Lens: Target container #actions-inner not found.');
    return;
  }
  
  console.log('Veritas Lens: Found target container:', targetContainer);

  const button = document.createElement('button');
  button.id = INJECT_BUTTON_ID;
  button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m';
  button.style.marginLeft = '8px';
  button.innerHTML = `
    <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
      <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4Z"/><path d="M12 12h.01"/><path d="M12 17h.01"/>
    </svg>
    Verify
  `;

  button.addEventListener('click', handleVerifyClick);
  
  // Prepending to the main actions container
  targetContainer.prepend(button);
  console.log('Veritas Lens: Button injected successfully!');
}

async function handleVerifyClick() {
  const transcriptText = getTranscriptText();

  if (!transcriptText) {
    alert("Veritas Lens could not find an open transcript on this page. Please open the video transcript ('Show transcript' from the '...' menu) and try again.");
    return;
  }

  openSidePanel(transcriptText);
}

function getTranscriptText() {
    const transcriptSegments = document.querySelectorAll('ytd-transcript-segment-renderer .segment-text');
    if (transcriptSegments.length === 0) {
        return null;
    }
    
    let fullText = '';
    transcriptSegments.forEach(segment => {
        fullText += segment.innerText + ' ';
    });

    return fullText.trim();
}

function openSidePanel(transcript) {
  closeSidePanel(); 
  const veritasRoot = document.createElement('div');
  veritasRoot.id = ROOT_ID;
  document.body.appendChild(veritasRoot);

  const root = createRoot(veritasRoot);
  root.render(
    <React.StrictMode>
      <App 
        analysisMode="youtube"
        transcript={transcript}
        onClose={closeSloidePanel} 
      />
    </React.StrictMode>
  );
}

function closeSidePanel() {
  const veritasRoot = document.getElementById(ROOT_ID);
  if (veritasRoot) {
    veritasRoot.remove();
  }
}

// Use a MutationObserver to wait for the YouTube UI to be ready
const observer = new MutationObserver(() => {
  if (document.querySelector('#actions-inner') && !document.getElementById(INJECT_BUTTON_ID)) {
    injectButton();
    // Once injected, we don't need to keep observing
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

console.log('Veritas Lens: YouTube Injector Loaded and observing.');