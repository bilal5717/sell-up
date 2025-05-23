"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiFilter, 
  FiX 
} from 'react-icons/fi';
import { 
  LuHeart, 
  LuTag, 
  LuMapPin
} from 'react-icons/lu';
import axios from 'axios';

interface AccessoryProduct {
  id: number;
  post_id: number;
  brand: string;
  model: string;
  condition: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  compatibility?: string;
  title?: string;
  category?: string;
  sub_category?: string;
  type?: string;
  size?: string;
}

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

const accessoryCategories: Category[] = [
  { name: 'Accessories', slug: 'accessories' },
];

const accessorySubCategories: CategoryData = {
  'accessories': [
    { name: 'Earphones' },
    { name: 'Other Accessories' },
    { name: 'Chargers' },
    { name: 'Headphones' },
    { name: 'Covers & Cases' },
    { name: 'Power Banks' },
    { name: 'Screens' },
    { name: 'Charging Cables' },
    { name: 'Mobile Stands' },
    { name: 'Ring Lights' },
    { name: 'Selfie Sticks' },
    { name: 'External Memory' },
    { name: 'Converters' },
    { name: 'Screen Protectors' },
  ],
};

const conditions = ['New', 'Used', 'Open Box', 'Refurbished', 'For Parts'];

const provinces = [
  { name: 'Punjab', cities: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur'] },
  { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Thatta'] },
  { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Bannu'] },
  { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi'] },
  { name: 'Islamabad Capital Territory', cities: ['Islamabad'] },
];

const DynamicCategorySidebar: React.FC<{
  selectedCategory: string;
  selectedSubCategory: string | null;
  onCategorySelect: (category: string) => void;
  onSubCategorySelect: (subCategory: string | null) => void;
}> = ({
  selectedCategory,
  selectedSubCategory,
  onCategorySelect,
  onSubCategorySelect,
}) => {
  const [showMore, setShowMore] = useState(false);

  const toggleCategory = (slug: string) => {
    if (selectedCategory !== slug) {
      onCategorySelect(slug);
      onSubCategorySelect(null);
    }
  };

  const toggleSubCategory = (name: string) => {
    if (selectedSubCategory === name) {
      onSubCategorySelect(null);
    } else {
      onSubCategorySelect(name);
    }
  };

  const displayedSubCategories = showMore
    ? accessorySubCategories['accessories']
    : accessorySubCategories['accessories'].slice(0, 8);

  const toggleShowMore = () => setShowMore((prev) => !prev);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Accessory Categories</h3>
      <div className="space-y-1">
        {accessoryCategories.map((category) => (
          <div key={category.slug} className="cursor-pointer">
            <Link 
              href={`/${category.slug}`}
              className={`py-1 px-2 hover:bg-gray-100 block ${selectedCategory === category.slug ? 'text-blue-600 font-medium' : 'text-gray-800'}`}
              onClick={() => toggleCategory(category.slug)}
              style={{ fontSize: '12px', lineHeight: '1.5' }}
            >
              {category.name}
            </Link>

            {category.slug === 'accessories' && (
              <div className="ml-4 space-y-1">
                {displayedSubCategories.map((sub, index) => (
                  <div key={index}>
                    <Link
                      href={`/${category.slug}/${sub.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`py-1 cursor-pointer hover:text-blue-600 block ${selectedSubCategory === sub.name ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => toggleSubCategory(sub.name)}
                      style={{ fontSize: '12px', lineHeight: '1.5' }}
                    >
                      - {sub.name}
                    </Link>
                  </div>
                ))}
                {accessorySubCategories['accessories'].length > 8 && (
                  <button
                    onClick={toggleShowMore}
                    className="text-blue-600 text-sm mt-1 hover:underline"
                  >
                    {showMore ? 'Show Less' : 'Show More'}
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

const ConditionSelectBox: React.FC<{
  selectedCondition: string;
  setSelectedCondition: (condition: string) => void;
}> = ({ selectedCondition, setSelectedCondition }) => {
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCondition(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Condition</h3>
      <select
        className="w-full border rounded p-2 text-gray-700 text-sm"
        value={selectedCondition}
        onChange={handleConditionChange}
      >
        <option value="all">All Conditions</option>
        {conditions.map((condition) => (
          <option key={condition} value={condition.toLowerCase()}>
            {condition}
          </option>
        ))}
      </select>
    </div>
  );
};

const LocationSidebar: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showMoreCities, setShowMoreCities] = useState<boolean>(false);

  const toggleShowMoreCities = () => setShowMoreCities((prev) => !prev);

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setSelectedCity(null);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Locations</h3>
      <div className="space-y-2">
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
      </div>
    </div>
  );
};

const PriceFilter: React.FC<{
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}> = ({ priceRange, setPriceRange }) => {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange([isNaN(value) ? 0 : value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange([priceRange[0], isNaN(value) ? 100000 : value]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Price</h3>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={priceRange[0]}
          onChange={handleMinPriceChange}
          className="w-1/2 p-2 border rounded text-gray-700 text-sm"
          min={0}
        />
        <input
          type="number"
          placeholder="Max"
          value={priceRange[1]}
          onChange={handleMaxPriceChange}
          className="w-1/2 p-2 border rounded text-gray-700 text-sm"
          min={0}
        />
      </div>
    </div>
  );
};

const AccessoryItemPage: React.FC = () => {
  const [products, setProducts] = useState<AccessoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('accessories');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const router = useRouter();
  const { type } = router.query;
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    condition: true,
    location: true,
    category: true
  });

  useEffect(() => {
    if (!type) return;

    const fetchAccessoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`http://127.0.0.1:8000/api/accessory/${type}`);
        setProducts(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (error) {
        console.error('Error fetching accessories:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccessoryProducts();
  }, [type]);

  const toggleLike = useCallback((productId: number) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedCondition('all');
    setSelectedSubCategory(null);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, index) => (
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/accessories" className="hover:text-blue-600">Accessories</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 capitalize">{type}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar Filters */}
          <div className="hidden lg:block w-full lg:w-1/4 space-y-4">
            <DynamicCategorySidebar
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              onCategorySelect={setSelectedCategory}
              onSubCategorySelect={setSelectedSubCategory}
            />
            
            <PriceFilter 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
            
            <ConditionSelectBox
              selectedCondition={selectedCondition}
              setSelectedCondition={setSelectedCondition}
            />
            
            <LocationSidebar />

            <button
              onClick={clearFilters}
              className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
            >
              Clear All Filters
            </button>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold capitalize mb-4 md:mb-0">{type} Accessories</h1>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button
                  className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <FiFilter /> Filters
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden md:block">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded p-2 text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {products.length === 0 && !loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No {type} accessories found</p>
              </div>
            ) : (
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
                          src={product.images?.[0]?.url || '/images/placeholder-accessory.png'}
                          alt={`${product.brand} ${product.model}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {product.images?.[0]?.is_featured && (
                          <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
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
                          {product.title || `${product.brand} ${product.model}`}
                        </h4>

                        <div className="flex justify-between items-center text-gray-600 text-xs mt-2">
                          <div className="flex items-center gap-1">
                            <LuTag />
                            <span>{product.condition}</span>
                          </div>
                          
                          {product.compatibility && (
                            <div className="flex items-center gap-1">
                              <span>Compatible with {product.compatibility}</span>
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
            )}

            {products.length > 0 && (
              <div className="mt-6 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button className="px-3 py-1 rounded border text-sm">Previous</button>
                  <button className="px-3 py-1 rounded border bg-blue-600 text-white text-sm">1</button>
                  <button className="px-3 py-1 rounded border text-sm">2</button>
                  <button className="px-3 py-1 rounded border text-sm">3</button>
                  <button className="px-3 py-1 rounded border text-sm">Next</button>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
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

              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('condition')}
                >
                  <h4 className="font-medium text-gray-800">Condition</h4>
                  {expandedSections.condition ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedSections.condition && (
                  <div className="mt-3">
                    <select
                      className="w-full p-2 border rounded text-sm"
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                    >
                      <option value="all">All Conditions</option>
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
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

export default AccessoryItemPage;