"use client";
import React, { useState } from 'react';

interface Brand {
  name: string;
  models: string[];
}

const brands: Brand[] = [
  { name: 'Honda', models: ['Civic', 'City', 'Accord', 'BR-V', 'Vezel'] },
  { name: 'Toyota', models: ['Corolla', 'Camry', 'Fortuner', 'Yaris', 'Hilux'] },
  { name: 'Suzuki', models: ['Alto', 'Wagon R', 'Cultus', 'Swift', 'Bolan'] },
  { name: 'Kia', models: ['Sportage', 'Picanto', 'Sorento', 'Stinger'] },
  { name: 'Hyundai', models: ['Elantra', 'Tucson', 'Sonata', 'Santa Fe'] },
  { name: 'BMW', models: ['X5', '3 Series', '5 Series', '7 Series', 'X3'] },
  { name: 'Audi', models: ['A3', 'A4', 'Q5', 'Q7', 'TT'] },
  { name: 'Mercedes', models: ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLE'] },
];

const famousBrands = ['Honda', 'Toyota', 'Suzuki', 'Kia', 'Hyundai'];

const BrandModelFilter: React.FC = () => {
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
            {brand.name}
          </option>
        ))}
      </select>

      {/* Famous Brands */}
      {!selectedBrand && (
        <div className="flex flex-wrap gap-2 mt-2">
          {famousBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandSelect(brand)}
              className="text-blue-600 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              {brand}
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

export default BrandModelFilter;
