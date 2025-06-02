
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiFilter, 
  FiX 
} from 'react-icons/fi';
import { 
  LuHeart, 
  LuTag, 
  LuMapPin, 
  LuWifi, 
  LuWifiOff 
} from 'react-icons/lu';
import axios from 'axios';

// Interfaces
interface Product {
  id: number;
  post_id: number;
  brand?: string;
  model?: string;
  condition?: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  title?: string;
  category?: string;
  sub_category?: string;
  type?: string;
  warranty?: string;
  books_details?: {
    sub_type: string;
    condition: string;
    language: string;
    author: string;
  };
}

interface FilterState {
  condition: string[];
  location: string[];
  type: string[];
}

interface Brand {
  name: string;
  count: number;
  models: string[];
}

interface Category {
  name: string;
  slug: string;
}

interface SubCategory {
  name: string;
  slug: string; // Added slug for subcategories
  types?: { name: string; slug: string }[]; // Added slug for types
}

interface CategoryData {
  [key: string]: SubCategory[];
}

interface Province {
  name: string;
  cities: string[];
}

// Data
const brandOptions: Record<string, Brand[]> = {
  'Books, Sports & Hobbies': [
    { name: 'Nike', count: 7389, models: ['Running Shoes', 'Football', 'Basketball', 'Tennis'] },
    { name: 'Adidas', count: 5164, models: ['Football Boots', 'Tracksuits', 'Backpacks', 'Training Gear'] },
    { name: 'Wilson', count: 2032, models: ['Tennis Rackets', 'Basketballs', 'Volleyballs'] },
    { name: 'Yamaha', count: 1539, models: ['Guitars', 'Keyboards', 'Drums', 'Violins'] },
    { name: 'Oxford', count: 940, models: ['Dictionaries', 'Textbooks', 'Novels', 'Stationery'] },
    { name: 'Casio', count: 885, models: ['Calculators', 'Watches', 'Keyboards'] },
  ]
};

const categories: Category[] = [
  { name: 'Books, Sports & Hobbies', slug: 'books-sports-hobbies' },
];

const subCategories: CategoryData = {
  'books-sports-hobbies': [
    { 
      name: 'Sports Equipment', 
      slug: 'sports-equipment',
      types: [
        { name: 'Football', slug: 'football' },
        { name: 'Cricket', slug: 'cricket' },
        { name: 'Tennis', slug: 'tennis' },
        { name: 'Basketball', slug: 'basketball' },
        { name: 'Badminton', slug: 'badminton' },
        { name: 'Table Tennis', slug: 'table-tennis' },
        { name: 'Volleyball', slug: 'volleyball' },
        { name: 'Golf', slug: 'golf' },
        { name: 'Hockey', slug: 'hockey' },
        { name: 'Other Sports', slug: 'other-sports' }
      ]
    },
    { 
      name: 'Musical Instruments', 
      slug: 'musical-instruments',
      types: [
        { name: 'Guitars', slug: 'guitars' },
        { name: 'Keyboards', slug: 'keyboards' },
        { name: 'Drums', slug: 'drums' },
        { name: 'Violins', slug: 'violins' },
        { name: 'Flutes', slug: 'flutes' },
        { name: 'Trumpets', slug: 'trumpets' },
        { name: 'Saxophones', slug: 'saxophones' },
        { name: 'Amplifiers', slug: 'amplifiers' },
        { name: 'Other Instruments', slug: 'other-instruments' }
      ]
    },
    { 
      name: 'Gym & Fitness', 
      slug: 'gym-fitness',
      types: [
        { name: 'Treadmills', slug: 'treadmills' },
        { name: 'Exercise Bikes', slug: 'exercise-bikes' },
        { name: 'Dumbbells', slug: 'dumbbells' },
        { name: 'Weight Benches', slug: 'weight-benches' },
        { name: 'Yoga Mats', slug: 'yoga-mats' },
        { name: 'Resistance Bands', slug: 'resistance-bands' },
        { name: 'Other Gym Equipment', slug: 'other-gym-equipment' }
      ]
    },
    { 
      name: 'Books & Magazines', 
      slug: 'books-magazines',
      types: [
        { name: 'Books', slug: 'books' },
        { name: 'Magazines', slug: 'magazines' },
        { name: 'Dictionaries', slug: 'dictionaries' },
        { name: 'Stationary Items', slug: 'stationary-items' },
        { name: 'Calculators', slug: 'calculators' }
      ]
    },
    { name: 'Others', slug: 'others' }
  ],
};

const conditions = ['New', 'Used', 'Open Box', 'Refurbished', 'For Parts'];

