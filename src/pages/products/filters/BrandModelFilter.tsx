"use client";
import React, { useState } from 'react';

interface Brand {
  name: string;
  count: number;
  models: string[];
}

const brandOptions: Record<string, Brand[]> = {
  Mobiles: [
    { name: 'Apple iPhone', count: 73899, models: ['iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone SE'] },
    { name: 'Samsung Mobile', count: 21646, models: ['Galaxy S21', 'Galaxy Note 20', 'Galaxy A52'] },
    { name: 'Infinix', count: 12032, models: ['Note 10', 'Hot 11', 'Zero X Pro'] },
    { name: 'Vivo', count: 11539, models: ['V21', 'Y51', 'X60 Pro'] },
    { name: 'Google', count: 9400, models: ['Pixel 6', 'Pixel 5', 'Pixel 4a'] },
    { name: 'Xiaomi', count: 9085, models: ['Redmi Note 10', 'Mi 11', 'Poco X3'] },
  ],
  'Smart Watch': [
    { name: 'Apple', count: 1230, models: ['Watch Series 7', 'Watch SE', 'Watch Series 6'] },
    { name: 'Samsung', count: 539, models: ['Galaxy Watch 4', 'Galaxy Fit 2'] },
    { name: 'Mi', count: 239, models: ['Mi Band 6', 'Mi Watch Lite'] },
    { name: 'Fitbit', count: 69, models: ['Charge 5', 'Versa 3', 'Inspire 2'] },
    { name: 'Garmin', count: 65, models: ['Forerunner 55', 'Vivoactive 4'] },
  ],
  Tablets: [
    { name: 'Apple', count: 2274, models: ['iPad Pro', 'iPad Air', 'iPad Mini'] },
    { name: 'Samsung', count: 872, models: ['Galaxy Tab S7', 'Galaxy Tab A7'] },
    { name: 'Lenovo', count: 315, models: ['Tab M10', 'Yoga Tab'] },
    { name: 'Amazon', count: 222, models: ['Fire HD 10', 'Fire 7'] },
    { name: 'Huawei', count: 176, models: ['MediaPad M5', 'MatePad T8'] },
  ],
};

const DynamicBrandModelFilter: React.FC<{ category: string }> = ({ category }) => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  // Handle Brand Selection
  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModels([]); // Reset models when brand changes
  };

  // Handle Model Selection
  const handleModelSelect = (model: string) => {
    if (selectedModels.includes(model)) {
      setSelectedModels((prev) => prev.filter((m) => m !== model));
    } else {
      setSelectedModels((prev) => [...prev, model]);
    }
  };

  // Clear Selection
  const clearSelection = () => {
    setSelectedBrand(null);
    setSelectedModels([]);
  };

  const brands = brandOptions[category] || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Brand & Model</h3>

      {/* Brand Dropdown */}
      <select
        className="w-full border rounded p-2 text-gray-700 text-sm mb-2"
        value={selectedBrand || ''}
        onChange={(e) => handleBrandSelect(e.target.value)}
      >
        <option value="" disabled>Select Brand</option>
        {brands.map((brand) => (
          <option key={brand.name} value={brand.name}>
            {brand.name} ({brand.count})
          </option>
        ))}
      </select>

      {/* Famous Brands */}
      {!selectedBrand && (
        <div className="flex flex-wrap gap-2 mt-2">
          {brands.slice(0, 5).map((brand) => (
            <button
              key={brand.name}
              onClick={() => handleBrandSelect(brand.name)}
              className="text-blue-600 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              {brand.name} ({brand.count})
            </button>
          ))}
        </div>
      )}

      {/* Model Multi-Select */}
      {selectedBrand && (
        <div className="mt-2">
          <div className="text-gray-700 text-sm mb-1">Select Models:</div>
          <div className="flex flex-wrap gap-2">
            {brands
              .find((brand) => brand.name === selectedBrand)
              ?.models.map((model) => (
                <div
                  key={model}
                  className={`px-2 py-1 rounded border cursor-pointer ${
                    selectedModels.includes(model)
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                  } text-sm`}
                  onClick={() => handleModelSelect(model)}
                >
                  {model}
                </div>
              ))}
          </div>

          {/* Selected Models */}
          {selectedModels.length > 0 && (
            <div className="mt-3 flex items-center">
              <span className="text-gray-700 text-sm">Selected Models: </span>
              <div className="flex flex-wrap gap-1 ml-2">
                {selectedModels.map((model) => (
                  <span
                    key={model}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                  >
                    {model}
                  </span>
                ))}
              </div>
              <button
                onClick={clearSelection}
                className="ml-2 text-blue-600 text-xs"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicBrandModelFilter;
