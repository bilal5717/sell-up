"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
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

// Interfaces
interface BikeProduct {
  id: number;
  post_id: number;
  brand: string;
  model: string;
  condition: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  type?: string;
  title?: string;
  category?: string;
  sub_category?: string;
  engine_capacity?: string;
  year?: string;
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

interface SubCategory {
  name: string;
  slug: string;
  types?: string[];
}

interface Province {
  name: string;
  cities: string[];
}

// Data
const conditions = ['New', 'Used', 'Open Box', 'Refurbished', 'For Parts'];

const provinces: Province[] = [
  { name: 'Punjab', cities: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur'] },
  { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Thatta'] },
  { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Bannu'] },
  { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi'] },
  { name: 'Islamabad Capital Territory', cities: ['Islamabad'] },
];

const bikeSubCategories: SubCategory[] = [
  { 
    name: 'MotorCycles', 
    slug: 'motorcycles',
    types: ['Standard', 'Sports & Heavy Bikes', 'Cruiser', 'Trail', 'Cafe Racers', 'Electric Bikes', 'Others']
  },
  { 
    name: 'Spare Parts', 
    slug: 'spare-parts',
    types: [
      'Air filter', 'Carburelors', 'Bearing', 'Side Mirrors', 'Motorcycle Batteries', 
      'Switches', 'Lighting', 'Cylinders', 'Clutches', 'Pistons', 'Chain,cover & sprockets',
      'Brakes', 'Handle Bavs & Grips', 'Levers', 'Seats', 'Exhausts', 'Fuel Tanks',
      'Horns', 'Speedometers', 'Plugs', 'Stands', 'Tyres & Tubes', 'Other spareparts',
      'Body & Frume', 'Slincer', 'Steering', 'Suspension', 'Transmission'
    ]
  },
  { 
    name: 'Bike Accessories', 
    slug: 'bike-accessories',
    types: [
      'Bicycle,Air pumps', 'Oil,Lubricants', 'Bike Covers', 'Bike Gloves', 'Helmets',
      'Tail Boxes', 'Bike jackets', 'Bike locks', 'Safe Guards Other Bike-accessories',
      'Chargers sticker & emblems'
    ]
  },
  { 
    name: 'Bicycle', 
    slug: 'bicycle',
    types: [
      'Road Bikes', 'Mountain Bikes', 'Hybrid Bikes', 'BMX Bike', 'Electric Bicycle',
      'Folding bikes', 'Other Bicycle'
    ]
  },
  { 
    name: 'ATV & Quads', 
    slug: 'atv-quads',
    types: ['Petrol', 'Electric', 'Other']
  },
  { 
    name: 'Scooters', 
    slug: 'scooters',
    types: ['Standard', 'Electric', 'Others']
  },
  { 
    name: 'Others', 
    slug: 'others',
    types: ['Vintage', 'Custom', 'Other']
  },
];

const brandOptions: Brand[] = [
  { name: 'Honda', count: 12500, models: ['CBR', 'CG 125', 'CD 70', 'CB 150'] },
  { name: 'Yamaha', count: 9800, models: ['YZF-R1', 'YZF-R15', 'FZS', 'YB125Z'] },
  { name: 'Suzuki', count: 7500, models: ['GSX-R', 'GD 110', 'GS 150'] },
  { name: 'Kawasaki', count: 4200, models: ['Ninja', 'Z900', 'Versys'] },
  { name: 'United', count: 3800, models: ['US 100', 'US 125', 'US 70'] },
  { name: 'Road Prince', count: 3200, models: ['RP 125', 'RP 70', 'RP 150'] },
];
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

// Components
const DynamicCategorySidebar: React.FC<{
  selectedSubCategory: string | null;
  selectedType: string | null;
  onSubCategorySelect: (slug: string) => void;
  onTypeSelect: (slug: string) => void;
}> = ({ selectedSubCategory, selectedType, onSubCategorySelect, onTypeSelect }) => {
  const [showMoreSubCategories, setShowMoreSubCategories] = useState(false);
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const toggleSubCategory = (slug: string) => {
    if (selectedSubCategory === slug) {
      onSubCategorySelect('');
      onTypeSelect('');
      router.push('/bikes', undefined, { shallow: true });
    } else {
      onSubCategorySelect(slug);
      onTypeSelect('');
      router.push(`/bikes/${slug}`, undefined, { shallow: true });
    }
  };

  const toggleType = (type: string) => {
    if (selectedType === type) {
      onTypeSelect('');
      router.push(`/bikes/`, undefined, { shallow: true });
    } else {
      onTypeSelect(type);
      router.push(`/bikes/${type.toLowerCase().replace(/\s+/g, '-')}`, undefined, { shallow: true });
    }
  };

  const toggleSubCategoryExpansion = (slug: string) => {
    setExpandedSubCategories(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  // Show only the selected subcategory with its types when a subcategory is selected
  const displaySubCategories = selectedSubCategory 
    ? bikeSubCategories.filter(sc => sc.slug === selectedSubCategory)
    : (showMoreSubCategories ? bikeSubCategories : bikeSubCategories.slice(0, 5));

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Bikes Categories</h3>
      <div className="space-y-1">
        {displaySubCategories.map((subCategory) => (
          <div key={subCategory.slug}>
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSubCategoryExpansion(subCategory.slug)}
            >
              <div
                className={`py-1 px-2 hover:text-blue-600 ${
                  selectedSubCategory === subCategory.slug ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                style={{ fontSize: '12px', lineHeight: '1.5' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubCategory(subCategory.slug);
                }}
              >
                {subCategory.name}
              </div>
              {subCategory.types && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubCategoryExpansion(subCategory.slug);
                  }}
                  className="p-1"
                >
                  {expandedSubCategories[subCategory.slug] ? (
                    <FiChevronUp className="text-gray-500" />
                  ) : (
                    <FiChevronDown className="text-gray-500" />
                  )}
                </button>
              )}
            </div>
            
            {subCategory.types && (expandedSubCategories[subCategory.slug] || selectedSubCategory === subCategory.slug) && (
              <div className="ml-4 space-y-1">
                {subCategory.types.map((type) => (
                  <div
                    key={type}
                    className={`py-1 px-2 cursor-pointer hover:text-blue-600 ${
                      selectedType === type ? 'text-blue-600 font-medium' : 'text-gray-600'
                    }`}
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
        {!selectedSubCategory && bikeSubCategories.length > 5 && (
          <button
            onClick={() => setShowMoreSubCategories(prev => !prev)}
            className="text-blue-600 text-sm mt-2"
          >
            {showMoreSubCategories ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
};

const BikeProductCard: React.FC<{
  products: BikeProduct[];
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
        <p className="text-gray-500">No bikes found</p>
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
                src={product.images?.[0]?.url || '/images/bike-placeholder.png'}
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
                {product.brand} {product.model} {product.engine_capacity && `(${product.engine_capacity}cc)`}
              </h4>

              <div className="flex justify-between items-center text-gray-600 text-xs mt-2">
                <div className="flex items-center gap-1">
                  <LuTag />
                  <span>{product.condition}</span>
                </div>
                
                {product.year && (
                  <div className="flex items-center gap-1">
                    <span>{product.year}</span>
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

const BikesCategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    condition: [],
    location: [],
    type: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    condition: true,
    location: true,
    type: true,
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [products, setProducts] = useState<BikeProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Parse the URL to set initial state
  useEffect(() => {
    if (!router.isReady) return;
    
    if (Array.isArray(slug)) {
      if (slug.length >= 1) {
        const subCategory = bikeSubCategories.find(sc => sc.slug === slug[0]);
        if (subCategory) {
          setSelectedSubCategory(subCategory.slug);
        }
      }
      if (slug.length >= 2) {
        // Find the type by matching the slugified version
        const subCategory = bikeSubCategories.find(sc => sc.slug === slug[0]);
        if (subCategory?.types) {
          const type = subCategory.types.find(t => 
            t.toLowerCase().replace(/\s+/g, '-') === slug[1]
          );
          if (type) {
            setSelectedType(type);
          }
        }
      }
    }
  }, [router.isReady, slug]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      const params: Record<string, any> = {
        sort: sortBy,
        condition: selectedCondition === 'all' ? undefined : selectedCondition,
      };

      if (selectedSubCategory) {
        params.sub_category = selectedSubCategory;
      }

      if (selectedType) {
        params.type = selectedType;
      }

      if (priceRange[0] > 0 || priceRange[1] < 1000000) {
        params.min_price = priceRange[0];
        params.max_price = priceRange[1];
      }

      const response = await axios.get('http://127.0.0.1:8000/api/bikes', {
        params,
      });
      
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching bike products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSubCategory, selectedType, sortBy, selectedCondition, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedFilters({
      condition: [],
      location: [],
      type: [],
    });
    setSelectedCondition('all');
  };

  const getCurrentCategoryName = () => {
    if (selectedType) {
      return selectedType;
    }
    if (selectedSubCategory) {
      const subCat = bikeSubCategories.find(sc => sc.slug === selectedSubCategory);
      return subCat?.name || 'Bikes';
    }
    return 'All Bikes';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Bikes</span>
            {selectedSubCategory && (
              <>
                <span className="mx-2">›</span>
                <span>{bikeSubCategories.find(sc => sc.slug === selectedSubCategory)?.name}</span>
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
              selectedSubCategory={selectedSubCategory}
              selectedType={selectedType}
              onSubCategorySelect={setSelectedSubCategory}
              onTypeSelect={setSelectedType}
            />
            <LocationSidebar />
            <PriceFilter />
            <ConditionSelectBox />
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold capitalize">
                {getCurrentCategoryName()}
              </h1>
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiFilter /> Filters
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {getCurrentCategoryName().toLowerCase()}
                <span className="ml-2 text-gray-500">({products.length} results)</span>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-sm text-gray-600">Condition:</span>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="border rounded p-2 text-sm w-full md:w-auto"
                  >
                    <option value="all">All</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded p-2 text-sm w-full md:w-auto"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            <BikeProductCard 
              products={products}
              loading={loading}
            />
            
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
                onClick={() => {
                  setMobileFiltersOpen(false);
                  fetchProducts();
                }}
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

export default BikesCategoryPage;