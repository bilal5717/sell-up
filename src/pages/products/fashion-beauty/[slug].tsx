"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// Interfaces
interface FashionProduct {
  id: number;
  title: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  fashion_beauty_details?: {
    type: string;
    condition: string;
    gender?: string;
    fabric?: string;
    material?: string;
  };
  sub_category?: {
    name: string;
    slug: string;
  };
}

interface FilterState {
  condition: string[];
  location: string[];
  type: string[];
}

interface Category {
  name: string;
  slug: string;
}

interface SubCategory {
  name: string;
  slug: string;
  types?: string[];
}

interface CategoryData {
  [key: string]: SubCategory[];
}

interface Province {
  name: string;
  cities: string[];
}

// Data
const categories: Category[] = [
  { name: 'Fashion & Beauty', slug: 'fashion-beauty' },
];

const subCategories: CategoryData = {
  'fashion-beauty': [
    { 
      name: 'Clothes', 
      slug: 'clothes',
      types: ['Eastern', 'Western', 'Hijabs & Abayas', 'Sports Clothes', 'Kids Clothes', 'Others']
    },
    { 
      name: 'Fashion Accessories', 
      slug: 'fashion-accessories',
      types: ['Caps', 'Scarves', 'Ties', 'Belts', 'Socks', 'Gloves', 'Cufflinks', 'Sunglasses']
    },
    { 
      name: 'Makeup', 
      slug: 'makeup',
      types: ['Brushes', 'Lips', 'Eyes', 'Face', 'Nails', 'Accessories', 'Others']
    },
    { 
      name: 'Skin & Hair', 
      slug: 'skin-hair',
      types: ['Hair Care', 'Skin Care']
    },
    { 
      name: 'Wedding', 
      slug: 'wedding',
      types: ['Bridal', 'Grooms', 'Formal']
    },
    { 
      name: 'Footwear', 
      slug: 'footwear'
    },
    { 
      name: 'Bags', 
      slug: 'bags'
    },
    { 
      name: 'Jewellery', 
      slug: 'jewellery'
    },
    { 
      name: 'Watches', 
      slug: 'watches'
    },
    { 
      name: 'Fragrance', 
      slug: 'fragrance'
    },
    { 
      name: 'Others', 
      slug: 'others'
    }
  ],
};

