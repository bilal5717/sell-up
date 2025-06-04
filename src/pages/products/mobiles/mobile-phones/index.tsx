"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { FiChevronDown, FiChevronUp, FiFilter, FiX } from "react-icons/fi";
import { LuHeart, LuTag, LuMapPin, LuWifi, LuWifiOff } from "react-icons/lu";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";

// Interfaces
interface MobileProduct {
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

// Mobile-specific Data
const mobileCategories: Category[] = [
  { name: "Mobile Phones", slug: "mobile-phones" },
  { name: "Tablets", slug: "tablets" },
  { name: "Accessories", slug: "accessories" },
  { name: "Smart Watches", slug: "smart-watches" },
];

const mobileSubCategories: CategoryData = {
  accessories: [
    {
      name: "Accessory",
      types: [
        "Charging Cables",
        "Converters",
        "Chargers",
        "Screens",
        "Screen Protector",
        "Mobile Stands",
        "Ring Lights",
        "Selfie Sticks",
        "Power Banks",
        "Headphones",
        "EarPhones",
        "Covers & Cases",
        "External Memory",
        "Other",
      ],
    },
    { name: "Chargers", types: ["Wireless Chargers", "Fast Chargers"] },
    { name: "Cables", types: ["USB-C", "Lightning", "Micro USB"] },
    { name: "Cases & Covers" },
  ],
  "smart-watches": [
    { name: "Apple Watch" },
    { name: "Samsung Watch" },
    { name: "Fitness Trackers" },
  ],
};

const MOBILE_BRANDS = [
  "Apple",
  "Samsung",
  "Huawei",
  "Xiaomi",
  "Oppo",
  "Vivo",
  "Realme",
  "OnePlus",
  "Nokia",
  "Sony",
  "LG",
  "Other",
] as const;

type MobileBrand = typeof MOBILE_BRANDS[number];

const MOBILE_MODELS: Record<MobileBrand, string[]> = {
  Apple: ["iPhone 15", "iPhone 14", "iPhone 13", "iPhone 12", "iPhone 11", "iPhone X", "Other"],
  Samsung: ["Galaxy S23", "Galaxy S22", "Galaxy S21", "Galaxy Note 20", "Galaxy A Series", "Other"],
  Huawei: ["P50", "P40", "Mate 40", "Nova Series", "Other"],
  Xiaomi: ["Redmi Note 12", "Redmi Note 11", "Mi 11", "Mi 12", "Other"],
  Oppo: ["Reno 8", "Reno 7", "Find X5", "A Series", "Other"],
  Vivo: ["V25", "V23", "Y Series", "Other"],
  Realme: ["GT Neo 3", "9 Pro+", "8 Pro", "C Series", "Other"],
  OnePlus: ["11", "10 Pro", "9 Pro", "Nord Series", "Other"],
  Nokia: ["G60", "X30", "C Series", "Other"],
  Sony: ["Xperia 1 IV", "Xperia 5 IV", "Xperia 10 IV", "Other"],
  LG: ["Wing", "Velvet", "Other"],
  Other: ["Other"],
};

const conditions = ["New", "Used", "Open Box", "Refurbished", "For Parts"] as const;

const provinces: Province[] = [
  {
    name: "Punjab",
    cities: ["Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala", "Sialkot", "Sargodha", "Bahawalpur"],
  },
  {
    name: "Sindh",
    cities: ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah", "Thatta"],
  },
  {
    name: "Khyber Pakhtunkhwa",
    cities: ["Peshawar", "Mardan", "Abbottabad", "Swat", "Kohat", "Bannu"],
  },
  { name: "Balochistan", cities: ["Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi"] },
  { name: "Islamabad Capital Territory", cities: ["Islamabad"] },
];

const typeOptions: Record<string, { label: string; count: number }[]> = {
  Accessories: [
    { label: "Mobile", count: 930 },
    { label: "Tablet", count: 46 },
    { label: "Smart Watch", count: 11 },
  ],
};

// Components
const DynamicBrandModelFilter: React.FC<{ category: string }> = ({ category }) => {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  useEffect(() => {
    const filter = router.query.filter?.toString() ?? "";
    const brandMatch = filter.match(/brand_eq_([^,]+)/);
    const modelMatch = filter.match(/model_eq_([^,]+)/g);

    if (brandMatch) {
      const brand = brandMatch[1];
      if (MOBILE_BRANDS.includes(brand as MobileBrand)) {
        setSelectedBrand(brand);
      }
    } else {
      setSelectedBrand(null);
    }

    if (modelMatch) {
      const models = modelMatch.map((m) => decodeURIComponent(m.replace("model_eq_", "")));
      setSelectedModels(models.filter((m) => selectedBrand && MOBILE_MODELS[selectedBrand as MobileBrand]?.includes(m)));
    } else {
      setSelectedModels([]);
    }
  }, [router.query.filter, selectedBrand]);

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModels([]);
    updateFilterQuery(brand, []);
  };

