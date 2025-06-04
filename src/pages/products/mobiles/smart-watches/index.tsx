"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
  LuWifi 
} from 'react-icons/lu';
import axios from 'axios';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import DynamicBrandFilter from '@/components/filters/DynamicBrandFilter';
import ConditionFilter from '@/components/filters/condition';
import LocationSidebar from '@/components/filters/Location';
import PriceFilter from '@/components/filters/PriceFilter';
import DynamicTypeFilterBox from '@/components/filters/DynamicTypeFilterBox';
import DynamicCategorySidebar from '@/components/filters/DynamicCategoryFilter';

// Interfaces
interface SmartWatchProduct {
  id: number;
  post_id: number;
  brand: string;
  model: string;
  condition: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  connectivity?: string;
  title?: string;
  category?: string;
  sub_category?: string;
  type?: string;
  features?: string[];
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

// Smart Watch-specific Data
const WATCH_BRANDS = ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Fitbit', 'Garmin', 'Other'];

const smartWatchCategories: Category[] = [
  { name: 'Mobile Phones', slug: 'mobile-phones' },
  { name: 'Tablets', slug: 'tablets' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Smart Watches', slug: 'smart-watches' },
];

const smartWatchSubCategories: CategoryData = {};

const conditions = ['New', 'Used', 'Open Box', 'Refurbished', 'For Parts'];

const provinces: Province[] = [
  { name: 'Punjab', cities: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur'] },
  { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Thatta'] },
  { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Bannu'] },
  { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi'] },
  { name: 'Islamabad Capital Territory', cities: ['Islamabad'] },
];

const typeOptions: Record<string, { label: string; count: number }[]> = {
  'Smart Watches': [
    { label: 'Bluetooth', count: 930 },
    { label: 'LTE', count: 46 },
    { label: 'GPS', count: 11 },
  ]
};

// Components
const SmartWatchProductCard: React.FC<{
  products: SmartWatchProduct[];
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
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const isLiked = likedProducts.has(product.id);
        const hasConnectivity = product.connectivity && product.connectivity !== 'N/A';
        
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
                
                {hasConnectivity && (
                  <div className="flex items-center gap-1">
                    <LuWifi className="text-green-500" />
                    <span>{product.connectivity}</span>
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

const SmartWatchPage: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number | '', number | '']>(['', '']);
  const [selectedCategory, setSelectedCategory] = useState<string>('smart-watches');
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
  const [products, setProducts] = useState<SmartWatchProduct[]>([]);
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

  const handlePriceChange = (minPrice: number | '', maxPrice: number | '') => {
    setPriceRange([minPrice, maxPrice]);
  };

  const handleConditionChange = (conditions: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      condition: conditions,
    }));
  };

  const handleBrandChange = (brands: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      brands,
    }));
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      type: types,
    }));
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

  useEffect(() => {
    const fetchSmartWatchProducts = async () => {
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

        // Add type filters
        selectedFilters.type.forEach(type => {
          filterParts.push(`connectivity_eq_${encodeURIComponent(type)}`);
        });

        const query = new URLSearchParams();
        if (filterParts.length > 0) {
          query.append('filter', filterParts.join(','));
        }
        if (sortBy) {
          query.append('sort_by', sortBy);
        }

        // Fetch products
        const response = await axios.get(`http://127.0.0.1:8000/api/smart-watches?${query.toString()}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching smart watch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSmartWatchProducts();
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
          if (WATCH_BRANDS.includes(brand) && !newFilters.brands.includes(brand)) {
            newFilters.brands.push(brand);
          }
        } else if (part.startsWith('connectivity_eq_')) {
          const type = decodeURIComponent(part.replace('connectivity_eq_', ''));
          if (typeOptions['Smart Watches'].some(t => t.label === type) && !newFilters.type.includes(type)) {
            newFilters.type.push(type);
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
            <Link href="/smart-watches" className="hover:text-blue-600">Smart Watches</Link>
            {selectedSubCategory && (
              <>
                <span className="mx-2">›</span>
                <Link 
                  href={`/smart-watches/${selectedSubCategory.toLowerCase().replace(/\s+/g, '-')}`} 
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
            <DynamicBrandFilter 
              selectedBrands={selectedFilters.brands}
              onBrandChange={handleBrandChange}
            />
            <ConditionFilter 
              
            />
            {selectedCategory === 'smart-watches' && (
              <DynamicTypeFilterBox category="Smart Watches" />
            )}
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Smart Watch Products</h1>
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

            <SmartWatchProductCard 
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
                onClick={() => toggleSection('brands')}
              >
                <h4 className="font-medium text-gray-800">Brands</h4>
                {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.brands && (
                <DynamicBrandFilter 
                  selectedBrands={selectedFilters.brands}
                  onBrandChange={handleBrandChange}
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
              {expandedSections.condition && (
                <ConditionFilter 
                  
                />
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('type')}
              >
                <h4 className="font-medium text-gray-800">Connectivity</h4>
                {expandedSections.type ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.type && (
                <DynamicTypeFilterBox category="Smart Watches" />
              )}
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

export default SmartWatchPage;