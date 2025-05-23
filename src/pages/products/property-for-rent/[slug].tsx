"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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

// Interfaces
interface PropertyProduct {
  id: number;
  post_id?: number;
  title: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  property_rent_details?: {
    sub_type: string;
    furnish?: string;
    bedrooms?: string;
    bathrooms?: string;
    storeys?: string;
    floor_level?: string;
    area?: string;
    area_unit?: string;
    features?: string[];
    other_feature?: string;
    rent_period?: string;
    utilities_included?: boolean;
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
  { name: 'Property for Rent', slug: 'property-for-rent' },
];

const subCategories: CategoryData = {
  'property-for-rent': [
    { name: 'Houses', slug: 'house_rent' },
    { name: 'Apartments & Flats', slug: 'apartment_rent' },
    { name: 'Portions & Floors', slug: 'portion_rent' },
    { name: 'Shops, Offices & Commercial Spaces', slug: 'commercial_rent' },
    { name: 'Land & Plots', slug: 'land_rent' },
    { name: 'Roommates & Paying Guests', slug: 'roommates' },
    { name: 'Rooms', slug: 'rooms' },
    { name: 'Vacation Rentals & Guest Houses', slug: 'vacation-rentals' },
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
const DynamicCategorySidebar: React.FC<{
  selectedCategory: string;
  selectedSubCategory: string | null;
  selectedType: string | null;
  onCategorySelect: (category: string) => void;
  onSubCategorySelect: (subCategory: string | null) => void;
  onTypeSelect: (type: string | null) => void;
}> = ({
  selectedCategory,
  selectedSubCategory,
  selectedType,
  onCategorySelect,
  onSubCategorySelect,
  onTypeSelect,
}) => {
  const router = useRouter();
  const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);

  const toggleCategory = (slug: string) => {
    onCategorySelect(slug);
    onSubCategorySelect(null);
    onTypeSelect(null);
    router.push(`/property-for-rent`);
  };

  const toggleSubCategory = (name: string, slug: string) => {
    if (selectedSubCategory === name) {
      onSubCategorySelect(null);
      onTypeSelect(null);
      router.push(`/property-for-rent`);
    } else {
      onSubCategorySelect(name);
      onTypeSelect(null);
      router.push(`/property-for-rent/${slug}`);
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
                      onClick={() => toggleSubCategory(sub.name, sub.slug)}
                      style={{ fontSize: '12px', lineHeight: '1.5' }}
                    >
                      {sub.name}
                    </div>
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

function isPropertyProduct(product: any): product is PropertyProduct {
  return (
    typeof product.id === 'number' &&
    typeof product.title === 'string' &&
    typeof product.price === 'string' &&
    typeof product.location === 'string'
  );
}

const LocationSidebar: React.FC<{
  selectedProvince: string | null;
  selectedCity: string | null;
  onProvinceSelect: (province: string) => void;
  onCitySelect: (city: string) => void;
  onClearSelection: () => void;
}> = ({
  selectedProvince,
  selectedCity,
  onProvinceSelect,
  onCitySelect,
  onClearSelection,
}) => {
  const [showMoreCities, setShowMoreCities] = useState<boolean>(false);
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);

  const toggleShowMoreCities = () => setShowMoreCities((prev) => !prev);

  const handleProvinceSelect = (province: string) => {
    onProvinceSelect(province);
    setIsLocationSelected(false);
  };

  const handleCitySelect = (city: string) => {
    onCitySelect(city);
    setIsLocationSelected(true);
  };

  const clearSelection = () => {
    onClearSelection();
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

const PriceFilter: React.FC<{
  minPrice: number | '';
  maxPrice: number | '';
  onMinPriceChange: (value: number | '') => void;
  onMaxPriceChange: (value: number | '') => void;
  onApplyPriceFilter: () => void;
  onClearPriceFilter: () => void;
  isPriceSet: boolean;
}> = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPriceFilter,
  onClearPriceFilter,
  isPriceSet,
}) => {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onMinPriceChange(isNaN(value) ? '' : value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onMaxPriceChange(isNaN(value) ? '' : value);
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
              onClick={onClearPriceFilter}
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
              onClick={onApplyPriceFilter}
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

const PropertyProductCard: React.FC<{
  products: PropertyProduct[];
  loading?: boolean;
}> = ({
  products = [],
  loading = false
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
        <p className="text-gray-500">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const isLiked = likedProducts.has(product.id);
         if (!isPropertyProduct(product)) {
    console.error('Invalid product data:', product);
    return null;
  }
        return (
          <article
            key={`${product.id}-${product.post_id || product.id}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={product.images?.[0]?.url || '/images/property-placeholder.png'}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                Featured
              </span>
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

              <div className="flex justify-between items-center text-gray-600 text-xs mt-2">
                {product.property_rent_details?.bedrooms && (
                  <div className="flex items-center gap-1">
                    <span>{product.property_rent_details.bedrooms} Beds</span>
                  </div>
                )}
                {product.property_rent_details?.bathrooms && (
                  <div className="flex items-center gap-1">
                    <span>{product.property_rent_details.bathrooms} Baths</span>
                  </div>
                )}
                {product.property_rent_details?.area && (
                  <div className="flex items-center gap-1">
                    <span>{product.property_rent_details.area} {product.property_rent_details.area_unit || 'sq.ft'}</span>
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

const PropertyForRentSlugPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('property-for-rent');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
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
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [products, setProducts] = useState<PropertyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPriceSet, setIsPriceSet] = useState(false);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');

  // Initialize state from URL
  useEffect(() => {
    if (!pathname) return;

    const pathParts = pathname.split('/').filter(Boolean);
    const categorySlug = 'property-for-rent';

    // Initialize subcategory from URL
    if (pathParts.length > 1) {
      const subCategorySlug = pathParts[1];
      const subCategory = subCategories[categorySlug]?.find(sub => sub.slug === subCategorySlug);
      
      if (subCategory) {
        setSelectedSubCategory(subCategory.name);
      } else {
        setSelectedSubCategory(null);
      }
    } else {
      setSelectedSubCategory(null);
    }

    // Initialize filters from query params
    const min = searchParams.get('minPrice');
    const max = searchParams.get('maxPrice');
    const city = searchParams.get('city');

    if (min) setMinPrice(Number(min));
    if (max) setMaxPrice(Number(max));
    if (city) {
      const province = provinces.find(p => p.cities.includes(city));
      if (province) {
        setSelectedProvince(province.name);
        setSelectedCity(city);
      }
    }
  }, [pathname, searchParams]);

  // Fetch products function
  const fetchPropertyProducts = useCallback(async () => {
    try {
      setLoading(true);
      const subCategorySlug = selectedSubCategory 
        ? subCategories['property-for-rent'].find(sub => sub.name === selectedSubCategory)?.slug 
        : null;

      const params = new URLSearchParams();
      if (subCategorySlug) {
        params.append('subCategory', subCategorySlug);
      }
      if (minPrice) {
        params.append('minPrice', minPrice.toString());
      }
      if (maxPrice) {
        params.append('maxPrice', maxPrice.toString());
      }
      if (selectedCity) {
        params.append('city', selectedCity);
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/properties-for-rent?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching property products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSubCategory, minPrice, maxPrice, selectedCity]);

  // Fetch products when filters change
  useEffect(() => {
    fetchPropertyProducts();
  }, [fetchPropertyProducts]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setPriceRange([0, 10000000]);
    setMinPrice('');
    setMaxPrice('');
    setIsPriceSet(false);
    setSelectedFilters({
      condition: [],
      location: [],
      type: [],
    });
    setSelectedSubCategory(null);
    setSelectedProvince(null);
    setSelectedCity(null);
    router.push('/property-for-rent');
  };

  const applyPriceFilter = () => {
    setIsPriceSet(true);
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('minPrice', minPrice.toString());
    else params.delete('minPrice');
    if (maxPrice) params.set('maxPrice', maxPrice.toString());
    else params.delete('maxPrice');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setIsPriceSet(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setSelectedCity(null);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    const params = new URLSearchParams(searchParams.toString());
    params.set('city', city);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearLocationSelection = () => {
    setSelectedProvince(null);
    setSelectedCity(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('city');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Property for Rent</span>
            {selectedSubCategory && (
              <>
                <span className="mx-2">›</span>
                <span>{selectedSubCategory}</span>
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
              selectedType={null}
              onCategorySelect={setSelectedCategory}
              onSubCategorySelect={setSelectedSubCategory}
              onTypeSelect={() => {}}
            />
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onApplyPriceFilter={applyPriceFilter}
              onClearPriceFilter={clearPriceFilter}
              isPriceSet={isPriceSet}
            />
            <LocationSidebar
              selectedProvince={selectedProvince}
              selectedCity={selectedCity}
              onProvinceSelect={handleProvinceSelect}
              onCitySelect={handleCitySelect}
              onClearSelection={clearLocationSelection}
            />
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Property for Rent</h1>
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiFilter /> Filters
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {selectedSubCategory || selectedCategory} properties
                {selectedCity && ` in ${selectedCity}`}
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

            <PropertyProductCard 
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
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                      />
                      <span className="mx-2">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-24 p-2 border rounded text-sm"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                      />
                    </div>
                    <button
                      onClick={applyPriceFilter}
                      className="w-full py-2 bg-blue-600 text-white rounded text-sm"
                    >
                      Apply Price
                    </button>
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

export default PropertyForRentSlugPage;