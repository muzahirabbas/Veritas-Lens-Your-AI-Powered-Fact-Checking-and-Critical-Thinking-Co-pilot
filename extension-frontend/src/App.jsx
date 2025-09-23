import React from 'react';
import SidePanel from './components/SidePanel';

function App({ initialSelection, analysisMode, transcript, onClose }) {
  return (
    <div className="fixed top-0 right-0 h-full z-[999999]">
      <SidePanel
        initialSelection={initialSelection}
        analysisMode={analysisMode}
        transcript={transcript}
        onClose={onClose}
      />
    </div>
  );
}

export default App;