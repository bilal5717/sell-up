"use client";
import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { FiChevronDown, FiChevronUp, FiFilter, FiX } from 'react-icons/fi';
import CategorySidebar from '@/pages/products/filters/CategorySidbar';
import LocationSidebar from './filters/locationFilter';
import PriceFilter from './filters/PriceFilter';
import BrandModelFilter from './filters/BrandModelFilter';
import ConditionSelectBox from './filters/ConditionSelectBox';
interface FilterState {
  condition: string[];
  location: string[];
  type: string[];
}

const CategoryPage: React.FC = () => {
  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    condition: [],
    location: [],
    type: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    condition: true,
    location: true,
    type: true,
  });

  // Categories and filters data
  const categories = [
    { name: 'Mobiles', icon: '📱' },
    { name: 'Vehicles', icon: '🚗' },
    { name: 'Property for Rent', icon: '🏠' },
  ];

  const subCategories: Record<string, string[]> = {
    mobiles: ['Tablets', 'Accessories', 'Mobile Phones', 'Smart Watches'],
    vehicles: ['Cars', 'Car Accessories', 'Spare Parts', 'Other Vehicles'],
  };

  const categoryTypes: Record<string, string[]> = {
    Accessories: ['Charging Cables', 'Converters', 'Chargers', 'Screens'],
    'Spare Parts': ['Engines', 'Filters', 'Lights', 'Mirrors'],
  };

  const conditions = ['New', 'Used', 'Refurbished', 'Open Box'];
  const locations = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar'];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterSelect = (filterType: keyof FilterState, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedFilters({
      condition: [],
      location: [],
      type: [],
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>All Categories</span>
          </div>
        </div>
      </div>

     <div className="container mx-auto py-4 px-4">
  <div className="flex flex-col lg:flex-row gap-4">
    {/* Sidebar with Filters - OLX style */}
    <div className="w-full lg:w-1/4 space-y-4">
      <CategorySidebar />
      <LocationSidebar />
      <PriceFilter />
       <BrandModelFilter />
       <ConditionSelectBox />
    </div>
    {/* Main Content - OLX style */}
    <div className="w-full lg:w-3/4">
      {/* Mobile Filter Button */}
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">All Categories</h1>
        <button 
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* Sort Options */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing 1-24 of 1,000+ ads
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded p-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Product Item 1 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-48 bg-gray-200">
            <img 
              src="https://via.placeholder.com/300x200" 
              alt="Product" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              Featured
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1">iPhone 13 Pro Max 256GB</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-800">Rs 220,000</span>
              <span className="text-sm text-gray-500">Karachi</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Today 10:30 am</span>
              <span>1.2 km away</span>
            </div>
          </div>
        </div>

        {/* Product Item 2 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-48 bg-gray-200">
            <img 
              src="https://via.placeholder.com/300x200" 
              alt="Product" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1">Toyota Corolla 2018</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-800">Rs 4,500,000</span>
              <span className="text-sm text-gray-500">Lahore</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Yesterday</span>
              <span>5.7 km away</span>
            </div>
          </div>
        </div>

        {/* Product Item 3 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-48 bg-gray-200">
            <img 
              src="https://via.placeholder.com/300x200" 
              alt="Product" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
              Verified
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1">3 Bed House for Rent</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-800">Rs 45,000/mo</span>
              <span className="text-sm text-gray-500">Islamabad</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>2 days ago</span>
              <span>3.1 km away</span>
            </div>
          </div>
        </div>

        {/* More product items would go here */}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <nav className="flex items-center gap-1">
          <button className="px-3 py-1 rounded border text-sm">Previous</button>
          <button className="px-3 py-1 rounded border bg-blue-600 text-white text-sm">1</button>
          <button className="px-3 py-1 rounded border text-sm">2</button>
          <button className="px-3 py-1 rounded border text-sm">3</button>
          <button className="px-3 py-1 rounded border text-sm">Next</button>
        </nav>
      </div>
    </div>
  </div>

  {/* Mobile Filters Overlay */}
  {mobileFiltersOpen && (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Filters</h3>
        <button 
          onClick={() => setMobileFiltersOpen(false)}
          className="text-gray-500"
        >
          <FiX size={24} />
        </button>
      </div>
      
      {/* Mobile filter content would be the same as desktop filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        {/* Price Range Filter */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('price')}
          >
            <h4 className="font-medium text-gray-800">Price</h4>
            {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {expandedSections.price && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-24 p-2 border rounded text-sm"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                />
                <span className="mx-2">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-24 p-2 border rounded text-sm"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                />
              </div>
            </div>
          )}
        </div>

        {/* Other filters would be included here similarly */}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={clearFilters}
          className="flex-1 py-2 border border-gray-300 rounded text-gray-700 font-medium"
        >
          Clear all
        </button>
        <button 
          onClick={() => setMobileFiltersOpen(false)}
          className="flex-1 py-2 bg-blue-600 rounded text-white font-medium"
        >
          Show results
        </button>
      </div>
    </div>
  )}
</div>
    </div>
  );
};

// Server-Side Rendering
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {}, // No parameters needed
  };
};

export default CategoryPage;
