
import React from 'react';

const VeracityScale = ({ score, label }) => {
  const getScoreColor = (s) => {
    if (s < 25) return 'bg-red-500'; // Highly Misleading
    if (s < 50) return 'bg-yellow-500'; // Mostly False / Requires Context
    if (s < 75) return 'bg-green-400'; // Largely True
    return 'bg-green-600'; // Highly Accurate
  };

  const colorClass = getScoreColor(score);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Veracity Score: {score}/100</span>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${colorClass}`}>{label}</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default VeracityScale;
