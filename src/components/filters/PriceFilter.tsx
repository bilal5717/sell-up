"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';

const PriceFilter: React.FC<{
  onPriceChange: (minPrice: number | '', maxPrice: number | '') => void;
  minPrice: number | '';
  maxPrice: number | '';
}> = ({ onPriceChange, minPrice, maxPrice }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [localMinPrice, setLocalMinPrice] = useState<number | ''>(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState<number | ''>(maxPrice);
  const [isDeliverable, setIsDeliverable] = useState<boolean>(false);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value);
    setLocalMinPrice(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value);
    setLocalMaxPrice(value);
  };

  const applyPriceFilter = () => {
    onPriceChange(localMinPrice, localMaxPrice);
  };

  const clearPriceFilter = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onPriceChange('', '');
  };

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Price</h3>
      <div className="space-y-2">
        {(minPrice !== '' || maxPrice !== '') ? (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
            <span className="text-sm">
              Rs {minPrice || '0'} - Rs {maxPrice || 'Any'}
            </span>
            <button onClick={clearPriceFilter} className="text-blue-600 text-xs">
              Change
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localMinPrice}
              onChange={handleMinPriceChange}
              className="w-1/2 p-2 border rounded text-gray-700 text-sm"
              min={0}
            />
            <input
              type="number"
              placeholder="Max"
              value={localMaxPrice}
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
    </div>
  );
};

export default PriceFilter;