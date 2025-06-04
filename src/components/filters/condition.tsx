
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';

const conditions = ['New', 'Used', 'Open Box', 'Refurbished', 'For Parts'];

const ConditionFilter: React.FC = () => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleConditionChange = (condition: string) => {
    const newConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];
    setSelectedConditions(newConditions);

    // Update URL with condition filters
    const conditionFilters = newConditions.map((c) => `new_used_eq_${c.toLowerCase()}`);
    const currentFilters = searchParams.get('filter')?.split(',').filter((f) => f) || [];
    const nonConditionFilters = currentFilters.filter((f) => !f.startsWith('new_used_eq_'));
    const newFilters = [...nonConditionFilters, ...conditionFilters].filter((f) => f);
    const query = newFilters.length ? `?${File}=${newFilters.join(',')}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  const clearSelection = () => {
    setSelectedConditions([]);
    // Remove condition filters from URL
    const currentFilters = searchParams.get('filter')?.split(',').filter((f) => f) || [];
    const nonConditionFilters = currentFilters.filter((f) => !f.startsWith('new_used_eq_'));
    const query = nonConditionFilters.length ? `?filter=${nonConditionFilters.join(',')}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  useEffect(() => {
    // Initialize selected conditions from URL
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      const conditionsFromUrl = filterParam
        .split(',')
        .filter((f) => f.startsWith('new_used_eq_'))
        .map((f) => {
          const condition = f.replace('new_used_eq_', '');
          const conditionMap: Record<string, string> = {
            new: 'New',
            used: 'Used',
            open_box: 'Open Box',
            refurbished: 'Refurbished',
            for_parts: 'For Parts',
          };
          return conditionMap[condition] || condition;
        })
        .filter((c) => conditions.includes(c));
      setSelectedConditions(conditionsFromUrl);
    } else {
      setSelectedConditions([]);
    }
  }, [searchParams]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Condition</h3>
      <div>
        {selectedConditions.length > 0 && (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700 mb-2">
            <span className="text-sm">{selectedConditions.join(', ')}</span>
            <button onClick={clearSelection} className="text-blue-600 text-xs">
              Clear
            </button>
          </div>
        )}
        <div className="space-y-1">
          {conditions.map((condition) => (
            <label key={condition} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedConditions.includes(condition)}
                onChange={() => handleConditionChange(condition)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-sm">{condition}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConditionFilter;