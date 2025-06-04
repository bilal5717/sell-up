import React from 'react';
import Link from 'next/link';

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

const smartWatchCategories: Category[] = [
  { name: 'Mobile Phones', slug: 'mobile-phones' },
  { name: 'Tablets', slug: 'tablets' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Smart Watches', slug: 'smart-watches' },
];

const smartWatchSubCategories: CategoryData = {};

interface DynamicCategorySidebarProps {
  selectedCategory: string;
  selectedSubCategory: string | null;
  selectedType: string | null;
  onCategorySelect: (category: string) => void;
  onSubCategorySelect: (subCategory: string | null) => void;
  onTypeSelect: (type: string | null) => void;
}

const DynamicCategorySidebar: React.FC<DynamicCategorySidebarProps> = ({
  selectedCategory,
  selectedSubCategory,
  selectedType,
  onCategorySelect,
  onSubCategorySelect,
  onTypeSelect,
}) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Smart Watch Categories</h3>
      <div className="space-y-1">
        {smartWatchCategories.map((category) => (
          <div key={category.slug} className="cursor-pointer">
            <Link 
              href={`/${category.slug}`}
              className={`py-1 px-2 hover:bg-gray-100 block ${selectedCategory === category.slug ? 'text-blue-600 font-medium' : 'text-gray-800'}`}
              onClick={() => toggleCategory(category.slug)}
              style={{ fontSize: '12px', lineHeight: '1.5' }}
            >
              {category.name}
            </Link>

            {selectedCategory === category.slug && smartWatchSubCategories[category.slug] && (
              <div className="ml-4 space-y-1">
                {smartWatchSubCategories[category.slug].map((sub, index) => (
                  <div key={index}>
                    <Link
                      href={`/${category.slug}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`py-1 cursor-pointer hover:text-blue-600 block ${selectedSubCategory === sub.name ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => toggleSubCategory(sub.name)}
                      style={{ fontSize: '12px', lineHeight: '1.5' }}
                    >
                      {sub.name}
                    </Link>
                    {sub.types && selectedSubCategory === sub.name && (
                      <div className="ml-4 space-y-1">
                        {sub.types.map((type, i) => (
                          <Link
                            key={i}
                            href={`/${category.slug}/${sub.name.toLowerCase().replace(/\s+/g, '-')}/${type.toLowerCase().replace(/\s+/g, '-')}`}
                            className={`py-1 cursor-pointer hover:text-blue-600 block ${selectedType === type ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                            style={{ fontSize: '12px', lineHeight: '1.5' }}
                            onClick={() => toggleType(type)}
                          >
                            - {type}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicCategorySidebar;