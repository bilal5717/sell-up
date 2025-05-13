"use client";
import React, { useState } from 'react';

const typeOptions: Record<string, { label: string; count: number }[]> = {
  Accessories: [
    { label: 'Mobile', count: 930 },
    { label: 'Tablet', count: 46 },
    { label: 'Smart Watch', count: 11 },
  ],
  Earphones: [
    { label: 'Wired', count: 396 },
    { label: 'Wireless', count: 1072 },
  ],
  Chargers: [
    { label: 'USB Type-C', count: 1049 },
    { label: 'IOS', count: 471 },
    { label: 'Others', count: 425 },
    { label: 'Micro-USB/Android', count: 147 },
  ],
  Headphones: [
    { label: 'Wireless', count: 1072 },
    { label: 'Wired', count: 396 },
  ],
  'Covers & Cases': [
    { label: 'Mobile', count: 930 },
    { label: 'Tablet', count: 46 },
    { label: 'Smart Watch', count: 11 },
  ],
  'Charging Cables': [
    { label: 'USB Type-C', count: 149 },
    { label: 'IOS', count: 102 },
    { label: 'Others', count: 83 },
    { label: 'Micro-USB/Android', count: 69 },
  ],
  'Screen Protectors': [
    { label: 'Mobile', count: 62 },
    { label: 'Smart Watch', count: 6 },
    { label: 'Tablet', count: 4 },
  ],
};

const DynamicTypeFilterBox: React.FC<{ category: string }> = ({ category }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Handle Type Selection
  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes((prev) => prev.filter((t) => t !== type));
    } else {
      setSelectedTypes((prev) => [...prev, type]);
    }
  };

  // Clear Selection
  const clearSelection = () => {
    setSelectedTypes([]);
  };

  const types = typeOptions[category] || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Type</h3>

      {/* Display selected types */}
      {selectedTypes.length > 0 ? (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
          <span className="text-sm">{selectedTypes.join(', ')}</span>
          <button
            onClick={clearSelection}
            className="text-blue-600 text-xs"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {types.map((type) => (
            <label key={type.label} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.label)}
                onChange={() => handleTypeChange(type.label)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-sm">
                {type.label} ({type.count})
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicTypeFilterBox;
