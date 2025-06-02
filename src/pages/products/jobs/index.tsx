"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
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
  LuBriefcase,
  LuDollarSign
} from 'react-icons/lu';
import axios from 'axios';

// Interfaces
interface Job {
  id: number;
  post_id: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  posted_at: string;
  employment_type?: string;
  company?: string;
  images?: { url: string; is_featured: number; order: number }[];
  category?: string;
  sub_category?: string;
}

interface FilterState {
  employment_type: string[];
  location: string[];
  salary_range: string[];
}

interface Category {
  name: string;
  slug: string;
}

interface SubCategory {
  name: string;
  slug?: string;
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
  { name: 'Jobs', slug: 'jobs' },
];

const subCategories: CategoryData = {
  'jobs': [
    { name: 'Architecture & Interior Design', slug: 'architecture-job' },
    { name: 'Clerical & Administration', slug: 'clerical-administration' },
    { name: 'Content Writing', slug: 'content-writing' },
    { name: 'Customer Service', slug: 'customer-service' },
    { name: 'Delivery Riders', slug: 'delivery-riders' },
    { name: 'Domestic Staff', slug: 'domestic-staff' },
    { name: 'Education', slug: 'education' },
    { name: 'Engineering', slug: 'engineering' },
    { name: 'Graphic Design', slug: 'graphic-design' },
    { name: 'Hotels & Tourism', slug: 'hotels-tourism' },
    { name: 'Human Resources', slug: 'human-resources' },
    { name: 'Internships', slug: 'internships' },
    { name: 'IT & Networking', slug: 'it-networking' },
    { name: 'Manufacturing', slug: 'manufacturing' },
    { name: 'Marketing', slug: 'marketing' },
    { name: 'Medical', slug: 'medical' },
    { name: 'Online', slug: 'online' },
    { name: 'Part Time', slug: 'part-time' },
    { name: 'Real Estate', slug: 'real-estate' },
    { name: 'Restaurants & Hospitals', slug: 'restaurants-hospitals' },
    { name: 'Sales', slug: 'sales' },
    { name: 'Security', slug: 'security' }
  ],
};

// Job types for specific subcategories
export const JOBS_TYPES: { [key: string]: string[] } = {
  'Domestic Help': ['Maids', 'Babysitters', 'Cooks', 'Nursing Staff', 'Other Domestic Help'],
  'Driver & Taxi': ['Drivers', 'Pick & drop', 'CarPool'],
  'Health & Beauty': ['Beauty &SPA', 'Fitness Trainer', 'Health Services'],
  'Home & Office Repair': ['Plumber', 'Electrician', 'Carpenters', 'Painters', 'AC services', 'Pest Control', 'Water Tank Cleaning', 'Deep Cleaning', 'Geyser Services', 'Other Repair Services']
};

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Remote', 'Freelance', 'Volunteer'];

