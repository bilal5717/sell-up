import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';

const WATCH_BRANDS = ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Fitbit', 'Garmin', 'Other'];

interface DynamicBrandFilterProps {
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
}

const DynamicBrandFilter: React.FC<DynamicBrandFilterProps> = ({ selectedBrands, onBrandChange }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleBrandChange = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    onBrandChange(newBrands);

    // Update URL with brand filters
    const brandFilters = newBrands.map(b => `brand_eq_${encodeURIComponent(b)}`);
    const currentFilters = searchParams.get('filter')?.split(',').filter(f => f) || [];
    const nonBrandFilters = currentFilters.filter(f => !f.startsWith('brand_eq_'));
    const newFilters = [...nonBrandFilters, ...brandFilters].filter(f => f);
    const query = newFilters.length ? `?filter=${newFilters.join(',')}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  const clearSelection = () => {
    onBrandChange([]);
    // Remove brand filters from URL
    const currentFilters = searchParams.get('filter')?.split(',').filter(f => f) || [];
    const nonBrandFilters = currentFilters.filter(f => !f.startsWith('brand_eq_'));
    const query = nonBrandFilters.length ? `?filter=${nonBrandFilters.join(',')}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  useEffect(() => {
    // Initialize selected brands from URL
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      const brands = filterParam
        .split(',')
        .filter(f => f.startsWith('brand_eq_'))
        .map(f => decodeURIComponent(f.replace('brand_eq_', '')))
        .filter(b => WATCH_BRANDS.includes(b));
      if (JSON.stringify(brands) !== JSON.stringify(selectedBrands)) {
        onBrandChange(brands);
      }
    } else if (selectedBrands.length > 0) {
      onBrandChange([]);
    }
  }, [searchParams, onBrandChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Brands</h3>
      {selectedBrands.length > 0 && (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700 mb-2">
          <span className="text-sm">{selectedBrands.join(', ')}</span>
          <button onClick={clearSelection} className="text-blue-600 text-xs">
            Clear
          </button>
        </div>
      )}
      <div className="space-y-1">
        {WATCH_BRANDS.map((brand) => (
          <label key={brand} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-gray-700 text-sm">{brand}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DynamicBrandFilter;