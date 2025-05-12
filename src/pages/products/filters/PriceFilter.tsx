"use client";
import React, { useState } from 'react';

const PriceAndDeliveryFilter: React.FC = () => {
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [isPriceSet, setIsPriceSet] = useState<boolean>(false);
  const [isDeliverable, setIsDeliverable] = useState<boolean>(false);

  // Handle Price Input Change
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMinPrice(isNaN(value) ? '' : value);
    setIsPriceSet(false);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMaxPrice(isNaN(value) ? '' : value);
    setIsPriceSet(false);
  };

  // Apply Price Filter
  const applyPriceFilter = () => {
    setIsPriceSet(true);
  };

  // Clear Price Filter
  const clearPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setIsPriceSet(false);
  };

  // Toggle Delivery Checkbox
  const toggleIsDeliverable = () => {
    setIsDeliverable((prev) => !prev);
  };

  // Clear All Filters
  const clearAllFilters = () => {
    clearPriceFilter();
    setIsDeliverable(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      {/* Price Filter */}
      <h3 className="font-bold text-lg mb-2">Price</h3>
      <div className="space-y-2">
        {isPriceSet ? (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
            <span className="text-sm">
              {minPrice || maxPrice ? `Rs ${minPrice || '0'} - Rs ${maxPrice || 'Any'}` : 'Any'}
            </span>
            <button
              onClick={clearPriceFilter}
              className="text-blue-600 text-xs"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="w-1/2 p-2 border rounded text-gray-700 text-sm"
              min={0}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-1/2 p-2 border rounded text-gray-700 text-sm"
              min={0}
            />
            <button
              onClick={applyPriceFilter}
              className="text-blue-600 text-sm px-2 py-1 border rounded"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Is Deliverable Checkbox */}
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="isDeliverable"
          checked={isDeliverable}
          onChange={toggleIsDeliverable}
          className="mr-2 h-4 w-4 text-blue-600 rounded"
        />
        <label htmlFor="isDeliverable" className="text-gray-700 text-sm">Is Deliverable</label>
      </div>

      {/* Display Selected Delivery Status */}
      {isDeliverable && (
        <div className="mt-2 text-gray-600 text-sm">
          Deliverable: Yes
        </div>
      )}

      {/* Clear All Filters Button */}
      <button
        onClick={clearAllFilters}
        className="text-blue-600 text-sm mt-3"
      >
        Clear All
      </button>
    </div>
  );
};

export default PriceAndDeliveryFilter;
