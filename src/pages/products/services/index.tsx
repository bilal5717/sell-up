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
  LuMapPin,
  LuWifi,
  LuWifiOff
} from 'react-icons/lu';
import axios from 'axios';

// Interfaces
interface Service {
  id: number;
  post_id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  category?: string;
  sub_category?: string;
  type?: string;
  condition?: string;
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
  { name: 'Services', slug: 'services' },
];

const subCategories: CategoryData = {
  'services': [
    { 
      name: 'Domestic Help', 
      slug: 'domestic-help',
      types: [
        'Maids', 'Babysitters', 'Cooks', 
        'Nursing Staff', 'Other Domestic Help'
      ] 
    },
    { 
      name: 'Driver & Taxi', 
      slug: 'driver-taxi',
      types: [
        'Drivers', 'Pick & drop', 'CarPool'
      ] 
    },
    { 
      name: 'Health & Beauty', 
      slug: 'health-beauty',
      types: [
        'Beauty & SPA', 'Fitness Trainer', 'Health Services'
      ] 
    },
    { 
      name: 'Home & Office Repair', 
      slug: 'home-office-repair',
      types: [
        'Plumber', 'Electrician', 'Carpenters', 'Painters', 
        'AC services', 'Pest Control', 'Water Tank Cleaning',
        'Deep Cleaning', 'Geyser Services', 'Other Repair Services'
      ] 
    },
    { name: 'Architecture & Interior Design', slug: 'architecture-service' },
    { name: 'Camera Installation', slug: 'camera-installation' },
    { name: 'Car Rental', slug: 'car-rental' },
    { name: 'Car Services', slug: 'car-services' },
    { name: 'Catering & Restaurant', slug: 'catering-restaurant' },
    { name: 'Construction Services', slug: 'construction-services' },
    { name: 'Consultancy Services', slug: 'consultancy-services' },
    { name: 'Tuition & Academics', slug: 'tuition-academics' },
    { name: 'Electronic & Computer Repair', slug: 'electronic-computer-repair' },
    { name: 'Event Services', slug: 'event-services' },
    { name: 'Farm & Fresh Food', slug: 'farm-fresh-food' },
    { name: 'Insurance Services', slug: 'insurance-services' },
    { name: 'Movers & Packers', slug: 'movers-packers' },
    { name: 'Renting Services', slug: 'renting-services' },
    { name: 'Tailor Services', slug: 'tailor-services' },
    { name: 'Travel & Visa', slug: 'travel-visa' },
    { name: 'Video & Photography', slug: 'video-photography' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Other Services', slug: 'other-services' }
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
  const pathname = usePathname();
  const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({});
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

  // Initialize expanded states
  useEffect(() => {
    const initialSubCategories: Record<string, boolean> = {};
    const initialTypes: Record<string, boolean> = {};
    
    subCategories['services'].forEach(sub => {
      initialSubCategories[sub.name] = false;
      if (sub.types) {
        sub.types.forEach(type => {
          initialTypes[type] = false;
        });
      }
    });
    
    setExpandedSubCategories(initialSubCategories);
    setExpandedTypes(initialTypes);
  }, []);

  const toggleCategory = (slug: string) => {
    router.push(`/products/${slug}`);
    onCategorySelect(slug);
    onSubCategorySelect(null);
    onTypeSelect(null);
  };

  const toggleSubCategory = (name: string) => {
    const subCategorySlug = subCategories['services'].find(sub => sub.name === name)?.slug || '';
    
    if (selectedSubCategory === name) {
      router.push(`/products/${selectedCategory}`);
      onSubCategorySelect(null);
      onTypeSelect(null);
    } else {
      router.push(`/products/${selectedCategory}/${subCategorySlug}`);
      onSubCategorySelect(name);
      onTypeSelect(null);
    }
  };

  const toggleType = (type: string) => {
    const typeSlug = type.toLowerCase().replace(/\s+/g, '-');
    
    if (selectedType === type) {
      if (selectedSubCategory) {
        const subCategorySlug = subCategories['services'].find(sub => sub.name === selectedSubCategory)?.slug || '';
        router.push(`/products/${selectedCategory}/${subCategorySlug}`);
      } else {
        router.push(`/products/${selectedCategory}`);
      }
      onTypeSelect(null);
    } else {
      router.push(`/products/${selectedCategory}/${typeSlug}`);
      onTypeSelect(type);
    }
  };

  const toggleShowMoreCategories = () => {
    setShowMoreCategories((prev) => !prev);
  };

  const toggleSubCategoryExpansion = (subCategoryName: string) => {
    setExpandedSubCategories(prev => ({
      ...prev,
      [subCategoryName]: !prev[subCategoryName]
    }));
  };

  const toggleTypesExpansion = (subCategoryName: string) => {
    const subCategory = subCategories['services'].find(sub => sub.name === subCategoryName);
    if (!subCategory?.types) return;
    
    const newExpandedTypes = { ...expandedTypes };
    subCategory.types.forEach(type => {
      newExpandedTypes[type] = !expandedTypes[type];
    });
    setExpandedTypes(newExpandedTypes);
  };

  // Determine if we should show "Show More" for subcategories
  const shouldShowMoreSubCategories = (subCategoryName: string) => {
    const subCategory = subCategories['services'].find(sub => sub.name === subCategoryName);
    return subCategory?.types && subCategory.types.length > 3;
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
                    <div className="flex items-center justify-between">
                      <div
                        className={`py-1 cursor-pointer hover:text-blue-600 ${selectedSubCategory === sub.name ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                        onClick={() => toggleSubCategory(sub.name)}
                        style={{ fontSize: '12px', lineHeight: '1.5' }}
                      >
                        {sub.name}
                      </div>
                      {sub.types && sub.types.length > 0 && (
                        <button
                          onClick={() => toggleSubCategoryExpansion(sub.name)}
                          className="text-blue-500 text-xs ml-2"
                        >
                          {expandedSubCategories[sub.name] ? '▲' : '▼'}
                        </button>
                      )}
                    </div>
                    
                    {sub.types && selectedSubCategory === sub.name && (
                      <div className="ml-4 space-y-1">
                        {(expandedSubCategories[sub.name] ? sub.types : sub.types.slice(0, 3)).map((type, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div
                              className={`py-1 cursor-pointer hover:text-blue-600 ${selectedType === type ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                              style={{ fontSize: '12px', lineHeight: '1.5' }}
                              onClick={() => toggleType(type)}
                            >
                              - {type}
                            </div>
                          </div>
                        ))}
                        {shouldShowMoreSubCategories(sub.name) && (
                          <button
                            onClick={() => toggleSubCategoryExpansion(sub.name)}
                            className="text-blue-500 text-xs mt-1"
                          >
                            {expandedSubCategories[sub.name] ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </div>
                    )}
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

// ... (ConditionSelectBox, LocationSidebar, PriceFilter components remain exactly the same)
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
const ServiceCard: React.FC<{
  services: Service[];
  loading?: boolean;
}> = ({
  services = [],
  loading = false
}) => {
  const [likedServices, setLikedServices] = useState<Set<number>>(new Set());

  const toggleLike = useCallback((serviceId: number) => {
    setLikedServices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
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

  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No services found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => {
        const isLiked = likedServices.has(service.id);
        
        return (
          <article
            key={`${service.id}-${service.post_id}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={service.images?.[0]?.url || '/images/placeholder.png'}
                alt={service.title}
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
                  Rs. {Number(service.price).toLocaleString()}
                </h3>
                <button 
                  onClick={() => toggleLike(service.id)}
                  aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                  className="p-1"
                >
                  <LuHeart
                    className={`text-xl ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              <h4 className="text-gray-700 font-medium text-sm line-clamp-2">
                {service.title}
              </h4>

              <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                {service.description}
              </p>

              <div className="flex justify-between items-center text-gray-600 text-xs mt-2">
                {service.type && (
                  <div className="flex items-center gap-1">
                    <LuTag />
                    <span>{service.type}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start text-gray-500 text-xs mt-2">
                <div className="flex items-center gap-1">
                  <LuMapPin />
                  <span>{service.location}</span>
                </div>
                <time dateTime={service.posted_at} className="text-xs">
                  {service.posted_at}
                </time>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

const ServicesPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Parse URL segments
  const segments = pathname.split('/').filter(Boolean);
  const categorySegment = segments[1] || 'services';
  const filterSegment = segments[2] || '';

  // Initialize state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('services');
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
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL
  useEffect(() => {
    // Set category
    setSelectedCategory(categorySegment);

    // Check if filter segment is a subcategory or type
    const allSubCategorySlugs = subCategories['services'].map(sub => sub.slug);
    const allTypes = subCategories['services'].flatMap(sub => 
      sub.types?.map(type => type.toLowerCase().replace(/\s+/g, '-')) || []
    );

    if (allSubCategorySlugs.includes(filterSegment)) {
      // It's a subcategory
      const subCategoryName = subCategories['services'].find(sub => sub.slug === filterSegment)?.name || null;
      setSelectedSubCategory(subCategoryName);
      setSelectedType(null);
    } else if (allTypes.includes(filterSegment)) {
      // It's a type
      const typeName = subCategories['services'].flatMap(sub => 
        sub.types?.find(type => type.toLowerCase().replace(/\s+/g, '-') === filterSegment) || []
      )[0] || null;
      setSelectedType(typeName);
      setSelectedSubCategory(null);
    } else {
      // No valid filter or main category
      setSelectedSubCategory(null);
      setSelectedType(null);
    }
  }, [pathname]);

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
    router.push('/services');
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        
        // Build query params based on URL segments
        const params = new URLSearchParams();
        
        if (selectedSubCategory) {
          params.set('subcategory', selectedSubCategory);
        } else if (selectedType) {
          params.set('type', selectedType);
        }
        
        const response = await axios.get(`http://127.0.0.1:8000/api/services?${params.toString()}`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [selectedCategory, selectedSubCategory, selectedType]);

  // Update document title based on filters
  useEffect(() => {
    let title = 'Services';
    if (selectedType) {
      title = `${selectedType} Services`;
    } else if (selectedSubCategory) {
      title = `${selectedSubCategory} Services`;
    }
    document.title = title;
  }, [selectedCategory, selectedSubCategory, selectedType]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Services</span>
            {selectedSubCategory && !selectedType && (
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
              onSubCategorySelect={setSelectedSubCategory}
              onTypeSelect={setSelectedType}
            />
            <LocationSidebar />
            <PriceFilter />
            <ConditionSelectBox />
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">
                {selectedType || selectedSubCategory || 'Services'}
              </h1>
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiFilter /> Filters
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {services.length} {selectedType || selectedSubCategory || selectedCategory} services
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

            <ServiceCard 
              services={services}
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
              <DynamicCategorySidebar
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                selectedType={selectedType}
                onCategorySelect={setSelectedCategory}
                onSubCategorySelect={setSelectedSubCategory}
                onTypeSelect={setSelectedType}
              />
              <LocationSidebar />
              <PriceFilter />
              <ConditionSelectBox />
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

export default ServicesPage;