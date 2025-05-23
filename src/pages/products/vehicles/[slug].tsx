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

interface Province {
  name: string;
  cities: string[];
}

interface TypeOption {
  label: string;
  count: number;
}

interface SubCategory {
  name: string;
  slug: string;
  types?: string[];
}
interface CategoryData {
  [key: string]: SubCategory[];
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

const subCategories: SubCategory[] = [
  { name: 'Cars', slug: 'cars', types: ['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Convertible', 'Wagon', 'Van'] },
  { name: 'Cars On Installments', slug: 'cars-on-installments', types: ['New Cars', 'Used Cars', 'Commercial Vehicles'] },
  { name: 'Car Care', slug: 'car-care', types: ['Air Fresher', 'Cleaners', 'Compound Polishes', 'Covers', 'Microfiber Clothes', 'Shampoos', 'Waxes', 'Other'] },
  { name: 'Car Accessories', slug: 'car-accessories', types: ['Tools & Gadget', 'Safety & Security', 'Interior', 'Exterior', 'Audio & Multimedia', 'Other'] },
  { name: 'Spare Parts', slug: 'spare-parts', types: ['Engines', 'Fenders', 'Filters', 'Front Grills', 'Fuel Pump', 'Gasket & Seals', 'Horns', 'Ignition Coil', 'Lights', 'Mirrors', 'Oxygen Sensors', 'Power Steering', 'Radiators & Coolants', 'Spark Plugs', 'Tyres', 'Windscreens', 'Wipers', 'AC & Heating', 'Batteries', 'Brakes', 'Bumpers', 'Other'] },
  { name: 'Oil & Lubricant', slug: 'oil-and-lubricant', types: ['Chain Lubes', 'Brake Oil', 'Engine Oil', 'Fuel Additives', 'Gear Oil', 'Multipurpose Grease', 'Coolants'] },
  { name: 'Buses, Vans & Trucks', slug: 'buses,-vans-and-trucks', types: ['Mini Bus', 'Coaster', 'Hiace', 'Trucks', 'Pickups', 'Other'] },
  { name: 'Rikshaw & Chingchi', slug: 'rikshaw-and-chingchi', types: ['Rikshaw', 'Chingchi', 'Other'] },
  { name: 'Tractors & Trailers', slug: 'tractors-and-trailers', types: ['Tractor', 'Trailer', 'Other'] },
  { name: 'Boats', slug: 'boats', types: ['Fishing Boat', 'Speed Boat', 'Yacht', 'Other'] },
  { name: 'Other Vehicles', slug: 'other-vehicles' }
];


const typeOptions: Record<string, TypeOption[]> = {
  'cars': [
    { label: 'Sedan', count: 930 },
    { label: 'SUV', count: 860 },
    { label: 'Hatchback', count: 410 },
    { label: 'Crossover', count: 320 },
    { label: 'Coupe', count: 210 }
  ],
  'cars-on-installments': [
    { label: 'New Cars', count: 540 },
    { label: 'Used Cars', count: 380 },
    { label: 'Commercial Vehicles', count: 120 }
  ],
  'car-care': [
    { label: 'Air Freshener', count: 420 },
    { label: 'Cleaners', count: 380 },
    { label: 'Shampoos', count: 250 },
    { label: 'Waxes', count: 180 }
  ],
  'car-accessories': [
    { label: 'Tools & Gadget', count: 310 },
    { label: 'Safety & Security', count: 290 },
    { label: 'Audio & Multimedia', count: 270 }
  ],
  'spare-parts': [
    { label: 'Engines', count: 320 },
    { label: 'Batteries', count: 280 },
    { label: 'Tyres', count: 510 },
    { label: 'Brakes', count: 230 }
  ],
  'oil-lubricant': [
    { label: 'Engine Oil', count: 450 },
    { label: 'Brake Oil', count: 210 },
    { label: 'Gear Oil', count: 190 }
  ],
  'buses-vans-trucks': [
    { label: 'Mini Bus', count: 120 },
    { label: 'Coaster', count: 90 },
    { label: 'Hiace', count: 150 }
  ],
  'rikshaw-chingchi': [
    { label: 'Rikshaw', count: 180 },
    { label: 'Chingchi', count: 150 }
  ],
  'tractors-trailers': [
    { label: 'Tractor', count: 110 },
    { label: 'Trailer', count: 80 }
  ],
  'boats': [
    { label: 'Fishing Boat', count: 60 },
    { label: 'Speed Boat', count: 40 }
  ]
};

// Components
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

const DynamicTypeFilterBox: React.FC<{ slug: string }> = ({ slug }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const router = useRouter();

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

  const types = typeOptions[slug] || [];

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
  slug: string | string[] | undefined;
  onSubCategorySelect: (slug: string) => void;
}> = ({ slug, onSubCategorySelect }) => {
  const [showMoreSubCategories, setShowMoreSubCategories] = useState(false);
  const [showMoreTypes, setShowMoreTypes] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const router = useRouter();
  const query = router.query;

  const subCategories: SubCategory[] = [
    { name: 'Cars', slug: 'cars', types: [] },
    { name: 'Cars On Installments', slug: 'cars-on-installments', types: [] },
    {
      name: 'Car Care', slug: 'car-care', types: [
        'Air Fresher', 'Cleaners', 'Compound Polishes', 'Covers', 'Microfiber Clothes',
        'Shampoos', 'Waxes', 'Other'
      ]
    },
    {
      name: 'Car Accessories', slug: 'car-accessories', types: [
        'Tools & Gadget', 'Safety & Security', 'Interior', 'Exterior', 'Audio & Multimedia', 'Other'
      ]
    },
    {
      name: 'Spare Parts', slug: 'spare-parts-vehicle', types: [
        'Engines', 'Fenders', 'Filters', 'Front Grills', 'Fuel Pump', 'Gasket & Seals', 'Horns',
        'Ignition Coil', 'Ignition Switches', 'Insulation Sheets', 'Lights', 'Mirrors', 'Oxygen Sensors',
        'Power Steering', 'Radiators & Coolants', 'Spark Plugs', 'Sun Visor', 'Suspension Parts', 'Trunk Parts',
        'Tyres', 'Windscreens', 'Wipers', 'AC & Heating', 'Antennas', 'Batteries', 'Belts & Cables', 'Bonnets',
        'Brakes', 'Bumpers', 'Bushing', 'Buttons', 'Catalytic Converters', 'Door & Components', 'Engine Shields'
      ]
    },
    {
      name: 'Oil & Lubricant', slug: 'oil-and-lubricant', types: [
        'Chain Lubes And Cleaners', 'Brake Oil', 'CUTE Oil', 'Engine Oil', 'Fuel Additives',
        'Gear Oil', 'Multipurpose Grease', 'Oil additives', 'Coolants'
      ]
    },
    { name: 'Buses, Vans & Trucks', slug: 'buses-vans-trucks', types: [] },
    { name: 'Rikshaw & Chingchi', slug: 'rikshaw-chingchi', types: [] },
    { name: 'Tractors & Trailers', slug: 'tractors-trailers', types: [] },
    { name: 'Boats', slug: 'boats', types: [] },
    { name: 'Other Vehicles', slug: 'other-vehicles', types: [] }
  ];

  const selectedSubCat = subCategories.find(sc => sc.slug === slug);
  const visibleSubCategories = showMoreSubCategories ? subCategories : subCategories.slice(0, 6);

 const handleTypeClick = (type: string) => {
  const typeSlug = type.toLowerCase().replace(/\s+/g, '-');
  router.push(`/${typeSlug}`, undefined, { shallow: true });
};


  useEffect(() => {
    if (query.type && typeof query.type === 'string') {
      setSelectedType(query.type);
    } else {
      setSelectedType(null);
    }
  }, [query]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Vehicles</h3>
      <div className="space-y-1">
        {visibleSubCategories.map((subCategory) => (
          <div key={subCategory.slug}>
            <div
              className={`py-1 px-2 cursor-pointer hover:text-blue-600 ${
                slug === subCategory.slug ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }`}
              onClick={() => {
                onSubCategorySelect(subCategory.slug);
                setShowMoreTypes(false);
                setSelectedType(null);
              }}
              style={{ fontSize: '13px', lineHeight: '1.5' }}
            >
              {subCategory.name}
            </div>

            {/* Only show types of selected subcategory */}
            {slug === subCategory.slug && subCategory.types && subCategory.types.length > 0 && (
              <div className="pl-4 mt-1 text-xs text-gray-600 space-y-1">
                {(showMoreTypes ? subCategory.types : subCategory.types.slice(0, 6)).map((type, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleTypeClick(type)}
                    className={`truncate cursor-pointer ${
                      selectedType === type ? 'text-blue-500 font-medium' : 'hover:text-blue-500'
                    }`}
                  >
                    • {type}
                  </div>
                ))}

                {subCategory.types.length > 6 && (
                  <button
                    onClick={() => setShowMoreTypes(prev => !prev)}
                    className="text-blue-500 text-xs mt-1"
                  >
                    {showMoreTypes ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {subCategories.length > 6 && (
          <button
            onClick={() => setShowMoreSubCategories(prev => !prev)}
            className="text-blue-600 text-sm mt-2"
          >
            {showMoreSubCategories ? 'Show Less Categories' : 'Show More Categories'}
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

const VehiclesSlugPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
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
    setSelectedCondition('all');
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query parameters based on selected filters
      const params: Record<string, any> = {
        slug: Array.isArray(slug) ? slug.join('/') : slug,
        sort: sortBy,
        condition: selectedCondition === 'all' ? undefined : selectedCondition,
      };

      if (priceRange[0] > 0 || priceRange[1] < 1000000) {
        params.min_price = priceRange[0];
        params.max_price = priceRange[1];
      }

      // Add selected filters to params
      Object.entries(selectedFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          params[key] = values.join(',');
        }
      });

      const response = await axios.get('http://127.0.0.1:8000/api/vehicles', {
        params,
      });
      
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, [slug, sortBy, selectedCondition, priceRange, selectedFilters]);

  useEffect(() => {
    if (!router.isReady) return;
    fetchProducts();
  }, [router.isReady, fetchProducts]);

  const handleSubCategorySelect = (subCategorySlug: string) => {
    router.push(`/${subCategorySlug}`, undefined, { shallow: true });
  };

  const getSubCategoryName = () => {
    if (!slug) return 'Vehicles';
    const subCategory = subCategories.find(sc => sc.slug === slug);
    return subCategory?.name || 'Vehicles';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Vehicles</span>
            {slug && (
              <>
                <span className="mx-2">›</span>
                <span className="capitalize">{getSubCategoryName()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-4 px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/4 space-y-4">
            <DynamicCategorySidebar 
              slug={slug}
              onSubCategorySelect={handleSubCategorySelect}
            />
            <LocationSidebar />
            <PriceFilter />
            <ConditionSelectBox />
            {slug && typeOptions[slug as string] && (
              <DynamicTypeFilterBox slug={slug as string} />
            )}
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold capitalize">
                {getSubCategoryName()}
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
                Showing {getSubCategoryName().toLowerCase()}
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

            <VehiclesProductCard 
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

export default VehiclesSlugPage;