  const handleModelSelect = (model: string) => {
    const newModels = selectedModels.includes(model)
      ? selectedModels.filter((m) => m !== model)
      : [...selectedModels, model];
    setSelectedModels(newModels);
    updateFilterQuery(selectedBrand, newModels);
  };

  const updateFilterQuery = (brand: string | null, models: string[]) => {
    const query = { ...router.query };
    let filterParts: string[] = [];

    const existingFilter = router.query.filter?.toString() ?? "";
    const nonBrandModelFilters = existingFilter
      .split(",")
      .filter((f) => !f.startsWith("brand_eq_") && !f.startsWith("model_eq_"));

    filterParts.push(...nonBrandModelFilters);

    if (brand) {
      filterParts.push(`brand_eq_${brand}`);
      if (models.length > 0) {
        models.forEach((model) => {
          filterParts.push(`model_eq_${encodeURIComponent(model)}`);
        });
      }
    }

    const filterQuery = filterParts.length > 0 ? filterParts.join(",") : undefined;
    if (filterQuery) {
      query.filter = filterQuery;
    } else {
      delete query.filter;
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  const clearSelection = () => {
    setSelectedBrand(null);
    setSelectedModels([]);
    updateFilterQuery(null, []);
  };

  const isValidBrand = (brand: string | null): brand is MobileBrand => {
    return brand !== null && brand in MOBILE_MODELS;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Brand & Model</h3>
      <select
        className="w-full border rounded p-2 text-gray-700 text-sm mb-2"
        value={selectedBrand ?? ""}
        onChange={(e) => handleBrandSelect(e.target.value)}
      >
        <option value="" disabled>
          Select Brand
        </option>
        {MOBILE_BRANDS.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {!selectedBrand && (
        <div className="flex flex-wrap gap-2 mt-2">
          {MOBILE_BRANDS.slice(0, 5).map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandSelect(brand)}
              className="text-blue-600 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              {brand}
            </button>
          ))}
        </div>
      )}

      {selectedBrand && isValidBrand(selectedBrand) && (
        <div className="mt-2">
          <div className="text-gray-700 text-sm mb-1">Select Models:</div>
          <div className="flex flex-wrap gap-2">
            {MOBILE_MODELS[selectedBrand].map((model) => (
              <div
                key={model}
                className={`px-2 py-1 rounded border cursor-pointer ${
                  selectedModels.includes(model)
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                } text-sm`}
                onClick={() => handleModelSelect(model)}
              >
                {model}
              </div>
            ))}
          </div>

          {selectedModels.length > 0 && (
            <div className="mt-3 flex items-center">
              <span className="text-gray-700 text-sm">Selected Models: </span>
              <div className="flex flex-wrap gap-1 ml-2">
                {selectedModels.map((model) => (
                  <span
                    key={model}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                  >
                    {model}
                  </span>
                ))}
              </div>
              <button onClick={clearSelection} className="ml-2 text-blue-600 text-xs">
                Clear
              </button>
            </div>
          )}
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

  const toggleSubCategory = (name: string) => {
    if (selectedSubCategory === name) {
      onSubCategorySelect(null);
      onTypeSelect(null);
    } else {
      onSubCategorySelect(name);
      onTypeSelect(null);
    }
  };

  const toggleType = (type: string) => {
    if (selectedType === type) {
      onTypeSelect(null);
    } else {
      onTypeSelect(type);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Mobile Categories</h3>
      <div className="space-y-1">
        {mobileCategories.map((category) => (
          <div key={category.slug} className="cursor-pointer">
            <Link
              href={`/${category.slug}`}
              className={`py-1 px-2 hover:bg-gray-100 block ${
                selectedCategory === category.slug ? "text-blue-600 font-medium" : "text-gray-800"
              }`}
              onClick={() => toggleCategory(category.slug)}
              style={{ fontSize: "12px", lineHeight: "1.5" }}
            >
              {category.name}
            </Link>

            {selectedCategory === category.slug && mobileSubCategories[category.slug] && (
              <div className="ml-4 space-y-1">
                {mobileSubCategories[category.slug].map((sub, index) => (
                  <div key={index}>
                    <Link
                      href={`/${category.slug}/${sub.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`py-1 cursor-pointer hover:text-blue-600 block ${
                        selectedSubCategory === sub.name ? "text-blue-600 font-medium" : "text-gray-700"
                      }`}
                      onClick={() => toggleSubCategory(sub.name)}
                      style={{ fontSize: "12px", lineHeight: "1.5" }}
                    >
                      {sub.name}
                    </Link>
                    {sub.types && selectedSubCategory === sub.name && (
                      <div className="ml-4 space-y-1">
                        {sub.types.map((type, i) => (
                          <Link
                            key={i}
                            href={`/${category.slug}/${sub.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")}/${type.toLowerCase().replace(/\s+/g, "-")}_id`}
                            className={`py-1 cursor-pointer hover:text-blue-600 block ${
                              selectedType === type ? "text-blue-600 font-medium" : "text-gray-600"
                            }`}
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                            onClick={() => toggleType(type)}
                          >
                            - {type}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ConditionSelectBox: React.FC<{
  minPrice: number | "";
  maxPrice: number | "";
  condition: string | null;
  onConditionChange: (condition: string | null) => void;
}> = ({ minPrice, maxPrice, condition, onConditionChange }) => {
  const router = useRouter();

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCondition = e.target.value || null;
    onConditionChange(newCondition);
  };

  const clearCondition = () => {
    onConditionChange(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Condition</h3>
      {condition ? (
        <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
          <span className="text-sm">{condition}</span>
          <button onClick={clearCondition} className="text-blue-600 text-xs">
            Change
          </button>
        </div>
      ) : (
        <select
          className="w-full border rounded p-2 text-gray-700 text-sm"
          value={condition ?? ""}
          onChange={handleConditionChange}
        >
          <option value="">Select Condition</option>
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

  const selectedProvinceData = selectedProvince
    ? provinces.find((prov) => prov.name === selectedProvince)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-bold text-lg mb-2">Locations</h3>
      <div className="space-y-2">
        {isLocationSelected && selectedCity && (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
            <span className="text-sm">
              {selectedProvince} - {selectedCity}
            </span>
            <button onClick={clearSelection} className="text-blue-600 text-xs">
              Change
            </button>
          </div>
        )}

        {!isLocationSelected && (
          <>
            <select
              className="w-full border rounded p-2 text-gray-700 text-sm"
              value={selectedProvince ?? ""}
              onChange={(e) => handleProvinceSelect(e.target.value)}
            >
              <option value="" disabled>
                Select Province
              </option>
              {provinces.map((province) => (
                <option key={province.name} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>

            {selectedProvince && selectedProvinceData && (
              <div className="mt-2 space-y-1">
                {selectedProvinceData.cities
                  .slice(0, showMoreCities ? undefined : 5)
                  .map((city, index) => (
                    <div
                      key={index}
                      className={`py-1 px-2 text-gray-700 hover:bg-gray-100 cursor-pointer ${
                        selectedCity === city ? "bg-blue-100" : ""
                      }`}
                      style={{ fontSize: "12px", lineHeight: "1.5" }}
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </div>
                  ))}
                {selectedProvinceData.cities.length > 5 && (
                  <button
                    onClick={toggleShowMoreCities}
                    className="text-blue-600 text-sm mt-1"
                  >
                    {showMoreCities ? "Show Less" : "Show More"}
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
  condition: string | null;
  onConditionChange: (condition: string | null) => void;
}> = ({ condition, onConditionChange }) => {
  const router = useRouter();
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [isPriceSet, setIsPriceSet] = useState<boolean>(false);
  const [isDeliverable, setIsDeliverable] = useState<boolean>(false);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMinPrice(isNaN(value) ? "" : value);
    setIsPriceSet(false);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMaxPrice(isNaN(value) ? "" : value);
    setIsPriceSet(false);
  };

  const applyPriceFilter = () => {
    setIsPriceSet(true);
    let filterParts: string[] = [];

    if (condition) {
      filterParts.push(`new_used_eq_${condition.toLowerCase()}`);
    }

    if (minPrice !== "" && maxPrice !== "") {
      filterParts.push(`price_between_${minPrice}_to_${maxPrice}`);
    } else if (minPrice !== "") {
      filterParts.push(`price_from_${minPrice}`);
    } else if (maxPrice !== "") {
      filterParts.push(`price_to_${maxPrice}`);
    }

    if (isDeliverable) {
      filterParts.push("is_deliverable");
    }

    const filterQuery = filterParts.length > 0 ? filterParts.join(",") : undefined;
    const query = { ...router.query };
    if (filterQuery) {
      query.filter = filterQuery;
    } else {
      delete query.filter;
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  const clearPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setIsPriceSet(false);
    let filterParts: string[] = [];

    if (condition) {
      filterParts.push(`new_used_eq_${condition.toLowerCase()}`);
    }

    if (isDeliverable) {
      filterParts.push("is_deliverable");
    }

    const filterQuery = filterParts.length > 0 ? filterParts.join(",") : undefined;
    const query = { ...router.query };
    if (filterQuery) {
      query.filter = filterQuery;
    } else {
      delete query.filter;
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  const toggleIsDeliverable = () => {
    setIsDeliverable((prev) => {
      const newDeliverable = !prev;
      let filterParts: string[] = [];

      if (condition) {
        filterParts.push(`new_used_eq_${condition.toLowerCase()}`);
      }

      if (minPrice !== "" && maxPrice !== "") {
        filterParts.push(`price_between_${minPrice}_to_${maxPrice}`);
      } else if (minPrice !== "") {
        filterParts.push(`price_from_${minPrice}`);
      } else if (maxPrice !== "") {
        filterParts.push(`price_to_${maxPrice}`);
      }

      if (newDeliverable) {
        filterParts.push("is_deliverable");
      }

      const filterQuery = filterParts.length > 0 ? filterParts.join(",") : undefined;
      const query = { ...router.query };
      if (filterQuery) {
        query.filter = filterQuery;
      } else {
        delete query.filter;
      }

      router.push(
        {
          pathname: router.pathname,
          query,
        },
        undefined,
        { shallow: true }
      );

      return newDeliverable;
    });
  };

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setIsPriceSet(false);
    setIsDeliverable(false);
    onConditionChange(null);
    const query = { ...router.query };
    delete query.filter;
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    const filter = router.query.filter?.toString() ?? "";
    const priceBetweenMatch = filter.match(/price_between_(\d+)_to_(\d+)/);
    const priceFromMatch = filter.match(/price_from_(\d+)/);
    const priceToMatch = filter.match(/price_to_(\d+)/);
    const deliverableMatch = filter.includes("is_deliverable");

    if (priceBetweenMatch) {
      setMinPrice(parseInt(priceBetweenMatch[1]));
      setMaxPrice(parseInt(priceBetweenMatch[2]));
      setIsPriceSet(true);
    } else if (priceFromMatch) {
      setMinPrice(parseInt(priceFromMatch[1]));
      setMaxPrice("");
      setIsPriceSet(true);
    } else if (priceToMatch) {
      setMinPrice("");
      setMaxPrice(parseInt(priceToMatch[1]));
      setIsPriceSet(true);
    } else {
      setMinPrice("");
      setMaxPrice("");
      setIsPriceSet(false);
    }

    setIsDeliverable(deliverableMatch);
  }, [router.query.filter]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Price</h3>
      <div className="space-y-2">
        {isPriceSet ? (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded text-gray-700">
            <span className="text-sm">
              {minPrice || maxPrice ? `Rs ${minPrice || "0"} - Rs ${maxPrice || "Any"}` : "Any"}
            </span>
            <button onClick={clearPriceFilter} className="text-blue-600 text-xs">
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
        <label htmlFor="isDeliverable" className="text-gray-700 text-sm">
          Is Deliverable
        </label>
      </div>

      {isDeliverable && (
        <div className="mt-2 text-gray-600 text-sm">Deliverable: Yes</div>
      )}

      <button onClick={clearAllFilters} className="text-blue-600 text-sm mt-3">
        Clear All
      </button>
    </div>
  );
};

const DynamicTypeFilterBox: React.FC<{ category: string }> = ({ category }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
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
          <span className="text-sm">{selectedTypes.join(", ")}</span>
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

const MobileProductCard: React.FC<{
  products: MobileProduct[];
  loading?: boolean;
}> = ({ products = [], loading = false }) => {
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
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
          >
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
        const isPtaApproved = product.pta_status === "PTA Approved";

        return (
          <article
            key={`${product.id}-${product.post_id}`}
            className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md"
          >
            <div className="relative aspect-video bg-gray-100">
              <Image
                src={product.images?.[0]?.url || "/images/placeholder.png"}
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
                    className={`text-xl ${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
                  />
                </button>
              </div>

              <h4 className="text-gray-700 font-medium text-sm line-clamp-2">
                {product.brand} {product.model}
              </h4>

              <div className="flex justify-between items-center text-gray-600 text-xs mt-2">
                <div className="flex items-center gap-1">
                  <LuTag />
                  <span>{product.condition}</span>
                </div>

                {product.pta_status && product.pta_status !== "N/A" && (
                  <div className="flex items-center gap-1">
                    {isPtaApproved ? (
                      <LuWifi className="text-green-500" />
                    ) : (
                      <LuWifiOff className="text-red-500" />
                    )}
                    <span>{isPtaApproved ? "PTA" : "NON PTA"}</span>
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

const MobilePhonePage: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>("mobile-phones");
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
  const [sortBy, setSortBy] = useState<string>("newest");
  const [condition, setCondition] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [products, setProducts] = useState<MobileProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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

  const updateFilterQuery = (newCondition: string | null) => {
    let filterParts: string[] = [];

    const existingFilter = router.query.filter?.toString() ?? "";
    const nonConditionFilters = existingFilter
      .split(",")
      .filter((f) => !f.startsWith("new_used_eq_"));

    filterParts.push(...nonConditionFilters);

    if (newCondition) {
      filterParts.push(`new_used_eq_${newCondition.toLowerCase()}`);
    }

    const filterQuery = filterParts.length > 0 ? filterParts.join(",") : undefined;
    const query = { ...router.query };
    if (filterQuery) {
      query.filter = filterQuery;
    } else {
      delete query.filter;
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
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
    setCondition(null);
    setMinPrice("");
    setMaxPrice("");
    router.push(
      {
        pathname: router.pathname,
        query: {},
      },
      undefined,
      { shallow: true }
    );
  };

  const handleConditionChange = (newCondition: string | null) => {
    setCondition(newCondition);
    updateFilterQuery(newCondition);
  };

  useEffect(() => {
    const fetchMobileProducts = async () => {
      try {
        setLoading(true);
        const filterQuery = router.query.filter ? `?filter=${router.query.filter}` : "";
        const response = await axios.get(`http://127.0.0.1:8000/api/mobile-phones${filterQuery}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching mobile products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMobileProducts();
  }, [router.query.filter]);

  useEffect(() => {
    const filter = router.query.filter?.toString() ?? "";
    let newCondition: string | null = null;

    if (filter) {
      const conditionMatch = filter.match(/new_used_eq_([^,]+)/);
      if (conditionMatch) {
        newCondition = conditions.find(
          (c) => c.toLowerCase() === conditionMatch[1].toLowerCase()
        ) || null;
      }
    }

    setCondition(newCondition);
  }, [router.query.filter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white py-2 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/mobiles_c1" className="hover:text-blue-600">
              Mobile Phones
            </Link>
            {selectedSubCategory && (
              <>
                <span className="mx-2">›</span>
                <Link
                  href={`/mobiles/${selectedSubCategory.toLowerCase().replace(/\s+/g, "-")}_id`}
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
            <PriceFilter condition={condition} onConditionChange={handleConditionChange} />
            <DynamicBrandModelFilter category={selectedCategory} />
            <ConditionSelectBox
              minPrice={minPrice}
              maxPrice={maxPrice}
              condition={condition}
              onConditionChange={handleConditionChange}
            />
            {selectedCategory === "accessories" && <DynamicTypeFilterBox category="Accessories" />}
          </div>

          <div className="w-full lg:w-3/4">
            <div className="md:hidden flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Mobile Products</h1>
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
                  <span className="text-sm text-gray-600">Condition:</span>
                  <select
                    className="border rounded p-2 text-gray-700 text-sm"
                    value={condition ?? ""}
                    onChange={(e) => handleConditionChange(e.target.value || null)}
                  >
                    <option value="">Select Condition</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
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

            <MobileProductCard products={products} loading={loading} />
            <div className="mt-6 flex justify-center">
              <nav className="flex items-center gap-1">
                <button className="px-3 py-1 rounded border text-sm">Previous</button>
                <button className="px-3 py-1 rounded border bg-blue-600 text-white text-sm">
                  1
                </button>
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
                  onClick={() => toggleSection("price")}
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
                        onChange={(e) =>
                          setPriceRange([Number(e.target.value), priceRange[1]])
                        }
                      />
                      <span className="mx-2">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-24 p-2 border rounded text-sm"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
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

export default MobilePhonePage;