const provinces: Province[] = [
  { name: 'Punjab', cities: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur'] },
  { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Thatta'] },
  { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Bannu'] },
  { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi'] },
  { name: 'Islamabad Capital Territory', cities: ['Islamabad'] },
];

// Components
const DynamicCategorySidebar = ({
  selectedCategory,
  selectedSubCategory,
  selectedType,
  onSubCategorySelect,
  onTypeSelect,
}: {
  selectedCategory: string;
  selectedSubCategory: string | null;
  selectedType: string | null;
  onSubCategorySelect: (subCategory: string | null) => void;
  onTypeSelect: (type: string | null) => void;
}) => {
  const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);
  const [showMoreSubCategories, setShowMoreSubCategories] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleSubCategory = (slug: string) => {
    if (selectedSubCategory === slug) {
      router.push('/fashion-beauty');
      onSubCategorySelect(null);
      onTypeSelect(null);
    } else {
      router.push(`/fashion-beauty/${slug}`);
      onSubCategorySelect(slug);
      onTypeSelect(null);
    }
  };

  const toggleType = (type: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (selectedType === type) {
      params.delete('type');
      onTypeSelect(null);
    } else {
      params.set('type', type);
      onTypeSelect(type);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleShowMoreCategories = () => setShowMoreCategories((prev) => !prev);
  const toggleShowMoreSubCategories = () => setShowMoreSubCategories((prev) => !prev);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">All Categories</h3>
      <div className="space-y-1">
        {(showMoreCategories ? categories : categories.slice(0, 4)).map((category) => (
          <div key={category.slug} className="cursor-pointer">
            <div
              className={`py-1 px-2 hover:bg-gray-100 ${selectedCategory === category.slug ? 'text-blue-600 font-medium' : 'text-gray-800'}`}
              style={{ fontSize: '12px', lineHeight: '1.5' }}
            >
              {category.name}
            </div>

            {selectedCategory === category.slug && subCategories[category.slug] && (
              <div className="ml-4 space-y-1">
                {subCategories[category.slug]
                  .slice(0, showMoreSubCategories ? undefined : 6)
                  .map((sub, index) => (
                    <div key={index}>
                      <div
                        className={`py-1 cursor-pointer hover:text-blue-600 ${selectedSubCategory === sub.slug ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                        onClick={() => toggleSubCategory(sub.slug)}
                        style={{ fontSize: '12px', lineHeight: '1.5' }}
                      >
                        {sub.name}
                      </div>
                      {selectedSubCategory === sub.slug && sub.types && (
                        <div className="ml-4 space-y-1">
                          {sub.types.map((type, idx) => (
                            <div
                              key={idx}
                              className={`py-1 cursor-pointer hover:text-blue-600 ${selectedType === type ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                              onClick={() => toggleType(type)}
                              style={{ fontSize: '11px', lineHeight: '1.5' }}
                            >
                              {type}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                {subCategories[category.slug].length > 6 && (
                  <button
                    onClick={toggleShowMoreSubCategories}
                    className="text-blue-600 text-xs ml-2"
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

const LocationSidebar = () => {
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

const PriceFilter = () => {
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [isPriceSet, setIsPriceSet] = useState<boolean>(false);

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
    </div>
  );
};

const ConditionFilter = ({
  selectedConditions,
  onConditionChange,
}: {
  selectedConditions: string[];
  onConditionChange: (condition: string) => void;
}) => {
  const conditions = ['New', 'Used', 'Refurbished'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Condition</h3>
      <div className="space-y-2">
        {conditions.map((condition) => (
          <div key={condition} className="flex items-center">
            <input
              type="checkbox"
              id={`condition-${condition}`}
              checked={selectedConditions.includes(condition)}
              onChange={() => onConditionChange(condition)}
              className="mr-2"
            />
            <label htmlFor={`condition-${condition}`} className="text-sm">
              {condition}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const FashionProductCard = ({
  products,
  loading = false
}: {
  products: FashionProduct[];
  loading?: boolean;
}) => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

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
        const condition = product.fashion_beauty_details?.condition;
        
        return (
          <article
            key={product.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={product.images?.[0]?.url || '/images/fashion-placeholder.png'}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {condition === 'New' && (
                <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  New
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
                {product.title}
              </h4>

              {product.sub_category?.name && (
                <div className="text-gray-600 text-xs mt-1">
                  <span className="font-medium">Category:</span> {product.sub_category.name}
                </div>
              )}

              {condition && (
                <div className="text-gray-600 text-xs mt-1">
                  <span className="font-medium">Condition:</span> {condition}
                </div>
              )}

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

const FashionAndBeautySlugPage = ({ params, searchParams }: { 
  params: { slug?: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('fashion-beauty');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    condition: [],
    location: [],
    type: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    location: true,
    condition: true,
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Extract filters from URL
 useEffect(() => {
  const subCategory = params?.slug?.[0] || null;
  const type = typeof searchParams?.type === 'string' ? searchParams.type : null;

  setSelectedSubCategory(subCategory);
  setSelectedType(type);
}, [params, searchParams]);

  const fetchFashionProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (selectedSubCategory) queryParams.append('subcategory', selectedSubCategory);
      if (selectedType) queryParams.append('type', selectedType);
      
      // Add condition filters if selected
      if (selectedFilters.condition.length > 0) {
        queryParams.append('condition', selectedFilters.condition.join(','));
      }

      const url = `http://127.0.0.1:8000/api/fashion-products?${queryParams.toString()}`;
      const response = await axios.get(url);
      
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching fashion products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSubCategory, selectedType, selectedFilters.condition]);

  useEffect(() => {
    fetchFashionProducts();
  }, [fetchFashionProducts]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleConditionChange = (condition: string) => {
    setSelectedFilters(prev => {
      const newConditions = prev.condition.includes(condition)
        ? prev.condition.filter(c => c !== condition)
        : [...prev.condition, condition];
      
      return {
        ...prev,
        condition: newConditions,
      };
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedFilters({
      condition: [],
      location: [],
      type: [],
    });
    setSelectedSubCategory(null);
    setSelectedType(null);
    router.push('/fashion-beauty');
  };

  const getDisplayName = () => {
    if (selectedType) return selectedType;
    if (selectedSubCategory) {
      const subCat = subCategories['fashion-beauty'].find(
        sub => sub.slug === selectedSubCategory
      );
      return subCat?.name || selectedSubCategory;
    }
    return 'Fashion & Beauty';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Fashion & Beauty</span>
            {selectedSubCategory && (
              <>
                <span className="mx-2">›</span>
                <span>{getDisplayName()}</span>
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
              onSubCategorySelect={setSelectedSubCategory}
              onTypeSelect={setSelectedType}
            />
            <ConditionFilter
              selectedConditions={selectedFilters.condition}
              onConditionChange={handleConditionChange}
            />
            <LocationSidebar />
            <PriceFilter />
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Fashion & Beauty</h1>
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiFilter /> Filters
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {getDisplayName()} products
                {selectedFilters.condition.length > 0 && (
                  <span> ({selectedFilters.condition.join(', ')})</span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
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

            <FashionProductCard 
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

              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('condition')}
                >
                  <h4 className="font-medium text-gray-800">Condition</h4>
                  {expandedSections.condition ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedSections.condition && (
                  <div className="mt-3 space-y-2">
                    {['New', 'Used', 'Refurbished'].map(condition => (
                      <div key={condition} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`mobile-condition-${condition}`}
                          checked={selectedFilters.condition.includes(condition)}
                          onChange={() => handleConditionChange(condition)}
                          className="mr-2"
                        />
                        <label htmlFor={`mobile-condition-${condition}`} className="text-sm">
                          {condition}
                        </label>
                      </div>
                    ))}
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

export default FashionAndBeautySlugPage;