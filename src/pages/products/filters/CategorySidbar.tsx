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
    { name: 'Tablets' }, { name: 'Accessories', types: ['Charging Cables', 'Converters', 'Chargers', 'Screens'] }, 
    { name: 'Mobile Phones' }, { name: 'Smart Watches' },
  ],
  vehicles: [
    { name: 'Cars' }, { name: 'Car Accessories', types: ['Tools & Gadgets', 'Safety & Security', 'Interior', 'Exterior'] }, 
    { name: 'Spare Parts', types: ['Engines', 'Lights', 'Mirrors', 'Tyres', 'Wipers'] },
    { name: 'Car Care', types: ['Air Freshener', 'Cleaners', 'Covers'] }, 
    { name: 'Oil & Lubricants', types: ['Engine Oil', 'Brake Oil', 'Coolants'] }, 
    { name: 'Bikes' }, { name: 'Boats' }, { name: 'Rikshaw' },
  ],
  bikes: [
    { name: 'Motorcycles' }, { name: 'Bike Accessories', types: ['Helmets', 'Gloves', 'Bike Covers'] },
    { name: 'Scooters' }, { name: 'ATV & Quads' }, { name: 'Bicycles' },
  ],
  electronics: [
    { name: 'Computers' }, { name: 'Games' }, { name: 'Cameras' }, { name: 'AC & Coolers' }, 
    { name: 'Heaters' }, { name: 'Kitchen Appliances', types: ['Microwaves', 'Ovens', 'Blenders'] },
  ],
};

const CategorySidebar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);

  const toggleCategory = (slug: string) => {
    setActiveCategory(activeCategory === slug ? null : slug);
    setActiveSubCategory(null); // Reset subcategory when changing category
  };

  const toggleSubCategory = (name: string) => {
    setActiveSubCategory(activeSubCategory === name ? null : name);
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
                className="py-1 px-2 text-gray-800 hover:bg-gray-100"
                onClick={() => toggleCategory(category.slug)}
                style={{ fontSize: '12px', lineHeight: '1.5' }}
              >
                {category.name}
              </div>

              {activeCategory === category.slug && subCategories[category.slug] && (
                <div className="ml-4 space-y-1">
                  {subCategories[category.slug].map((sub, index) => (
                    <div key={index}>
                      <div
                        className="text-gray-700 cursor-pointer hover:text-blue-600 py-1"
                        onClick={() => toggleSubCategory(sub.name)}
                        style={{ fontSize: '12px', lineHeight: '1.5' }}
                      >
                        {sub.name}
                      </div>
                      {sub.types && activeSubCategory === sub.name && (
                        <div className="ml-4 space-y-1 text-gray-600">
                          {sub.types.map((type, i) => (
                            <div key={i} className="py-1" style={{ fontSize: '12px', lineHeight: '1.5' }}>
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

export default CategorySidebar;
