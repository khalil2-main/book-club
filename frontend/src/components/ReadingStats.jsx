import React from 'react';

const Stat = ({label, value}) => (
  <div className="bg-white rounded-lg p-4 shadow text-center">
    <div className="text-2xl font-bold text-indigo-600">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const ReadingStats = ({stats}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Stat label="Livres lus" value={stats.booksRead} />
      <Stat label="Pages lues" value={stats.pagesRead} />
      <Stat label="Heures lues" value={stats.hoursRead} />
    </div>
  );
}

export default ReadingStats;