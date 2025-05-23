"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
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
  vehicle_details?: {
    make: string;
    model: string;
    year: string;
    fuel_type: string;
    transmission: string;
    kms_driven: string;
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
const brandOptions: Record<string, Brand[]> = {
  'Vehicles': [
    { name: 'Toyota', count: 7389, models: ['Corolla', 'Camry', 'Hilux', 'Land Cruiser'] },
    { name: 'Honda', count: 5164, models: ['Civic', 'Accord', 'City', 'CR-V'] },
    { name: 'Suzuki', count: 2032, models: ['Mehran', 'Cultus', 'Swift', 'Alto'] },
    { name: 'Nissan', count: 1539, models: ['Sunny', 'March', 'Sentra'] },
    { name: 'BMW', count: 940, models: ['3 Series', '5 Series', 'X5'] },
    { name: 'Mercedes', count: 885, models: ['C-Class', 'E-Class', 'S-Class'] },
  ]
};

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
  'vehicles': [
    { name: 'Cars', types: [
      'Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Convertible', 'Wagon', 'Van'
    ]},
    { name: 'Cars On Installments', types: [
      'New Cars', 'Used Cars', 'Commercial Vehicles'
    ]},
    { name: 'Car Care', types: [
      'Air Fresher', 'Cleaners', 'Compound Polishes', 'Covers', 
      'Microfiber Clothes', 'Shampoos', 'Waxes', 'Other'
    ]},
    { name: 'Car Accessories', types: [
      'Tools & Gadget', 'Safety & Security', 'Interior', 
      'Exterior', 'Audio & Multimedia', 'Other'
    ]},
    { name: 'Spare Parts', types: [
      'Engines', 'Fenders', 'Filters', 'Front Grills', 'Fuel Pump', 'Gasket & Seals',
      'Horns', 'Ignition Coil', 'Lights', 'Mirrors', 'Oxygen Sensors', 'Power Steering',
      'Radiators & Coolants', 'Spark Plugs', 'Tyres', 'Windscreens', 'Wipers',
      'AC & Heating', 'Batteries', 'Brakes', 'Bumpers', 'Other'
    ]},
    { name: 'Oil & Lubricant', types: [
      'Chain Lubes', 'Brake Oil', 'Engine Oil', 'Fuel Additives',
      'Gear Oil', 'Multipurpose Grease', 'Coolants'
    ]},
    { name: 'Buses, Vans & Trucks', types: [
      'Mini Bus', 'Coaster', 'Hiace', 'Trucks', 'Pickups', 'Other'
    ]},
    { name: 'Rikshaw & Chingchi', types: [
      'Rikshaw', 'Chingchi', 'Other'
    ]},
    { name: 'Tractors & Trailers', types: [
      'Tractor', 'Trailer', 'Other'
    ]},
    { name: 'Boats', types: [
      'Fishing Boat', 'Speed Boat', 'Yacht', 'Other'
    ]},
    { name: 'Other Vehicles' }
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
  'Cars': [
    { label: 'Sedan', count: 930 },
    { label: 'SUV', count: 860 },
    { label: 'Hatchback', count: 410 },
  ],
  'Car Care': [
    { label: 'Air Fresher', count: 420 },
    { label: 'Cleaners', count: 380 },
    { label: 'Shampoos', count: 250 },
  ],
  'Spare Parts': [
    { label: 'Engines', count: 320 },
    { label: 'Batteries', count: 280 },
    { label: 'Tyres', count: 510 },
  ]
};

// Reuse all the same components from before, just updating the category-specific parts
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
const DynamicCategorySidebar: React.FC<{
  selectedSubCategory: string | null;
  selectedType: string | null;
  onSubCategorySelect: (subCategory: string | null) => void;
  onTypeSelect: (type: string | null) => void;
}> = ({
  selectedSubCategory,
  selectedType,
  onSubCategorySelect,
  onTypeSelect,
}) => {
  const [showMoreSubCategories, setShowMoreSubCategories] = useState(false);
  const router = useRouter();

  const vehicleSubCategories = subCategories['vehicles'] || [];

  const slugify = (str: string) =>
    str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  const pushSlug = (subCategory?: string | null, type?: string | null) => {
    const slug = type ? slugify(type) : subCategory ? slugify(subCategory) : '';
    if (slug) router.push(`/${slug}`, undefined, { shallow: true });

  };

  const toggleSubCategory = (name: string) => {
    if (selectedSubCategory === name) {
      onSubCategorySelect(null);
      onTypeSelect(null);
      pushSlug(null, null);
    } else {
      onSubCategorySelect(name);
      onTypeSelect(null);
      pushSlug(name, null);
    }
  };

  const toggleType = (type: string) => {
    if (selectedType === type) {
      onTypeSelect(null);
      pushSlug(selectedSubCategory, null);
    } else {
      onTypeSelect(type);
      pushSlug(null, type);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Vehicles</h3>
      <div className="space-y-1">
        {(showMoreSubCategories ? vehicleSubCategories : vehicleSubCategories.slice(0, 6)).map((sub, index) => (
          <div key={index}>
            <div
              className={`py-1 px-2 cursor-pointer hover:text-blue-600 ${
                selectedSubCategory === sub.name ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
              style={{ fontSize: '12px', lineHeight: '1.5' }}
              onClick={() => toggleSubCategory(sub.name)}
            >
              {sub.name}
            </div>
            {sub.types && selectedSubCategory === sub.name && (
              <div className="ml-4 space-y-1">
                {sub.types.map((type, i) => (
                  <div
                    key={i}
                    className={`py-1 cursor-pointer hover:text-blue-600 ${
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
        {vehicleSubCategories.length > 6 && (
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


const VehiclesProductCard: React.FC<{ products: Product[]; loading?: boolean }> = ({
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
        <p className="text-gray-500">No vehicles found</p>
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
                alt={product.title || 'Vehicle'}
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
                  <span>{product.condition || 'Not Specified'}</span>
                </div>
                {product.vehicle_details?.make && (
                  <div className="flex items-center gap-1">
                    <span>{product.vehicle_details.make}</span>
                  </div>
                )}
                {product.vehicle_details?.model && (
                  <div className="flex items-center gap-1">
                    <span>{product.vehicle_details.model}</span>
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

const VehiclesCategoryPage: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('vehicles');
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
    condition: true,
    location: true,
    type: true,
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
    setSelectedType(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/vehicles');
        console.log(response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Vehicles</span>
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
            {selectedSubCategory && typeOptions[selectedSubCategory] && (
              <DynamicTypeFilterBox category={selectedSubCategory} />
            )}
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Vehicles</h1>
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
                  `Showing ${selectedSubCategory} vehicles${selectedType ? ` (${selectedType})` : ''}` : 
                  'Showing all vehicles'}
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

            <VehiclesProductCard 
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

export default VehiclesCategoryPage;