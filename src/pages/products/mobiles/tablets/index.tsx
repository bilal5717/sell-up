
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
  LuMapPin, 
  LuWifi, 
  LuWifiOff 
} from 'react-icons/lu';
import axios from 'axios';
import { usePathname, useSearchParams } from 'next/navigation';
import PriceFilter from '@/components/filters/PriceFilter';

// Interfaces
interface TabletProduct {
  id: number;
  post_id: number;
  brand: string;
  model: string;
  condition: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  pta_status?: string;
  title?: string;
  category?: string;
  sub_category?: string;
  type?: string;
  size?: string;
}

interface FilterState {
  condition: string[];
  location: string[];
  type: string[];
  brands: string[];
}

interface Category {
  name: string;
  slug: string;
}

interface Province {
  name: string;
  cities: string[];
}

// Tablet-specific Data
const tabletCategories: Category[] = [
  { name: 'Mobile Phones', slug: 'mobile-phones' },
  { name: 'Tablets', slug: 'tablets' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Smart Watches', slug: 'smart-watches' },
];

const TABLET_BRANDS = ['Apple', 'Samsung', 'Huawei', 'Lenovo', 'Microsoft', 'Amazon', 'Other'];

const conditions = ['New', 'Used', 'Open Box', 'Refurbished', 'For Parts'];

const provinces: Province[] = [
  { name: 'Punjab', cities: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur'] },
  { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Thatta'] },
  { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Bannu'] },
  { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi'] },
  { name: 'Islamabad Capital Territory', cities: ['Islamabad'] },
];

const typeOptions: Record<string, { label: string; count: number }[]> = {
  'Tablet Accessories': [
    { label: 'Stylus', count: 230 },
    { label: 'Keyboard', count: 146 },
    { label: 'Protector', count: 311 },
  ]
};

// Components
const DynamicBrandFilter: React.FC = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleBrandChange = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);

    // Update URL with brand filters
    const brandFilters = newBrands.map(b => `brand_eq_${encodeURIComponent(b)}`);
    const currentFilters = searchParams.get('filter')?.split(',').filter(f => f) || [];
    const nonBrandFilters = currentFilters.filter(f => !f.startsWith('brand_eq_'));
    const newFilters = [...nonBrandFilters, ...brandFilters].filter(f => f);
    const query = newFilters.length ? `?filter=${newFilters.join(',')}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  const clearSelection = () => {
    setSelectedBrands([]);
    // Remove brand filters from URL
    const currentFilters = searchParams.get('filter')?.split(',').filter(f => f) || [];
    const nonBrandFilters = currentFilters.filter(f => !f.startsWith('brand_eq_'));
    const query = nonBrandFilters.length ? `?filter=${nonBrandFilters.join(',')}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  useEffect(() => {
    // Initialize selected brands from URL
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      const brands = filterParam
        .split(',')
        .filter(f => f.startsWith('brand_eq_'))
        .map(f => decodeURIComponent(f.replace('brand_eq_', '')))
        .filter(b => TABLET_BRANDS.includes(b));
      setSelectedBrands(brands);
    } else {
      setSelectedBrands([]);
    }
  }, [searchParams]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Brands</h3>
      {selectedBrands.length > 0 ? (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700 mb-2">
          <span className="text-sm">{selectedBrands.join(', ')}</span>
          <button onClick={clearSelection} className="text-blue-600 text-xs">
            Clear
          </button>
        </div>
      ) : null}
      <div className="space-y-1">
        {TABLET_BRANDS.map((brand) => (
          <label key={brand} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand)}
              onChange={() => handleBrandChange(brand)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="text-gray-700 text-sm">{brand}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const ConditionSelectBox: React.FC = () => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleConditionChange = (condition: string) => {
    const newConditions = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];
    setSelectedConditions(newConditions);

    // Update URL with condition filters
    const conditionFilters = newConditions.map(c => `new_used_eq_${c.toLowerCase()}`);
    const currentFilters = searchParams.get('filter')?.split(',').filter(f => f) || [];
    const nonConditionFilters = currentFilters.filter(f => !f.startsWith('new_used_eq_'));
    const newFilters = [...nonConditionFilters, ...conditionFilters].filter(f => f);
    const query = newFilters.length ? `?filter=${newFilters.join(',')}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  const clearSelection = () => {
    setSelectedConditions([]);
    // Remove condition filters from URL
    const currentFilters = searchParams.get('filter')?.split(',').filter(f => f) || [];
    const nonConditionFilters = currentFilters.filter(f => !f.startsWith('new_used_eq_'));
    const query = nonConditionFilters.length ? `?filter=${nonConditionFilters.join(',')}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  useEffect(() => {
    // Initialize selected conditions from URL
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      const conditionsFromUrl = filterParam
        .split(',')
        .filter(f => f.startsWith('new_used_eq_'))
        .map(f => {
          const condition = f.replace('new_used_eq_', '');
          const conditionMap: Record<string, string> = {
            new: 'New',
            used: 'Used',
            open_box: 'Open Box',
            refurbished: 'Refurbished',
            for_parts: 'For Parts',
          };
          return conditionMap[condition] || condition;
        })
        .filter(c => conditions.includes(c));
      setSelectedConditions(conditionsFromUrl);
    } else {
      setSelectedConditions([]);
    }
  }, [searchParams]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Condition</h3>
      <div>
        {selectedConditions.length > 0 && (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700 mb-2">
            <span className="text-sm">{selectedConditions.join(', ')}</span>
            <button onClick={clearSelection} className="text-blue-600 text-xs">
              Clear
            </button>
          </div>
        )}
        <div className="space-y-1">
          {conditions.map((condition) => (
            <label key={condition} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedConditions.includes(condition)}
                onChange={() => handleConditionChange(condition)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-sm">{condition}</span>
            </label>
          ))}
        </div>
      </div>
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
            <button onClick={clearSelection} className="text-blue-600 text-xs">
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
          <button onClick={clearSelection} className="text-blue-600 text-xs">
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
  const toggleCategory = (slug: string) => {
    onCategorySelect(slug);
    onSubCategorySelect(null);
    onTypeSelect(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Tablet Categories</h3>
      <div className="space-y-1">
        {tabletCategories.map((category) => (
          <div key={category.slug} className="cursor-pointer">
            <Link 
              href={`/products/mobiles/${category.slug}`}
              className={`py-1 px-2 hover:bg-gray-100 block ${selectedCategory === category.slug ? 'text-blue-600 font-medium' : 'text-gray-800'}`}
              onClick={() => toggleCategory(category.slug)}
              style={{ fontSize: '12px', lineHeight: '1.5' }}
            >
              {category.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const TabletProductCard: React.FC<{
  products: TabletProduct[];
  loading?: boolean;
  placeholderCount?: number;
}> = ({
  products = [],
  loading = false,
  placeholderCount = 4
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
        {[...Array(placeholderCount)].map((_, index) => (
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
        <p className="text-gray-500">No tablets found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const isLiked = likedProducts.has(product.id);
        const isPtaApproved = product.pta_status === 'PTA Approved';
        
        return (
          <article
            key={`${product.id}-${product.post_id}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={product.images?.[0]?.url || '/images/placeholder-tablet.png'}
                alt={''}
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
                <div className="flex items-center gap-1">
                  <LuTag />
                  <span>{product.condition}</span>
                </div>
                
                {product.pta_status && product.pta_status !== 'N/A' && (
                  <div className="flex items-center gap-1">
                    {isPtaApproved ? (
                      <LuWifi className="text-green-500" />
                    ) : (
                      <LuWifiOff className="text-red-500" />
                    )}
                    <span>{isPtaApproved ? 'PTA' : 'NON PTA'}</span>
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

const TabletCategoryPage: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number | '', number | '']>(['', '']);
  const [selectedCategory, setSelectedCategory] = useState<string>('tablets');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    condition: [],
    location: [],
    type: [],
    brands: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    condition: true,
    location: true,
    type: true,
    brands: true,
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [products, setProducts] = useState<TabletProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setPriceRange(['', '']);
    setSelectedFilters({
      condition: [],
      location: [],
      type: [],
      brands: [],
    });
    setSelectedSubCategory(null);
    setSelectedType(null);
    router.push(pathname, undefined, { shallow: true });
  };

  const clearNonConditionFilters = () => {
    setPriceRange(['', '']);
    setSelectedFilters(prev => ({
      ...prev,
      location: [],
      type: [],
      brands: [],
    }));
    setSelectedSubCategory(null);
    setSelectedType(null);

    // Update URL with only condition filters
    const conditionFilters = selectedFilters.condition.map(c => `new_used_eq_${c.toLowerCase()}`);
    const query = conditionFilters.length ? `?filter=${conditionFilters.join(',')}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  const handlePriceChange = (minPrice: number | '', maxPrice: number | '') => {
    setPriceRange([minPrice, maxPrice]);

    // Update URL with price and other filters
    const filterParts: string[] = [];

    // Add condition filters
    selectedFilters.condition.forEach(condition => {
      filterParts.push(`new_used_eq_${condition.toLowerCase()}`);
    });

    // Add brand filters
    selectedFilters.brands.forEach(brand => {
      filterParts.push(`brand_eq_${encodeURIComponent(brand)}`);
    });

    // Add price filters
    if (minPrice !== '' && maxPrice !== '') {
      filterParts.push(`price_between_${minPrice}_to_${maxPrice}`);
    } else if (minPrice !== '') {
      filterParts.push(`price_from_${minPrice}`);
    } else if (maxPrice !== '') {
      filterParts.push(`price_to_${maxPrice}`);
    }

    const query = filterParts.length ? `?filter=${filterParts.join(',')}${sortBy ? `&sort_by=${sortBy}` : ''}` : sortBy ? `?sort_by=${sortBy}` : '';
    router.push(`${pathname}${query}`, undefined, { shallow: true });
  };

  useEffect(() => {
    const fetchTabletProducts = async () => {
      try {
        setLoading(true);
        
        // Construct filter string
        const filterParts: string[] = [];

        // Add condition filters
        selectedFilters.condition.forEach(condition => {
          filterParts.push(`new_used_eq_${condition.toLowerCase()}`);
        });

        // Add brand filters
        selectedFilters.brands.forEach(brand => {
          filterParts.push(`brand_eq_${encodeURIComponent(brand)}`);
        });

        // Add price filters
        if (priceRange[0] !== '' && priceRange[1] !== '') {
          filterParts.push(`price_between_${priceRange[0]}_to_${priceRange[1]}`);
        } else if (priceRange[0] !== '') {
          filterParts.push(`price_from_${priceRange[0]}`);
        } else if (priceRange[1] !== '') {
          filterParts.push(`price_to_${priceRange[1]}`);
        }

        const query = new URLSearchParams();
        if (filterParts.length > 0) {
          query.append('filter', filterParts.join(','));
        }
        if (sortBy) {
          query.append('sort_by', sortBy);
        }

        // Fetch products
        const response = await axios.get(`http://127.0.0.1:8000/api/tablets?${query.toString()}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching tablet products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTabletProducts();
  }, [selectedCategory, selectedSubCategory, selectedFilters, priceRange, sortBy]);

  useEffect(() => {
    // Initialize filters from URL
    const filter = searchParams.get('filter');
    const newFilters: FilterState = {
      condition: [],
      location: [],
      type: [],
      brands: [],
    };
    let minPrice: number | '' = '';
    let maxPrice: number | '' = '';

    if (filter) {
      const filterParts = filter.split(',').filter(f => f);
      filterParts.forEach(part => {
        if (part.startsWith('new_used_eq_')) {
          const condition = part.replace('new_used_eq_', '');
          const conditionMap: Record<string, string> = {
            new: 'New',
            used: 'Used',
            open_box: 'Open Box',
            refurbished: 'Refurbished',
            for_parts: 'For Parts',
          };
          if (conditionMap[condition] && !newFilters.condition.includes(conditionMap[condition])) {
            newFilters.condition.push(conditionMap[condition]);
          }
        } else if (part.startsWith('brand_eq_')) {
          const brand = decodeURIComponent(part.replace('brand_eq_', ''));
          if (TABLET_BRANDS.includes(brand) && !newFilters.brands.includes(brand)) {
            newFilters.brands.push(brand);
          }
        } else if (part.startsWith('price_between_')) {
          const [, min, max] = part.match(/price_between_(\d+)_to_(\d+)/) || [];
          if (min && max) {
            minPrice = parseInt(min);
            maxPrice = parseInt(max);
          }
        } else if (part.startsWith('price_from_')) {
          const [, min] = part.match(/price_from_(\d+)/) || [];
          if (min) minPrice = parseInt(min);
        } else if (part.startsWith('price_to_')) {
          const [, max] = part.match(/price_to_(\d+)/) || [];
          if (max) maxPrice = parseInt(max);
        }
      });
    }

    setSelectedFilters(newFilters);
    setPriceRange([minPrice, maxPrice]);

    const sort = searchParams.get('sort_by');
    if (sort) setSortBy(sort);
  }, [searchParams]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-blue-600">Products</Link>
            <span className="mx-2">›</span>
            <Link href="/products/mobiles" className="hover:text-blue-600">Mobiles</Link>
            <span className="mx-2">›</span>
            <Link href="/products/mobiles/tablets" className="hover:text-blue-600">Tablets</Link>
            {selectedSubCategory && (
              <>
                <span className="mx-2">›</span>
                <Link 
                  href={`/products/mobiles/tablets/${selectedSubCategory.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="hover:text-blue-600"
                >
                  {selectedSubCategory}
                </Link>
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
              onSubCategorySelect={setSelectedSubCategory}
              onTypeSelect={setSelectedType}
            />
            <LocationSidebar />
            <PriceFilter 
              minPrice={priceRange[0]}
              maxPrice={priceRange[1]}
              onPriceChange={handlePriceChange}
            />
            <DynamicBrandFilter />
            <ConditionSelectBox />
            {selectedCategory === 'tablet-accessories' && (
              <DynamicTypeFilterBox category="Tablet Accessories" />
            )}
            <button 
              onClick={clearNonConditionFilters}
              className="w-full py-2 border border-gray-300 rounded text-gray-700 font-medium"
            >
              Clear Non-Condition Filters
            </button>
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Tablet Products</h1>
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiFilter /> Filters
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {selectedSubCategory || selectedCategory} products
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

            <TabletProductCard 
              products={products}
              loading={loading}
              placeholderCount={4}
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
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('price')}
              >
                <h4 className="font-medium text-gray-800">Price</h4>
                {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.price && (
                <PriceFilter 
                  minPrice={priceRange[0]}
                  maxPrice={priceRange[1]}
                  onPriceChange={handlePriceChange}
                />
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('condition')}
              >
                <h4 className="font-medium text-gray-800">Condition</h4>
                {expandedSections.condition ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.condition && <ConditionSelectBox />}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('brands')}
              >
                <h4 className="font-medium text-gray-800">Brands</h4>
                {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.brands && <DynamicBrandFilter />}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={clearFilters}
                className="flex-1 py-2 border border-gray-300 rounded text-gray-700 font-medium"
              >
                Clear all
              </button>
              <button 
                onClick={clearNonConditionFilters}
                className="flex-1 py-2 border border-gray-300 rounded text-gray-700 font-medium"
              >
                Clear Non-Condition Filters
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

export default TabletCategoryPage;