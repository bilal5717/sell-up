"use client";
import React, { useState } from 'react';

interface Category {
  name: string;
  slug: string;
}

interface SubCategory {
  name: string;
  types?: string[];
}

interface CategoryData {
  [key: string]: SubCategory[];
}

interface DynamicCategorySidebarProps {
  selectedCategory: string;
  selectedSubCategory: string | null;
  selectedType: string | null;
  onCategorySelect: (category: string) => void;
  onSubCategorySelect: (subCategory: string | null) => void;
  onTypeSelect: (type: string | null) => void;
}

const categories: Category[] = [
  { name: 'Mobiles', slug: 'mobiles' },
  { name: 'Vehicles', slug: 'vehicles' },
  { name: 'Property for Rent', slug: 'property-for-rent' },
  { name: 'Property for Sale', slug: 'property-for-sale' },
  { name: 'Electronics & Home Appliances', slug: 'electronics-home-appliances' },
  { name: 'Bikes', slug: 'bikes' },
  { name: 'Business, Industrial & Agriculture', slug: 'business-industrial-agriculture' },
  { name: 'Services', slug: 'services' },
  { name: 'Jobs', slug: 'jobs' },
  { name: 'Animals', slug: 'animals' },
  { name: 'Books, Sports & Hobbies', slug: 'books-sports-hobbies' },
  { name: 'Furniture & Home Decor', slug: 'furniture-home-decor' },
  { name: 'Fashion & Beauty', slug: 'fashion-beauty' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Others', slug: 'others' },
];

const subCategories: CategoryData = {
  mobiles: [
    { name: 'Tablets' },
    { name: 'Accessories', types: ['Charging Cables', 'Converters', 'Chargers', 'Screens'] },
    { name: 'Mobile Phones' },
    { name: 'Smart Watches' },
  ],
};

const DynamicCategorySidebar: React.FC<DynamicCategorySidebarProps> = ({
  selectedCategory,
  selectedSubCategory,
  selectedType,
  onCategorySelect,
  onSubCategorySelect,
  onTypeSelect,
}) => {
  const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);

  const toggleCategory = (slug: string) => {
    onCategorySelect(slug);
    onSubCategorySelect(null);
    onTypeSelect(null);
  };

  const toggleSubCategory = (name: string) => {
    if (selectedSubCategory === name) {
      onSubCategorySelect(null);
      onTypeSelect(null);
    } else {
      onSubCategorySelect(name);
      onTypeSelect(null);
    }
  };

  const toggleType = (type: string) => {
    if (selectedType === type) {
      onTypeSelect(null);
    } else {
      onTypeSelect(type);
    }
  };

  const toggleShowMoreCategories = () => {
    setShowMoreCategories((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">All Categories</h3>
      <div className="space-y-1">
        {(showMoreCategories ? categories : categories.slice(0, 4)).map((category) => (
          <div key={category.slug} className="cursor-pointer">
            <div
              className={`py-1 px-2 hover:bg-gray-100 ${selectedCategory === category.slug ? 'text-blue-600 font-medium' : 'text-gray-800'}`}
              onClick={() => toggleCategory(category.slug)}
              style={{ fontSize: '12px', lineHeight: '1.5' }}
            >
              {category.name}
            </div>

            {selectedCategory === category.slug && subCategories[category.slug] && (
              <div className="ml-4 space-y-1">
                {subCategories[category.slug].map((sub, index) => (
                  <div key={index}>
                    <div
                      className={`py-1 cursor-pointer hover:text-blue-600 ${selectedSubCategory === sub.name ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => toggleSubCategory(sub.name)}
                      style={{ fontSize: '12px', lineHeight: '1.5' }}
                    >
                      {sub.name}
                    </div>
                    {sub.types && selectedSubCategory === sub.name && (
                      <div className="ml-4 space-y-1">
                        {sub.types.map((type, i) => (
                          <div
                            key={i}
                            className={`py-1 cursor-pointer hover:text-blue-600 ${selectedType === type ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                            style={{ fontSize: '12px', lineHeight: '1.5' }}
                            onClick={() => toggleType(type)}
                          >
                            - {type}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {categories.length > 4 && (
          <button
            onClick={toggleShowMoreCategories}
            className="text-blue-600 text-sm mt-2"
          >
            {showMoreCategories ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DynamicCategorySidebar;