const provinces: Province[] = [
  { name: 'Punjab', cities: ['Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur'] },
  { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Thatta'] },
  { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Kohat', 'Bannu'] },
  { name: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi'] },
  { name: 'Islamabad Capital Territory', cities: ['Islamabad'] },
];

const salaryRanges = [
  'Under Rs. 10,000',
  'Rs. 10,000 - Rs. 30,000',
  'Rs. 30,000 - Rs. 50,000',
  'Rs. 50,000 - Rs. 100,000',
  'Over Rs. 100,000'
];

// Components
const DynamicCategorySidebar: React.FC<{
  selectedCategory: string;
  selectedSubCategory: string | null;
  selectedJobType: string | null;
  onCategorySelect: (category: string) => void;
  onSubCategorySelect: (subCategory: string | null, slug: string | null) => void;
  onJobTypeSelect: (jobType: string | null) => void;
}> = ({
  selectedCategory,
  selectedSubCategory,
  selectedJobType,
  onCategorySelect,
  onSubCategorySelect,
  onJobTypeSelect,
}) => {
  const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);
  const [showMoreSubCategories, setShowMoreSubCategories] = useState<boolean>(false);
  const [showMoreJobTypes, setShowMoreJobTypes] = useState<boolean>(false);
  const router = useRouter();

  const toggleCategory = (slug: string) => {
    onCategorySelect(slug);
    onSubCategorySelect(null, null);
    onJobTypeSelect(null);
    setShowMoreSubCategories(false);
    setShowMoreJobTypes(false);
    router.push('/jobs');
  };

  const toggleSubCategory = (name: string, slug: string | undefined) => {
    if (selectedSubCategory === name) {
      onSubCategorySelect(null, null);
      onJobTypeSelect(null);
      setShowMoreJobTypes(false);
      router.push('/jobs');
    } else {
      onSubCategorySelect(name, slug || null);
      onJobTypeSelect(null);
      setShowMoreJobTypes(false);
      router.push(`/jobs/${slug}`);
    }
  };

  const toggleJobType = (type: string) => {
    if (selectedJobType === type) {
      onJobTypeSelect(null);
    } else {
      onJobTypeSelect(type);
    }
  };

  const toggleShowMoreCategories = () => {
    setShowMoreCategories((prev) => !prev);
  };

  const toggleShowMoreSubCategories = () => {
    setShowMoreSubCategories((prev) => !prev);
  };

  const toggleShowMoreJobTypes = () => {
    setShowMoreJobTypes((prev) => !prev);
  };

  // Map 'Domestic Staff' to 'Domestic Help' for JOBS_TYPES
  const jobTypeKey = selectedSubCategory === 'Domestic Staff' ? 'Domestic Help' : selectedSubCategory || '';
  const jobTypes = JOBS_TYPES[jobTypeKey] || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">All Categories</h3>
      <div className="space-y-1">
        {(showMoreCategories ? categories : categories.slice(0, 7)).map((category) => (
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
                {(showMoreSubCategories ? subCategories[category.slug] : subCategories[category.slug].slice(0, 7)).map((sub, index) => (
                  <div key={index} className="cursor-pointer">
                    <div
                      className={`py-1 hover:text-blue-600 ${selectedSubCategory === sub.name ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => toggleSubCategory(sub.name, sub.slug)}
                      style={{ fontSize: '12px', lineHeight: '1.5' }}
                    >
                      {sub.name}
                    </div>

                    {selectedSubCategory === sub.name && jobTypes.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {(showMoreJobTypes ? jobTypes : jobTypes.slice(0, 7)).map((type, idx) => (
                          <div
                            key={idx}
                            className={`py-1 cursor-pointer hover:text-blue-600 ${selectedJobType === type ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                            onClick={() => toggleJobType(type)}
                            style={{ fontSize: '11px', lineHeight: '1.5' }}
                          >
                            {type}
                          </div>
                        ))}
                        {jobTypes.length > 7 && (
                          <button
                            onClick={toggleShowMoreJobTypes}
                            className="text-blue-600 text-sm mt-1"
                          >
                            {showMoreJobTypes ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {subCategories[category.slug].length > 7 && (
                  <button
                    onClick={toggleShowMoreSubCategories}
                    className="text-blue-600 text-sm mt-1"
                  >
                    {showMoreSubCategories ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {categories.length > 7 && (
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

const EmploymentTypeFilter: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showMoreTypes, setShowMoreTypes] = useState<boolean>(false);

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes((prev) => prev.filter((t) => t !== type));
    } else {
      setSelectedTypes((prev) => [...prev, type]);
    }
  };

  const clearSelection = () => {
    setSelectedTypes([]);
    setShowMoreTypes(false);
  };

  const toggleShowMoreTypes = () => {
    setShowMoreTypes((prev) => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Employment Type</h3>
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
          {(showMoreTypes ? employmentTypes : employmentTypes.slice(0, 7)).map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-gray-700 text-sm">
                {type}
              </span>
            </label>
          ))}
          {employmentTypes.length > 7 && (
            <button
              onClick={toggleShowMoreTypes}
              className="text-blue-600 text-sm mt-1"
            >
              {showMoreTypes ? 'Show Less' : 'Show More'}
            </button>
          )}
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

const SalaryRangeFilter: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
  };

  const clearSelection = () => {
    setSelectedRange(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Salary Range</h3>
      {selectedRange ? (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
          <span className="text-sm">{selectedRange}</span>
          <button
            onClick={clearSelection}
            className="text-blue-600 text-xs"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {salaryRanges.map((range) => (
            <div
              key={range}
              className={`px-3 py-2 rounded cursor-pointer ${
                selectedRange === range ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleRangeChange(range)}
            >
              <span className="text-sm">{range}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const JobCard: React.FC<{
  jobs: Job[];
  loading?: boolean;
}> = ({
  jobs = [],
  loading = false
}) => {
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());

  const toggleSave = useCallback((jobId: number) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
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

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => {
        const isSaved = savedJobs.has(job.id);
        
        return (
          <article
            key={`${job.id}-${job.post_id}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={job.images?.[0]?.url || '/images/job-placeholder.png'}
                alt={job.title}
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
                  {job.title}
                </h3>
                <button 
                  onClick={() => toggleSave(job.id)}
                  aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
                  className="p-1"
                >
                  <LuHeart
                    className={`text-xl ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                  />
                </button>
              </div>

              {job.company && (
                <p className="text-gray-600 text-sm mb-1">
                  {job.company}
                </p>
              )}

              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <LuDollarSign />
                <span>{job.salary || 'Salary not specified'}</span>
              </div>

              {job.employment_type && (
                <div className="flex items-center gap-2 text-gray-700 text-sm mt-1">
                  <LuBriefcase />
                  <span>{job.employment_type}</span>
                </div>
              )}

              <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                {job.description}
              </p>

              <div className="flex flex-col items-start text-gray-500 text-xs mt-2">
                <div className="flex items-center gap-1">
                  <LuMapPin />
                  <span>{job.location}</span>
                </div>
                <time dateTime={job.posted_at} className="text-xs">
                  {job.posted_at}
                </time>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

const JobsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('jobs');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState<string | null>(null);
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    employment_type: [],
    location: [],
    salary_range: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    salary: true,
    employment_type: true,
    location: true,
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize selected category and subcategory from URL
  useEffect(() => {
    const subcategorySlug = params?.subcategory as string | undefined;
    
    if (subcategorySlug === 'types') {
      // Redirect /jobs/types to /jobs
      router.replace('/jobs');
      return;
    }

    if (subcategorySlug) {
      const subCategoryObj = subCategories['jobs'].find(sub => sub.slug === subcategorySlug);
      if (subCategoryObj) {
        setSelectedSubCategory(subCategoryObj.name);
        setSelectedSubCategorySlug(subcategorySlug);
      } else {
        // If subcategory slug is invalid, redirect to /jobs
        router.replace('/jobs');
      }
    } else {
      setSelectedSubCategory(null);
      setSelectedSubCategorySlug(null);
    }
  }, [params, router]);

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
    setSelectedFilters({
      employment_type: [],
      location: [],
      salary_range: [],
    });
    setSelectedSubCategory(null);
    setSelectedSubCategorySlug(null);
    setSelectedJobType(null);
    router.push('/jobs');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Pass subcategory slug to the API if available
        const url = selectedSubCategorySlug 
          ? `http://127.0.0.1:8000/api/jobsProducts?subcategory=${selectedSubCategorySlug}`
          : 'http://127.0.0.1:8000/api/jobsProducts';
        const response = await axios.get(url);
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [selectedSubCategorySlug]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Jobs</span>
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
              selectedJobType={selectedJobType}
              onCategorySelect={setSelectedCategory}
              onSubCategorySelect={(name, slug) => {
                setSelectedSubCategory(name);
                setSelectedSubCategorySlug(slug);
              }}
              onJobTypeSelect={setSelectedJobType}
            />
            <LocationSidebar />
            <SalaryRangeFilter />
            <EmploymentTypeFilter />
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Jobs</h1>
              <button 
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiFilter /> Filters
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {selectedJobType || selectedSubCategory || selectedCategory} jobs
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
                    <option value="salary-low">Salary: Low to High</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>
            </div>

            <JobCard 
              jobs={jobs}
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
                  onClick={() => toggleSection('employment_type')}
                >
                  <h4 className="font-medium text-gray-800">Employment Type</h4>
                  {expandedSections.employment_type ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedSections.employment_type && (
                  <div className="mt-3 space-y-2">
                    {employmentTypes.map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.employment_type.includes(type)}
                          onChange={() => handleFilterSelect('employment_type', type)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-700 text-sm">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleSection('salary_range')}
                >
                  <h4 className="font-medium text-gray-800">Salary Range</h4>
                  {expandedSections.salary_range ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {expandedSections.salary_range && (
                  <div className="mt-3 space-y-2">
                    {salaryRanges.map((range) => (
                      <label key={range} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedFilters.salary_range.includes(range)}
                          onChange={() => handleFilterSelect('salary_range', range)}
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

export default JobsPage;