const provinces: Province[] = [
  { name: 'Punjab', cities: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur'] },
  { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Thatta'] },
  { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Bannu'] },
  { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi'] },
  { name: 'Islamabad Capital Territory', cities: ['Islamabad'] },
];

const typeOptions: Record<string, { label: string; count: number }[]> = {
  'sports-equipment': [
    { label: 'Football', count: 930 },
    { label: 'Cricket', count: 860 },
    { label: 'Tennis', count: 410 },
  ],
  'books-magazines': [
    { label: 'Books', count: 1420 },
    { label: 'Magazines', count: 380 },
    { label: 'Dictionaries', count: 250 },
  ],
  'musical-instruments': [
    { label: 'Guitars', count: 720 },
    { label: 'Keyboards', count: 380 },
    { label: 'Drums', count: 210 },
  ]
};

// DynamicCategorySidebar Component
const DynamicCategorySidebar: React.FC<{
  selectedCategory: string;
  selectedSubCategory: string | null;
  selectedType: string | null;
  onCategorySelect: (category: string) => void;
  onSubCategorySelect: (subCategory: string | null, slug: string | null) => void;
  onTypeSelect: (type: string | null, slug: string | null) => void;
}> = ({
  selectedCategory,
  selectedSubCategory,
  selectedType,
  onCategorySelect,
  onSubCategorySelect,
  onTypeSelect,
}) => {
  const router = useRouter();
  const [showMoreSubCategories, setShowMoreSubCategories] = useState<boolean>(false);
  const [showMoreTypes, setShowMoreTypes] = useState<boolean>(false);

  const toggleCategory = (slug: string) => {
    onCategorySelect(slug);
    onSubCategorySelect(null, null);
    onTypeSelect(null, null);
    setShowMoreSubCategories(false);
    setShowMoreTypes(false);
    router.push(`/category/${slug}`);
  };

  const toggleSubCategory = (name: string, slug: string) => {
    if (selectedSubCategory === name) {
      onSubCategorySelect(null, null);
      onTypeSelect(null, null);
      setShowMoreTypes(false);
      router.push(`/${selectedCategory}`);
    } else {
      onSubCategorySelect(name, slug);
      onTypeSelect(null, null);
      setShowMoreTypes(false);
      router.push(`/${selectedCategory}/${slug}`);
    }
  };

  const toggleType = (type: string, slug: string) => {
    if (selectedType === type) {
      onTypeSelect(null, null);
      router.push(`/${selectedCategory}/${subCategories[selectedCategory].find(sub => sub.name === selectedSubCategory)?.slug}`);
    } else {
      onTypeSelect(type, slug);
      router.push(`/${selectedCategory}/${subCategories[selectedCategory].find(sub => sub.name === selectedSubCategory)?.slug}/${slug}`);
    }
  };

  const toggleShowMoreSubCategories = () => {
    setShowMoreSubCategories((prev) => !prev);
  };

  const toggleShowMoreTypes = () => {
    setShowMoreTypes((prev) => !prev);
  };

  const visibleSubCategories = showMoreSubCategories
    ? subCategories[selectedCategory]?.slice(0, 14) || []
    : subCategories[selectedCategory]?.slice(0, 7) || [];

  const getVisibleTypes = (subCategory: string) => {
    const subCategoryData = subCategories[selectedCategory]?.find(sub => sub.name === subCategory);
    if (!subCategoryData?.types) return [];
    return showMoreTypes
      ? subCategoryData.types.slice(0, 14)
      : subCategoryData.types.slice(0, 7);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">All Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
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
                {visibleSubCategories.map((sub, index) => (
                  <div key={index}>
                    <div
                      className={`py-1 cursor-pointer hover:text-blue-600 ${selectedSubCategory === sub.name ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => toggleSubCategory(sub.name, sub.slug)}
                      style={{ fontSize: '12px', lineHeight: '1.5' }}
                    >
                      {sub.name}
                    </div>
                    {sub.types && selectedSubCategory === sub.name && (
                      <div className="ml-4 space-y-1">
                        {getVisibleTypes(sub.name).map((type, i) => (
                          <div
                            key={i}
                            className={`py-1 cursor-pointer hover:text-blue-600 ${selectedType === type.name ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                            style={{ fontSize: '12px', lineHeight: '1.5' }}
                            onClick={() => toggleType(type.name, type.slug)}
                          >
                            - {type.name}
                          </div>
                        ))}
                        {sub.types.length > 7 && (
                          <button
                            onClick={toggleShowMoreTypes}
                            className="text-blue-600 text-sm mt-1"
                          >
                            {showMoreTypes ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {subCategories[category.slug].length > 7 && (
                  <button
                    onClick={toggleShowMoreSubCategories}
                    className="text-blue-600 text-sm mt-1"
                  >
                    {showMoreSubCategories ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// LocationSidebar Component
const LocationSidebar: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showMoreCities, setShowMoreCities] = useState<boolean>(false);
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);

  const toggleShowMoreCities = () => setShowMoreCities((prev) => !prev);

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setSelectedCity(null);
    setIsLocationSelected(false);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsLocationSelected(true);
  };

  const clearSelection = () => {
    setSelectedProvince(null);
    setSelectedCity(null);
    setIsLocationSelected(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-bold text-lg mb-2">Locations</h3>
      <div className="space-y-2">
        {isLocationSelected && selectedCity && (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
            <span className="text-sm">{selectedProvince} - {selectedCity}</span>
            <button
              onClick={clearSelection}
              className="text-blue-600 text-xs"
            >
              Change
            </button>
          </div>
        )}

        {!isLocationSelected && (
          <>
            <select
              className="w-full border rounded p-2 text-gray-700 text-sm"
              value={selectedProvince || ''}
              onChange={(e) => handleProvinceSelect(e.target.value)}
            >
              <option value="" disabled>Select Province</option>
              {provinces.map((province) => (
                <option key={province.name} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>

            {selectedProvince && (
              <div className="mt-2 space-y-1">
                {provinces
                  .find((prov) => prov.name === selectedProvince)?.cities
                  .slice(0, showMoreCities ? undefined : 5)
                  .map((city, index) => (
                    <div
                      key={index}
                      className={`py-1 px-2 text-gray-700 hover:bg-gray-100 cursor-pointer ${
                        selectedCity === city ? 'bg-blue-100' : ''
                      }`}
                      style={{ fontSize: '12px', lineHeight: '1.5' }}
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </div>
                  ))}
                {provinces.find((prov) => prov.name === selectedProvince)?.cities.length! > 5 && (
                  <button
                    onClick={toggleShowMoreCities}
                    className="text-blue-600 text-sm mt-1"
                  >
                    {showMoreCities ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// DynamicTypeFilterBox Component
const DynamicTypeFilterBox: React.FC<{ category: string }> = ({ category }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes((prev) => prev.filter((t) => t !== type));
    } else {
      setSelectedTypes((prev) => [...prev, type]);
    }
  };

  const clearSelection = () => {
    setSelectedTypes([]);
  };

  const types = typeOptions[category] || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Type</h3>
      {selectedTypes.length > 0 ? (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
          <span className="text-sm">{selectedTypes.join(', ')}</span>
          <button
            onClick={clearSelection}
            className="text-blue-600 text-xs"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {types.map((type) => (
            <label key={type.label} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.label)}
                onChange={() => handleTypeChange(type.label)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-sm">
                {type.label} ({type.count})
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ConditionSelectBox Component
const ConditionSelectBox: React.FC = () => {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCondition(e.target.value);
  };

  const clearCondition = () => {
    setSelectedCondition(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Condition</h3>
      {selectedCondition ? (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
          <span className="text-sm">{selectedCondition}</span>
          <button
            onClick={clearCondition}
            className="text-blue-600 text-xs"
          >
            Change
          </button>
        </div>
      ) : (
        <select
          className="w-full border rounded p-2 text-gray-700 text-sm"
          value={selectedCondition || ''}
          onChange={handleConditionChange}
        >
          <option value="" disabled>Select Condition</option>
          {conditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

// PriceFilter Component
const PriceFilter: React.FC = () => {
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [isPriceSet, setIsPriceSet] = useState<boolean>(false);
  const [isDeliverable, setIsDeliverable] = useState<boolean>(false);

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

  const applyPriceFilter = () => {
    setIsPriceSet(true);
  };

  const clearPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setIsPriceSet(false);
  };

  const toggleIsDeliverable = () => {
    setIsDeliverable((prev) => !prev);
  };

  const clearAllFilters = () => {
    clearPriceFilter();
    setIsDeliverable(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
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

      {isDeliverable && (
        <div className="mt-2 text-gray-600 text-sm">
          Deliverable: Yes
        </div>
      )}

      <button
        onClick={clearAllFilters}
        className="text-blue-600 text-sm mt-3"
      >
        Clear All
      </button>
    </div>
  );
};

// BooksHobbiesProductCard Component
const BooksHobbiesProductCard: React.FC<{ products: Product[]; loading?: boolean }> = ({
  products = [],
  loading = false,
}) => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const toggleLike = useCallback((productId: number) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const isLiked = likedProducts.has(product.id);
        return (
          <article
            key={`${product.id}-${product.post_id}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={product.images?.[0]?.url || '/images/placeholder.png'}
                alt={`${product.brand} ${product.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {product.images?.[0]?.is_featured && (
                <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  Featured
                </span>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-gray-800 font-bold">
                  Rs. {Number(product.price).toLocaleString()}
                </h3>
                <button
                  onClick={() => toggleLike(product.id)}
                  aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                  className="p-1"
                >
                  <LuHeart
                    className={`text-xl ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              <h4 className="text-gray-700 font-medium text-sm line-clamp-2">
                {product.title || 'No Title'}
              </h4>

              <div className="flex justify-between items-center text-gray-600 text-xs mt-2">
                <div className="flex items-center gap-1">
                  <LuTag />
                  <span>{product.books_details?.condition || 'Not Specified'}</span>
                </div>
                {product.books_details?.language && (
                  <div className="flex items-center gap-1">
                    <span>Language: {product.books_details.language}</span>
                  </div>
                )}
                {product.warranty && (
                  <div className="flex items-center gap-1">
                    <span>Warranty: {product.warranty}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start text-gray-500 text-xs mt-2">
                <div className="flex items-center gap-1">
                  <LuMapPin />
                  <span>{product.location}</span>
                </div>
                <time dateTime={product.posted_at} className="text-xs">
                  {product.posted_at}
                </time>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

// BooksHobbiesCategoryPage Component
const BooksHobbiesCategoryPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('books-sports-hobbies');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTypeSlug, setSelectedTypeSlug] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    condition: [],
    location: [],
    type: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    condition: true,
    location: true,
    type: true,
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize state from URL parameters
  useEffect(() => {
    const subCategorySlug = searchParams.get('subCategory');
    const typeSlug = searchParams.get('type');
    
    if (subCategorySlug) {
      const subCategory = subCategories['books-sports-hobbies'].find(sub => sub.slug === subCategorySlug);
      if (subCategory) {
        setSelectedSubCategory(subCategory.name);
        setSelectedSubCategorySlug(subCategorySlug);
        if (typeSlug) {
          const type = subCategory.types?.find(t => t.slug === typeSlug);
          if (type) {
            setSelectedType(type.name);
            setSelectedTypeSlug(typeSlug);
          }
        }
      }
    }
  }, [searchParams]);

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
    setSelectedSubCategory(null);
    setSelectedSubCategorySlug(null);
    setSelectedType(null);
    setSelectedTypeSlug(null);
    router.push(`/category/${selectedCategory}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'http://127.0.0.1:8000/api/books-sports-hobbies';
        const params: { subCategory?: string; type?: string } = {};

        if (selectedSubCategorySlug) {
          params.subCategory = selectedSubCategorySlug;
          if (selectedTypeSlug) {
            params.type = selectedTypeSlug;
          }
        }

        const response = await axios.get(url, { params });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching books & hobbies products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedSubCategorySlug, selectedTypeSlug]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Books, Sports & Hobbies</span>
            {selectedSubCategory && (
              <>
                <span className="mx-2">›</span>
                <span>{selectedSubCategory}</span>
              </>
            )}
            {selectedType && (
              <>
                <span className="mx-2">›</span>
                <span>{selectedType}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/4 space-y-4">
            <DynamicCategorySidebar
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              selectedType={selectedType}
              onCategorySelect={setSelectedCategory}
              onSubCategorySelect={(name, slug) => {
                setSelectedSubCategory(name);
                setSelectedSubCategorySlug(slug);
              }}
              onTypeSelect={(type, slug) => {
                setSelectedType(type);
                setSelectedTypeSlug(slug);
              }}
            />
            <LocationSidebar />
            <PriceFilter />
            <ConditionSelectBox />
            {selectedSubCategorySlug && typeOptions[selectedSubCategorySlug] && (
              <DynamicTypeFilterBox category={selectedSubCategorySlug} />
            )}
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Books, Sports & Hobbies</h1>
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiFilter /> Filters
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedSubCategory ? 
                  `Showing ${selectedSubCategory} products${selectedType ? ` (${selectedType})` : ''}` : 
                  'Showing all Books, Sports & Hobbies products'}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Condition:</span>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="border rounded p-2 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                  </select>
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
            </div>

            <BooksHobbiesProductCard 
              products={products}
              loading={loading}
            />
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
            
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
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

export default BooksHobbiesCategoryPage;
