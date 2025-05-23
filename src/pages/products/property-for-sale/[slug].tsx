
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
  LuMapPin
} from 'react-icons/lu';
import axios from 'axios';

// Interfaces
interface PropertySaleDetails {
  sub_type: string;
  furnish: string;
  bedrooms: string;
  bathrooms: string;
  storeys: string;
  floor_level: string;
  area: string;
  area_unit: string;
  features: string[];
  other_feature: string;
}

interface PropertyProduct {
  id: number;
  post_id: number;
  title: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  property_sale_details?: PropertySaleDetails;
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

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Data
const categories: Category[] = [
  { name: 'Property for Sale', slug: 'property-for-sale' },
];

const subCategories: CategoryData = {
  'property-for-sale': [
    { name: 'Houses', slug: 'house_sale' },
    { name: 'Apartments & Flats', slug: 'apartment_sale' },
    { name: 'Portions & Floors', slug: 'portion_sale' },
    { name: 'Shops, Offices & Commercial Spaces', slug: 'commercial_sale' },
    { name: 'Land & Plots', slug: 'land_sale' },
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
  if (slug === 'property-for-sale') {
    router.push('/products/property-for-sale');
  } else {
    router.push(`/${slug}`);
  }
};

  const toggleSubCategory = (name: string, slug: string) => {
    if (selectedSubCategory === name) {
      onSubCategorySelect(null);
      onTypeSelect(null);
      router.push(`/property-for-sale`);
    } else {
      onSubCategorySelect(name);
      onTypeSelect(null);
      router.push(`/property-for-sale/${slug}`);
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

const LocationSidebar: React.FC<{
  onLocationSelect: (location: string | null) => void;
}> = ({ onLocationSelect }) => {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showMoreCities, setShowMoreCities] = useState<boolean>(false);
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);

  const toggleShowMoreCities = () => setShowMoreCities((prev) => !prev);

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setSelectedCity(null);
    setIsLocationSelected(false);
    onLocationSelect(null);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsLocationSelected(true);
    onLocationSelect(city);
  };

  const clearSelection = () => {
    setSelectedProvince(null);
    setSelectedCity(null);
    setIsLocationSelected(false);
    onLocationSelect(null);
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
  onPriceChange: (min: number | '', max: number | '') => void;
}> = ({ onPriceChange }) => {
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
    onPriceChange(minPrice, maxPrice);
  };

  const clearPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setIsPriceSet(false);
    onPriceChange('', '');
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
        
        return (
          <article
            key={`${product.id}-${product.post_id}`}
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
                {product.property_sale_details?.bedrooms && (
                  <div className="flex items-center gap-1">
                    <span>{product.property_sale_details.bedrooms} Beds</span>
                  </div>
                )}
                {product.property_sale_details?.bathrooms && (
                  <div className="flex items-center gap-1">
                    <span>{product.property_sale_details.bathrooms} Baths</span>
                  </div>
                )}
                {product.property_sale_details?.area && (
                  <div className="flex items-center gap-1">
                    <span>{product.property_sale_details.area} {product.property_sale_details.area_unit}</span>
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

const PropertyForSaleSlugPage: React.FC = () => {
 const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState<{ min: number | ''; max: number | '' }>({ min: '', max: '' });
  const [selectedCategory, setSelectedCategory] = useState<string>('property-for-sale');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    location: true,
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [products, setProducts] = useState<PropertyProduct[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ current_page: 1, last_page: 1, per_page: 12, total: 0 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!pathname) return;

    const pathParts = pathname.split('/').filter(Boolean);
    const categorySlug = 'property-for-sale';

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
    const min = searchParams.get('min_price');
    const max = searchParams.get('max_price');
    const location = searchParams.get('location');

    if (min) setPriceRange(prev => ({ ...prev, min: Number(min) }));
    if (max) setPriceRange(prev => ({ ...prev, max: Number(max) }));
    if (location) setSelectedLocation(location);
  }, [pathname, searchParams]);

    const fetchPropertyProducts = useCallback(async () => {
    try {
      setLoading(true);
      const subCategorySlug = selectedSubCategory 
        ? subCategories['property-for-sale'].find(sub => sub.name === selectedSubCategory)?.slug 
        : null;

      const params = new URLSearchParams();
      if (priceRange.min) params.append('min_price', priceRange.min.toString());
      if (priceRange.max) params.append('max_price', priceRange.max.toString());
      if (selectedLocation) params.append('location', selectedLocation);
      params.append('page', currentPage.toString());
      params.append('per_page', '12');

      const url = subCategorySlug 
        ? `http://127.0.0.1:8000/api/properties-for-sale/${subCategorySlug}`
        : 'http://127.0.0.1:8000/api/properties-for-sale';

      const response = await axios.get(`${url}?${params.toString()}`);
      const { data, pagination } = response.data;

setProducts(Array.isArray(data) ? data : []);
setPagination(pagination || { current_page: 1, last_page: 1, per_page: 12, total: 0 });
    } catch (error) {
      console.error('Error fetching property products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSubCategory, priceRange, selectedLocation, currentPage]);;
  useEffect(() => {
    fetchPropertyProducts();
  }, [fetchPropertyProducts]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (priceRange.min) params.set('min_price', priceRange.min.toString());
    if (priceRange.max) params.set('max_price', priceRange.max.toString());
    if (selectedLocation) params.set('location', selectedLocation);

    const subCategorySlug = selectedSubCategory 
      ? subCategories['property-for-sale'].find(sub => sub.name === selectedSubCategory)?.slug 
      : null;

    const url = subCategorySlug 
      ? `/property-for-sale/${subCategorySlug}?${params.toString()}`
      : `/property-for-sale?${params.toString()}`;

    router.push(url);
  }, [selectedSubCategory, priceRange, selectedLocation]);
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedLocation(null);
    setSelectedSubCategory(null);
    setCurrentPage(1);
    router.push('/property-for-sale');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.last_page) {
      setCurrentPage(page);
    }
  };

  const handlePriceChange = (min: number | '', max: number | '') => {
    setPriceRange({ min, max });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleLocationSelect = (location: string | null) => {
    setSelectedLocation(location);
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Property for Sale</span>
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
            <LocationSidebar onLocationSelect={handleLocationSelect} />
            <PriceFilter onPriceChange={handlePriceChange} />
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Property for Sale</h1>
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
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border text-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  Previous
                </button>
                {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded border text-sm ${
                      currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.last_page}
                  className={`px-3 py-1 rounded border text-sm ${currentPage === pagination.last_page ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  Next
                </button>
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
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ min: Number(e.target.value) || '', max: priceRange.max })}
                      />
                      <span className="mx-2">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-24 p-2 border rounded text-sm"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ min: priceRange.min, max: Number(e.target.value) || '' })}
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

export default PropertyForSaleSlugPage;
