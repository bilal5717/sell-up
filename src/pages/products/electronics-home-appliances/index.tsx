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
  LuWifi, 
  LuWifiOff 
} from 'react-icons/lu';
import axios from 'axios';

// Interfaces
interface Product {
  id: number;
  post_id: number;
  brand: string;
  model: string;
  condition: string;
  price: string;
  location: string;
  posted_at: string;
  images?: { url: string; is_featured: number; order: number }[];
  title?: string;
  category?: string;
  sub_category?: string;
  type?: string;
  warranty?: string;
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
const brandOptions: Record<string, Brand[]> = {
  'Electronics & Home Appliances': [
	{ name: 'Apple', count: 73899, models: ['MacBook', 'iMac', 'iPad', 'iPhone'] },
	{ name: 'Samsung', count: 21646, models: ['TV', 'Refrigerator', 'Washing Machine', 'AC'] },
	{ name: 'LG', count: 12032, models: ['TV', 'Refrigerator', 'Washing Machine', 'AC'] },
	{ name: 'Dell', count: 11539, models: ['Laptop', 'Desktop', 'Monitor', 'Printer'] },
	{ name: 'HP', count: 9400, models: ['Laptop', 'Desktop', 'Printer', 'Scanner'] },
	{ name: 'Sony', count: 9085, models: ['TV', 'Camera', 'PlayStation', 'Headphones'] },
  ]
};

const categories: Category[] = [
  { name: 'Electronics & Home Appliances', slug: 'electronics-home-appliances' },
];

const subCategories: CategoryData = {
  'electronics-home-appliances': [
	{ 
	  name: 'Computer & Accessories', 
	  slug: 'computer-accessories',
	  types: [
		{ name: 'Desktops', slug: 'desktops' },
		{ name: 'Workstations', slug: 'workstations' },
		{ name: 'Gaming Pcs', slug: 'gaming-pcs' },
		{ name: 'Laptops', slug: 'laptops' },
		{ name: 'Computer & Laptop Accessories', slug: 'computer-laptop-accessories' },
		{ name: 'Computer components', slug: 'computer-components' },
		{ name: 'Servers', slug: 'servers' },
		{ name: 'Softwares', slug: 'softwares' },
		{ name: 'Networking', slug: 'networking' },
		{ name: 'Printers & photocopier', slug: 'printers-photocopier' },
		{ name: 'Inks & Toners', slug: 'inks-toners' }
	  ]
	},
	{ 
	  name: 'Games & Entertainment', 
	  slug: 'games-entertainment',
	  types: [
		{ name: 'Gaming console', slug: 'gaming-console' },
		{ name: 'Video Games', slug: 'video-games' },
		{ name: 'Controllers', slug: 'controllers' },
		{ name: 'Gaming Accessories', slug: 'gaming-accessories' },
		{ name: 'Other', slug: 'other-games' }
	  ]
	},
	{ 
	  name: 'Cameras & Accessories', 
	  slug: 'cameras-accessories',
	  types: [
		{ name: 'Digital Camera', slug: 'digital-camera' },
		{ name: 'CCTV Camera', slug: 'cctv-camera' },
		{ name: 'Drones', slug: 'drones' },
		{ name: 'Binowlars', slug: 'binowlars' },
		{ name: 'Video Cameras', slug: 'video-cameras' },
		{ name: 'Camera lenses', slug: 'camera-lenses' },
		{ name: 'Flash Guns', slug: 'flash-guns' },
		{ name: 'Bags & cases', slug: 'bags-cases' },
		{ name: 'Tripods & Stands', slug: 'tripods-stands' },
		{ name: 'Camera Batteries', slug: 'camera-batteries' },
		{ name: 'Professional Microphone', slug: 'professional-microphone' },
		{ name: 'Video Lights', slug: 'video-lights' },
		{ name: 'Gimbles & Stablizers', slug: 'gimbles-stablizers' },
		{ name: 'Other Cameras Accessories', slug: 'other-cameras-accessories' }
	  ]
	},
	{ 
	  name: 'Videos & Audios', 
	  slug: 'videos-audios',
	  types: [
		{ name: 'Radios', slug: 'radios' },
		{ name: 'Microphone', slug: 'microphone' },
		{ name: 'Home Theater system', slug: 'home-theater-system' },
		{ name: 'Amplifiers', slug: 'amplifiers' },
		{ name: 'Sound Bars', slug: 'sound-bars' },
		{ name: 'Speaker', slug: 'speaker' },
		{ name: 'Audio interface', slug: 'audio-interface' },
		{ name: 'Digital Recorders', slug: 'digital-recorders' },
		{ name: 'Audio Mixer', slug: 'audio-mixer' },
		{ name: 'Walkie Talkie', slug: 'walkie-talkie' },
		{ name: 'CD DVD Player', slug: 'cd-dvd-player' },
		{ name: 'Turntable & Accessories', slug: 'turntable-accessories' },
		{ name: 'Cassette Player & Recorders', slug: 'cassette-player-recorders' },
		{ name: 'Mp3 Player', slug: 'mp3-player' },
		{ name: 'Car Audio Video', slug: 'car-audio-video' },
		{ name: 'Other Video-audios', slug: 'other-video-audios' }
	  ]
	},
	{ 
	  name: 'AC & Coolers', 
	  slug: 'ac-coolers',
	  types: [
		{ name: 'Air Conditions', slug: 'air-conditions' },
		{ name: 'Air Coolers', slug: 'air-coolers' },
		{ name: 'AC & Cooler Accessories', slug: 'ac-cooler-accessories' },
		{ name: 'Other', slug: 'other-ac' }
	  ]
	},
	{ name: 'Fans', slug: 'fans' },
	{ 
	  name: 'Heaters And Gysers', 
	  slug: 'heaters-gysers',
	  types: [
		{ name: 'Heaters', slug: 'heaters' },
		{ name: 'Geysers', slug: 'geysers' },
		{ name: 'Heating Rods', slug: 'heating-rods' },
		{ name: 'Other', slug: 'other-heaters' }
	  ]
	},
	{ 
	  name: 'Washing Machines & dryers', 
	  slug: 'washing-machines-dryers',
	  types: [
		{ name: 'Washer', slug: 'washer' },
		{ name: 'Spin Dryer', slug: 'spin-dryer' },
		{ name: 'Washer&Dryer', slug: 'washer-dryer' }
	  ]
	},
	{ name: 'Irons & Steamers', slug: 'irons-steamers' },
	{ name: 'Sewing Machines', slug: 'sewing-machines' },
	{ 
	  name: 'Generators,UPS And Power Solutions', 
	  slug: 'generators-ups-power-solutions',
	  types: [
		{ name: 'Generators', slug: 'generators' },
		{ name: 'UPS', slug: 'ups' },
		{ name: 'Solar Panels', slug: 'solar-panels' },
		{ name: 'Solar Inverters', slug: 'solar-inverters' },
		{ name: 'Solar Accessories', slug: 'solar-accessories' },
		{ name: 'Batteries', slug: 'batteries' },
		{ name: 'Other', slug: 'other-power' }
	  ]
	},
	{ 
	  name: 'Refrigerator & Freezers', 
	  slug: 'refrigerator-freezers',
	  types: [
		{ name: 'Refigerators', slug: 'refrigerators' },
		{ name: 'Freezers', slug: 'freezers' },
		{ name: 'Mini', slug: 'mini' }
	  ]
	},
	{ name: 'Air Purifier & Humidfier', slug: 'air-purifier-humidifier' },
	{ name: 'water dispensers', slug: 'water-dispensers' },
	{ 
	  name: 'Microwave & Ovens', 
	  slug: 'microwave-ovens',
	  types: [
		{ name: 'Ovens', slug: 'ovens' },
		{ name: 'Microwaves', slug: 'microwaves' }
	  ]
	},
	{ 
	  name: 'Kitchen Appliances', 
	  slug: 'kitchen-appliances',
	  types: [
		{ name: 'juicers', slug: 'juicers' },
		{ name: 'Food Factory', slug: 'food-factory' },
		{ name: 'Stover', slug: 'stover' },
		{ name: 'Blenders', slug: 'blenders' },
		{ name: 'Air Fryers', slug: 'air-fryers' },
		{ name: 'Choppers', slug: 'choppers' },
		{ name: 'Grilss', slug: 'grills' },
		{ name: 'Water pori frers', slug: 'water-purifiers' },
		{ name: 'Mixers', slug: 'mixers' },
		{ name: 'Electric Kettles', slug: 'electric-kettles' },
		{ name: 'Toasters', slug: 'toasters' },
		{ name: 'Cookers', slug: 'cookers' },
		{ name: 'Hot Plates', slug: 'hot-plates' },
		{ name: 'Coffee & TeaMachines', slug: 'coffee-tea-machines' },
		{ name: 'Hobs', slug: 'hobs' },
		{ name: 'Dinner Seats', slug: 'dinner-seats' },
		{ name: 'Sandwich Makers', slug: 'sandwich-makers' },
		{ name: 'Vegetable slicers', slug: 'vegetable-slicers' },
		{ name: 'Hoods', slug: 'hoods' },
		{ name: 'Meat Grinders', slug: 'meat-grinders' },
		{ name: 'Dishwashers', slug: 'dishwashers' },
		{ name: 'Roti Maker', slug: 'roti-maker' },
		{ name: 'Sinks', slug: 'sinks' },
		{ name: 'Food Steamers', slug: 'food-steamers' },
		{ name: 'Other Kitchen appliances', slug: 'other-kitchen-appliances' }
	  ]
	},
	{ name: 'Other Electronics', slug: 'other-electronics' }
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
  'Computer & Accessories': [
	{ label: 'Laptop', count: 930 },
	{ label: 'Desktop', count: 460 },
	{ label: 'Printer', count: 110 },
  ],
  'Kitchen Appliances': [
	{ label: 'Microwave', count: 420 },
	{ label: 'Blender', count: 380 },
	{ label: 'Toaster', count: 150 },
  ]
};

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

const DynamicBrandModelFilter: React.FC<{ category: string }> = ({ category }) => {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const handleBrandSelect = (brand: string) => {
	setSelectedBrand(brand);
	setSelectedModels([]);
  };

  const handleModelSelect = (model: string) => {
	if (selectedModels.includes(model)) {
	  setSelectedModels((prev) => prev.filter((m) => m !== model));
	} else {
	  setSelectedModels((prev) => [...prev, model]);
	}
  };

  const clearSelection = () => {
	setSelectedBrand(null);
	setSelectedModels([]);
  };

  const brands = brandOptions[category] || [];

  return (
	<div className="bg-white rounded-lg shadow-sm p-4 mb-4">
	  <h3 className="font-bold text-lg mb-2">Brand & Model</h3>
	  <select
		className="w-full border rounded p-2 text-gray-700 text-sm mb-2"
		value={selectedBrand || ''}
		onChange={(e) => handleBrandSelect(e.target.value)}
	  >
		<option value="" disabled>Select Brand</option>
		{brands.map((brand) => (
		  <option key={brand.name} value={brand.name}>
			{brand.name} ({brand.count})
		  </option>
		))}
	  </select>

	  {!selectedBrand && (
		<div className="flex flex-wrap gap-2 mt-2">
		  {brands.slice(0, 5).map((brand) => (
			<button
			  key={brand.name}
			  onClick={() => handleBrandSelect(brand.name)}
			  className="text-blue-600 text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-100"
			>
			  {brand.name} ({brand.count})
			</button>
		  ))}
		</div>
	  )}

	  {selectedBrand && (
		<div className="mt-2">
		  <div className="text-gray-700 text-sm mb-1">Select Models:</div>
		  <div className="flex flex-wrap gap-2">
			{brands
			  .find((brand) => brand.name === selectedBrand)
			  ?.models.map((model) => (
				<div
				  key={model}
				  className={`px-2 py-1 rounded border cursor-pointer ${
					selectedModels.includes(model)
					  ? 'bg-blue-100 text-blue-700 border-blue-300'
					  : 'text-gray-700 border-gray-300 hover:bg-gray-100'
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
			  <button
				onClick={clearSelection}
				className="ml-2 text-blue-600 text-xs"
			  >
				Clear
			  </button>
			</div>
		  )}
		</div>
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

const ElectronicsProductCard: React.FC<{ products: Product[]; loading?: boolean }> = ({
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
		<p className="text-gray-500">No products found</p>
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
				alt={`${product.brand} ${product.model}`}
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

				{product.warranty && (
				  <div className="flex items-center gap-1">
					<span>Warranty: {product.warranty}</span>
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

const ElectronicsCategoryPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('electronics-home-appliances');
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
  const [products, setProducts] = useState<Product[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [lastPage, setLastPage] = useState(1); // Track total pages
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
 
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

  // Fetch products based on selected slugs
	useEffect(() => {
	const fetchProducts = async (page: number = 1) => {
	  try {
		setLoading(true);
		const params = new URLSearchParams();
		if (selectedSubCategory) {
		  const subCatSlug = subCategories[selectedCategory].find(sub => sub.name === selectedSubCategory)?.slug;
		  if (selectedType) {
			const typeSlug = subCategories[selectedCategory]
			  .find(sub => sub.name === selectedSubCategory)
			  ?.types?.find(type => type.name === selectedType)?.slug;
			if (typeSlug) params.append('slug', typeSlug);
		  } else if (subCatSlug) {
			params.append('slug', subCatSlug);
		  }
		}
		params.append('page', page.toString());
		const response = await axios.get(`http://127.0.0.1:8000/api/electronics?${params.toString()}`);
		setProducts(response.data.data); // Use response.data.data for product array
		setCurrentPage(response.data.current_page);
		setLastPage(response.data.last_page);
	  } catch (error) {
		console.error('Error fetching electronics products:', error);
		setProducts([]); // Set empty array on error to prevent map errors
	  } finally {
		setLoading(false);
	  }
	};

	fetchProducts(currentPage);
  }, [selectedCategory, selectedSubCategory, selectedType, currentPage]);

  const toggleSection = (section: string) => {
	setExpandedSections(prev => ({
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
	router.push(`/${selectedCategory}`);
  };

  return (
	<div className="bg-gray-50 min-h-screen">
	  <div className="bg-white py-2 px-4 border-b">
		<div className="container mx-auto">
		  <div className="flex items-center text-sm text-gray-600">
			<span>Home</span>
			<span className="mx-2">›</span>
			<span>Electronics & Home Appliances</span>
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
			<PriceFilter />
			<DynamicBrandModelFilter category="Electronics & Home Appliances" />
			<ConditionSelectBox />
			{selectedSubCategory && typeOptions[selectedSubCategory] && (
			  <DynamicTypeFilterBox category={selectedSubCategory} />
			)}
		  </div>

		  <div className="w-full lg:w-3/4">
			<div className="md:hidden flex justify-between items-center mb-4">
			  <h1 className="text-xl font-bold">Electronics & Home Appliances</h1>
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
				  `Showing ${selectedSubCategory} products${selectedType ? ` (${selectedType})` : ''}` : 
				  'Showing all Electronics & Home Appliances products'}
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

			<ElectronicsProductCard 
			  products={products}
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
			  <h3 className="text-xl font-bold">Products</h3>
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

export default ElectronicsCategoryPage;