"use client";
import React, { useState } from 'react';

const conditions = ['New', 'Used', 'Open Box', 'Refurbished', 'For Parts'];

const ConditionSelectBox: React.FC = () => {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  // Handle Condition Change
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCondition(e.target.value);
  };

  // Clear Condition
  const clearCondition = () => {
    setSelectedCondition(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Condition</h3>
      
      {/* Display selected condition */}
      {selectedCondition ? (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
          <span className="text-sm">{selectedCondition}</span>
          <button
            onClick={clearCondition}
            className="text-blue-600 text-xs"
          >
            Change
          </button>
        </div>
      ) : (
        <select
          className="w-full border rounded p-2 text-gray-700 text-sm"
          value={selectedCondition || ''}
          onChange={handleConditionChange}
        >
          <option value="" disabled>Select Condition</option>
          {conditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ConditionSelectBox;
