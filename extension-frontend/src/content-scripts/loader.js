(async () => {
  const currentUrl = window.location.href;
  let mainScriptModulePath;

  // These paths now correctly point to the output 'scripts' folder
  if (currentUrl.includes('youtube.com/watch')) {
    mainScriptModulePath = 'scripts/content-scripts/youtubeInjector.js';
  } else {
    mainScriptModulePath = 'scripts/content-scripts/content.js';
  }

  try {
    await import(chrome.runtime.getURL(mainScriptModulePath));
  } catch (error) {
    console.error("Veritas Lens Error: Failed to load main module.", error);
    console.error("Attempted to load:", mainScriptModulePath); // Added for easier debugging
  }
})();