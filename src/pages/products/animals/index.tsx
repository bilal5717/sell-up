"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
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
  LuPawPrint
} from 'react-icons/lu';
import axios from 'axios';

// Interfaces
interface Animal {
  id: number;
  post_id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  posted_at: string;
  breed?: string;
  age?: string;
  images?: { url: string; is_featured: number; order: number }[];
  category?: string;
  sub_category?: string;
  type?: string;
}

interface FilterState {
  type: string[];
  location: string[];
  price_range: string[];
}

interface Category {
  name: string;
  slug: string;
}

interface SubCategory {
  name: string;
  slug: string;
  types?: { name: string; slug: string }[];
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
  { name: 'Animals', slug: 'animals' },
];

const subCategories: CategoryData = {
  'animals': [
    { 
      name: 'Pets', 
      slug: 'pets',
      types: [
        { name: 'Dogs', slug: 'dogs' },
        { name: 'Cats', slug: 'cats' },
        { name: 'Rabbits', slug: 'rabbits' },
        { name: 'Hamsters', slug: 'hamsters' }
      ]
    },
    { 
      name: 'Livestock', 
      slug: 'livestock',
      types: [
        { name: 'Cows', slug: 'cows' },
        { name: 'Goats', slug: 'goats' },
        { name: 'Sheep', slug: 'sheep' },
        { name: 'Horses', slug: 'horses' }
      ]
    },
    { 
      name: 'Aquarium', 
      slug: 'aquarium',
      types: [
        { name: 'Tropical Fish', slug: 'tropical-fish' },
        { name: 'Goldfish', slug: 'goldfish' },
        { name: 'Shrimp', slug: 'shrimp' },
        { name: 'Snails', slug: 'snails' }
      ]
    },
    { 
      name: 'Birds', 
      slug: 'birds',
      types: [
        { name: 'Parrots', slug: 'parrots' },
        { name: 'Canaries', slug: 'canaries' },
        { name: 'Pigeons', slug: 'pigeons' }
      ]
    },
    { 
      name: 'Animal Supplies', 
      slug: 'animal-supplies',
      types: [
        { name: 'Food & Accessories', slug: 'food-accessories' },
        { name: 'Medicine', slug: 'medicine' },
        { name: 'Others', slug: 'others' }
      ]
    },
    { name: 'Others', slug: 'others' }
  ],
};

