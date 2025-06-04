import React from 'react';

const typeOptions: Record<string, { label: string; count: number }[]> = {
  'Smart Watches': [
    { label: 'Bluetooth', count: 930 },
    { label: 'LTE', count: 46 },
    { label: 'GPS', count: 11 },
  ]
};

interface DynamicTypeFilterBoxProps {
  category: string;
  selectedTypes?: string[];
  onTypeChange?: (types: string[]) => void;
}

const DynamicTypeFilterBox: React.FC<DynamicTypeFilterBoxProps> = ({ category, selectedTypes = [], onTypeChange }) => {
  const handleTypeChange = (type: string) => {
    if (onTypeChange) {
      const newTypes = selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type];
      onTypeChange(newTypes);
    }
  };

  const clearSelection = () => {
    if (onTypeChange) {
      onTypeChange([]);
    }
  };

  const types = typeOptions[category] || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Connectivity</h3>
      {selectedTypes.length > 0 ? (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
          <span className="text-sm">{selectedTypes.join(', ')}</span>
          <button onClick={clearSelection} className="text-blue-600 text-xs">
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