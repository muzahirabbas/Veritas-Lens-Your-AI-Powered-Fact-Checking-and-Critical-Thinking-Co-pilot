import '../index.css'; // This is the corrected path
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';

let veritasIcon = null;
let veritasRoot = null;
let currentSelection = '';

function removeVeritasUI() {
  if (veritasIcon) {
    veritasIcon.remove();
    veritasIcon = null;
  }
  if (veritasRoot) {
    veritasRoot.remove();
    veritasRoot = null;
  }
}

function showVeritasIcon(x, y) {
  removeVeritasUI();

  veritasIcon = document.createElement('div');
  veritasIcon.id = 'veritas-lens-icon';
  veritasIcon.style.position = 'absolute';
  veritasIcon.style.left = `${x}px`;
  veritasIcon.style.top = `${y}px`;
  veritasIcon.style.zIndex = '999998';
  veritasIcon.style.cursor = 'pointer';
  veritasIcon.style.width = '32px';
  veritasIcon.style.height = '32px';
  veritasIcon.style.borderRadius = '50%';
  veritasIcon.style.backgroundColor = '#2C3E50';
  veritasIcon.style.display = 'flex';
  veritasIcon.style.alignItems = 'center';
  veritasIcon.style.justifyContent = 'center';
  veritasIcon.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F8F9FA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4Z"/><path d="M12 12h.01"/><path d="M12 17h.01"/></svg>`;
  veritasIcon.innerHTML = svgIcon;

  veritasIcon.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    openSidePanel(currentSelection);
  });

  document.body.appendChild(veritasIcon);
}

function openSidePanel(selection) {
  removeVeritasUI();

  veritasRoot = document.createElement('div');
  veritasRoot.id = 'veritas-lens-root';
  document.body.appendChild(veritasRoot);

  const root = createRoot(veritasRoot);
  root.render(
    <React.StrictMode>
      <App
        initialSelection={selection}
        analysisMode="text"
        onClose={closeSidePanel}
      />
    </React.StrictMode>
  );
}

function closeSidePanel() {
  removeVeritasUI();
}

document.addEventListener('mouseup', (e) => {
  if (e.target.closest('#veritas-lens-root, #veritas-lens-icon')) {
    return;
  }

  setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 15 && selectedText.length < 2000) {
      currentSelection = selectedText;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      showVeritasIcon(rect.right + window.scrollX + 5, rect.top + window.scrollY);
    } else {
      if (veritasIcon) {
        removeVeritasUI();
      }
    }
  }, 10);
});

document.addEventListener('mousedown', (e) => {
    if (veritasIcon && !e.target.closest('#veritas-lens-icon')) {
        removeVeritasUI();
    }
});