const priceRanges = [
  'Under Rs. 1,000',
  'Rs. 1,000 - Rs. 5,000',
  'Rs. 5,000 - Rs. 10,000',
  'Rs. 10,000 - Rs. 50,000',
  'Over Rs. 50,000'
];

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
  const [visibleSubCategoryPage, setVisibleSubCategoryPage] = useState<number>(1);
  const [visibleTypePages, setVisibleTypePages] = useState<Record<string, number>>({});
  const subCategoriesPerPage = 7;
  const typesPerPage = 7;

  const toggleCategory = (slug: string) => {
    onCategorySelect(slug);
    onSubCategorySelect(null);
    onTypeSelect(null);
    setVisibleSubCategoryPage(1);
    setVisibleTypePages({});
    router.push(`/${slug}`);
  };

  const toggleSubCategory = (name: string, slug: string) => {
    if (selectedSubCategory === name) {
      onSubCategorySelect(null);
      onTypeSelect(null);
      setVisibleTypePages({});
      router.push(`/${selectedCategory}`);
    } else {
      onSubCategorySelect(name);
      onTypeSelect(null);
      setVisibleTypePages({ ...visibleTypePages, [name]: 1 });
      router.push(`/${selectedCategory}/${slug}`);
    }
  };

  const toggleType = (type: string, slug: string) => {
    if (selectedType === type) {
      onTypeSelect(null);
      router.push(`/${selectedCategory}/${subCategories[selectedCategory].find(sub => sub.name === selectedSubCategory)?.slug}`);
    } else {
      onTypeSelect(type);
      router.push(`/${selectedCategory}/${slug}`);
    }
  };

  const handleShowMoreSubCategories = () => {
    setVisibleSubCategoryPage((prev) => prev + 1);
  };

  const handleShowLessSubCategories = () => {
    setVisibleSubCategoryPage((prev) => Math.max(prev - 1, 1));
  };

  const handleShowMoreTypes = (subCategory: string) => {
    setVisibleTypePages((prev) => ({
      ...prev,
      [subCategory]: (prev[subCategory] || 1) + 1,
    }));
  };

  const handleShowLessTypes = (subCategory: string) => {
    setVisibleTypePages((prev) => ({
      ...prev,
      [subCategory]: Math.max((prev[subCategory] || 1) - 1, 1),
    }));
  };

  const getVisibleSubCategories = () => {
    const subCategoryList = subCategories[selectedCategory] || [];
    const startIndex = 0;
    const endIndex = visibleSubCategoryPage * subCategoriesPerPage;
    return subCategoryList.slice(0, endIndex);
  };

  const getVisibleTypes = (subCategory: string) => {
    const subCategoryData = subCategories[selectedCategory]?.find((sub) => sub.name === subCategory);
    const typeList = subCategoryData?.types || [];
    const page = visibleTypePages[subCategory] || 1;
    const startIndex = 0;
    const endIndex = page * typesPerPage;
    return typeList.slice(0, endIndex);
  };

  const hasMoreSubCategories = () => {
    const subCategoryList = subCategories[selectedCategory] || [];
    return visibleSubCategoryPage * subCategoriesPerPage < subCategoryList.length;
  };

  const hasMoreTypes = (subCategory: string) => {
    const subCategoryData = subCategories[selectedCategory]?.find((sub) => sub.name === subCategory);
    const typeList = subCategoryData?.types || [];
    const page = visibleTypePages[subCategory] || 1;
    return page * typesPerPage < typeList.length;
  };

  const hasPreviousSubCategories = () => visibleSubCategoryPage > 1;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">All Categories</h3>
      <div className="space-y-1">
        {categories.map((category) => (
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
                {getVisibleSubCategories().map((sub, index) => (
                  <div key={index}>
                    <div
                      className={`py-1 cursor-pointer hover:text-blue-600 ${selectedSubCategory === sub.name ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => toggleSubCategory(sub.name, sub.slug)}
                      style={{ fontSize: '12px', lineHeight: '1.5' }}
                    >
                      {sub.name}
                    </div>
                    {sub.types && selectedSubCategory === sub.name && (
                      <div className="ml-4 space-y-1">
                        {getVisibleTypes(sub.name).map((type, i) => (
                          <div
                            key={i}
                            className={`py-1 cursor-pointer hover:text-blue-600 ${selectedType === type.name ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                            style={{ fontSize: '12px', lineHeight: '1.5' }}
                            onClick={() => toggleType(type.name, type.slug)}
                          >
                            - {type.name}
                          </div>
                        ))}
                        {sub.types.length > typesPerPage && (
                          <div className="flex gap-2">
                            {hasMoreTypes(sub.name) && (
                              <button
                                onClick={() => handleShowMoreTypes(sub.name)}
                                className="text-blue-600 text-sm mt-1"
                              >
                                Show More
                              </button>
                            )}
                            {(visibleTypePages[sub.name] || 1) > 1 && (
                              <button
                                onClick={() => handleShowLessTypes(sub.name)}
                                className="text-blue-600 text-sm mt-1"
                              >
                                Show Less
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {subCategories[category.slug].length > subCategoriesPerPage && (
                  <div className="flex gap-2">
                    {hasMoreSubCategories() && (
                      <button
                        onClick={handleShowMoreSubCategories}
                        className="text-blue-600 text-sm mt-2"
                      >
                        Show More
                      </button>
                    )}
                    {hasPreviousSubCategories() && (
                      <button
                        onClick={handleShowLessSubCategories}
                        className="text-blue-600 text-sm mt-2"
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AnimalTypeFilter: React.FC = () => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Animal Type</h3>
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
        <div className="space-y-2">
          {subCategories['animals'].flatMap(sub => sub.types || []).map((type) => (
            <label key={type.name} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.name)}
                onChange={() => handleTypeChange(type.name)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-sm">
                {type.name}
              </span>
            </label>
          ))}
        </div>
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

const PriceRangeFilter: React.FC = () => {
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

const AnimalCard: React.FC<{
  animals: Animal[];
  loading?: boolean;
}> = ({
  animals = [],
  loading = false
}) => {
  const [savedAnimals, setSavedAnimals] = useState<Set<number>>(new Set());

  const toggleSave = useCallback((animalId: number) => {
    setSavedAnimals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(animalId)) {
        newSet.delete(animalId);
      } else {
        newSet.add(animalId);
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

  if (!Array.isArray(animals) || animals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No animals found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {animals.map((animal) => {
        const isSaved = savedAnimals.has(animal.id);
        
        return (
          <article
            key={`${animal.id}-${animal.post_id}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={animal.images?.[0]?.url || '/images/animal-placeholder.png'}
                alt={animal.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {animal.images?.[0]?.is_featured && (
                <span className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  Featured
                </span>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-gray-800 font-bold">
                  Rs. {Number(animal.price).toLocaleString()}
                </h3>
                <button 
                  onClick={() => toggleSave(animal.id)}
                  aria-label={isSaved ? "Remove from saved animals" : "Save this animal"}
                  className="p-1"
                >
                  <LuHeart
                    className={`text-xl ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              <h4 className="text-gray-700 font-medium text-sm line-clamp-2">
                {animal.title || 'No Title'}
              </h4>

              <div className="flex items-center gap-2 text-gray-700 text-sm mt-1">
                <LuPawPrint />
                <span>{animal.type || 'Animal'}</span>
              </div>

              {animal.breed && (
                <p className="text-gray-600 text-sm">
                  Breed: {animal.breed}
                </p>
              )}

              {animal.age && (
                <p className="text-gray-600 text-sm">
                  Age: {animal.age}
                </p>
              )}

              <div className="flex flex-col items-start text-gray-500 text-xs mt-2">
                <div className="flex items-center gap-1">
                  <LuMapPin />
                  <span>{animal.location}</span>
                </div>
                <time dateTime={animal.posted_at} className="text-xs">
                  {animal.posted_at}
                </time>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

const AnimalsPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string>('animals');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    type: [],
    location: [],
    price_range: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    type: true,
    location: true,
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Initialize state based on URL
  useEffect(() => {
    const segments = pathname.split('/').filter(segment => segment);
    const categorySlug = segments[0];
    const subCategoryOrTypeSlug = segments[1];

    if (categorySlug) {
      const category = categories.find(cat => cat.slug === categorySlug);
      if (category) {
        setSelectedCategory(category.slug);
        if (subCategoryOrTypeSlug) {
          const subCategory = subCategories[category.slug]?.find(sub => sub.slug === subCategoryOrTypeSlug);
          if (subCategory) {
            setSelectedSubCategory(subCategory.name);
            setSelectedType(null);
          } else {
            const subCategoryWithType = subCategories[category.slug]?.find(sub => 
              sub.types?.some(type => type.slug === subCategoryOrTypeSlug)
            );
            if (subCategoryWithType) {
              const type = subCategoryWithType.types?.find(t => t.slug === subCategoryOrTypeSlug);
              setSelectedSubCategory(subCategoryWithType.name);
              setSelectedType(type?.name || null);
            }
          }
        } else {
          setSelectedSubCategory(null);
          setSelectedType(null);
        }
      }
    }
  }, [pathname]);

  // Fetch animals based on selected slugs
  useEffect(() => {
    let isMounted = true;
    const fetchAnimals = async (page: number = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedSubCategory) {
          const subCatSlug = subCategories[selectedCategory]?.find(sub => sub.name === selectedSubCategory)?.slug;
          if (selectedType) {
            const typeSlug = subCategories[selectedCategory]
              ?.find(sub => sub.name === selectedSubCategory)
              ?.types?.find(type => type.name === selectedType)?.slug;
            console.log('Type Slug:', typeSlug);
            if (typeSlug) params.append('slug', typeSlug);
          } else if (subCatSlug) {
            console.log('SubCategory Slug:', subCatSlug);
            params.append('slug', subCatSlug);
          }
        }
        params.append('page', page.toString());
        const response = await axios.get(`http://127.0.0.1:8000/api/animals?${params.toString()}`);
        console.log('API Response:', response.data);
        if (isMounted) {
          if (!Array.isArray(response.data.data)) {
            console.error('response.data.data is not an array:', response.data.data);
            setAnimals([]);
          } else {
            setAnimals(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
          }
        }
      } catch (error) {
        console.error('Error fetching animals:', error);
        if (isMounted) setAnimals([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAnimals(currentPage);
    return () => { isMounted = false; };
  }, [selectedCategory, selectedSubCategory, selectedType, currentPage]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const handleFilterSelect = (filterType: keyof FilterState, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      type: [],
      location: [],
      price_range: [],
    });
    setSelectedSubCategory(null);
    setSelectedType(null);
    router.push(`/${selectedCategory}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Animals</span>
            {selectedSubCategory && (
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
            <PriceRangeFilter />
            <AnimalTypeFilter />
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Animals</h1>
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
                  `Showing ${selectedSubCategory} animals${selectedType ? ` (${selectedType})` : ''}` : 
                  'Showing all Animals'}
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

            <AnimalCard 
              animals={animals}
              loading={loading}
            />
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(lastPage)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded border text-sm ${
                      currentPage === i + 1 ? 'bg-blue-100 text-blue-600' : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage}
                  className="px-3 py-1 rounded border text-sm disabled:opacity-50"
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
                  onClick={() => toggleSection('type')}
                >
                  <h4 className="font-medium text-gray-800">Animal Type</h4>
                  {expandedSections.type ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedSections.type && (
                  <div className="mt-3 space-y-2">
                    {subCategories['animals'].flatMap(sub => sub.types || []).map((type) => (
                      <label key={type.name} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.type.includes(type.name)}
                          onChange={() => handleFilterSelect('type', type.name)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-700 text-sm">
                          {type.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('price_range')}
                >
                  <h4 className="font-medium text-gray-800">Price Range</h4>
                  {expandedSections.price_range ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedSections.price_range && (
                  <div className="mt-3 space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.price_range.includes(range)}
                          onChange={() => handleFilterSelect('price_range', range)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-700 text-sm">
                          {range}
                        </span>
                      </label>
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

export default AnimalsPage;