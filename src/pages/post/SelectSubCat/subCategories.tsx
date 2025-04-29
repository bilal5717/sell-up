'use client';

import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';

// ==== Form Component Imports ====
import MobilesPosting from '@pages/post/PostCategoryForms/Mobiles';
import VehiclesPosting from '@pages/post/PostCategoryForms/Vehicles';
import PropertyPosting from '@pages/post/PostCategoryForms/Property_Rent';
import PropertySalePosting from '@pages/post/PostCategoryForms/Property_Sale';
import ElectronicsPosting from '@pages/post/PostCategoryForms/Electronics&Home';
import BikesPosting from '@pages/post/PostCategoryForms/Bikes';
import BusinessIndustrialForm from '@pages/post/PostCategoryForms/BusinessIndustrialAgriculture';
import ServicePostingForm from '@pages/post/PostCategoryForms/Services';
import JobPostingForm from '@pages/post/PostCategoryForms/Jobs';
import CreateAnimalPost from '@pages/post/PostCategoryForms/Animal';
import CreateBooksSportsHobbiesPost from '@pages/post/PostCategoryForms/BooksSportsNHobbies';
import CreateKidsPost from '@pages/post/PostCategoryForms/Kids';
import CreateFashionBeautyPost from '@pages/post/PostCategoryForms/FasionNBeauty';
import FurnitureHomeDecorPosting from '@pages/post/PostCategoryForms/FURNITURE_HOME_DECOR';

// ==== Types ====
type Category = {
  id: number;
  name: string;
  icon: string;
  subcategories?: string[];
};

type CategorySelectorProps = {
  category?: Category | null;
};

// ==== Constants ====
const CATEGORIES: Category[] = [
  { id: 1, name: 'Mobiles', icon: '📱', subcategories: ['Tablets', 'Accessories', 'Mobile Phones', 'Smart Watches'] },
  { id: 2, name: 'Vehicles', icon: '🚗', subcategories: [
    'Cars', 'Cars On Installments', 'Car Care', 'Car Accessories', 'Spare Parts', 'Oil & Lubricant',
    'Buses,Vans&Trucks', 'Rikshaw&Chingchi', 'Tractors&Trailers', 'Boats', 'Other Vehicles'
  ]},
  { id: 3, name: 'Property for Rent', icon: '🏘️', subcategories: [
    'Houses', 'Apartments & Flats', 'Portions & Floors', 'Shops, Offices & Commercial Spaces',
    'Roommates & Paying Guests', 'Rooms', 'Vacation Rentals & Guest Houses', 'Land & Plots'
  ]},
  { id: 4, name: 'Property for Sale', icon: '🏠', subcategories: [
    'Houses', 'Apartments & Flats', 'Portions & Floors', 'Shops, Offices & Commercial Spaces', 'Land & Plots'
  ]},
  { id: 5, name: 'Electronics & Home Appliances', icon: '💻', subcategories: [
    'Computer & Accessories', 'Games & Entertainment', 'Cameras & Accessories',
    'Videos & Audios', 'AC & Coolers', 'Fans', 'Heaters And Gysers', 'Washing Machines & dryers',
    'Irons & Steamers', 'Sewing Machines', 'Generators,UPS And Power Solutions', 'Refrigerator & Freezers',
    'Air Purifier & Humidfier', 'water dispensers', 'Microwave & Ovens', 'Kitchen Appliances', 'Other Electronics'
  ]},
  { id: 6, name: 'Bikes', icon: '🚲', subcategories: [
    'MotorCycles', 'Spare Parts', 'Bike Accessories', 'Bicycle', 'ATV & Quads', 'Scooters', 'Others'
  ]},
  { id: 7, name: 'Business, Industrial & Agriculture', icon: '🏭', subcategories: [
    'Business For Sale', 'Food & Restaurant', 'Construction & Heavy Machinery', 'Agriculture',
    'Medical & Pharma', 'Trade & Industrial Machinery', 'Farming Supplies', 'Commercial Kitchen Equipment',
    'Packaging Machinery', 'Other Business & Industry'
  ]},
  { id: 8, name: 'Services', icon: '🔧', subcategories: [
    'Architecture & Interior Design', 'Camera Installation', 'Car Rental', 'Car Services',
    'Catering & Restaurent', 'Construction Services', 'Consolatancy Services', 'Domestic Help', 'Driver & Taxi',
    'Tution & academics', 'Electronic & Computer Repair', 'Event Services', 'Farm & Fresh Food', 'Health & Beauty',
    'Home & Office Repair', 'Insurances Services', 'Movers & Packers', 'Renting Services', 'Tailor Services',
    'Travel & Visa', 'Video & Photography', 'Web Developement', 'Other Services'
  ]},
  { id: 9, name: 'Jobs', icon: '💼', subcategories: [
    'Accounting & Finance', 'Advertising & PR', 'Architecture & Interior Design', 'Clerical & Administration',
    'Content Writing', 'Customer Service', 'Delivery Riders', 'Domestic Staff', 'Education', 'Engineering',
    'Graphic Design', 'Hotels & Tourism', 'Human Resources', 'Internships', 'IT & Networking', 'Manufacturing',
    'Marketing', 'Medical', 'Online', 'Part Time', 'Real Estate', 'Restaurents & Hospitals', 'Sales', 'Security'
  ]},
  { id: 10, name: 'Animals', icon: '🐕', subcategories: ['Pets', 'Aquarium', 'Birds', 'Livestock', 'Animal Supplies', 'Others'] },
  { id: 11, name: 'Books, Sports & Hobbies', icon: '📚', subcategories: [
    'Sports Equipment', 'Musical Instruments', 'Gym & Fitness', 'Books & Magazines', 'Others'
  ]},
  { id: 12, name: 'Furniture & Home Decor', icon: '🛋️', subcategories: [
    'Sofa & Chair', 'Beds & Wardrobes', 'Tables & Dining', 'Bathroom & Accessories', 'Garden & Outdoor',
    'Painting & Mirror', 'Rugs & Carpets', 'Curtains & Blinds', 'Office Furniture', 'Home Decoration', 'Other Household items'
  ]},
  { id: 13, name: 'Fashion & Beauty', icon: '👗', subcategories: [
    'Clothes', 'Fashion Accessories', 'Makeup', 'Skin & Hair', 'Wedding', 'Footwear', 'Bags', 'Jewellery', 'Watches', 'Fragrance', 'Others'
  ]},
  { id: 14, name: 'Kids', icon: '👶', subcategories: [
    'Kids Furniture', 'Toys & Games', 'Bath & Diapers', 'Swings & Slides', 'Kids Accessories',
    'Kids Books', 'Kids Vehicle', 'Baby Gear', 'Kids Clothing', 'Others'
  ]},
];

const ACCESSORY_TYPES: string[] = [
  'Charging Cables', 'Converters', 'Chargers', 'Screens', 'Screen Protector',
  'Mobile Stands', 'Ring Lights', 'Selfie Sticks', 'Power Banks', 'Headphones',
  'EarPhones', 'Covers & Cases', 'External Memory', 'Other'
];

const CAR_CARE_TYPES: string[] = [
  'Air Fresher', 'Cleaners', 'Compound Polishes', 'Covers', 'Microfiber Clothes',
  'Shampoos', 'waxes', 'Other'
];

const CAR_ACCESSORY_TYPES: string[] = [
  'Tools&Gadget', 'Safety&Security', 'Interior', 'Exterior', 'Audio&Multimedia', 'Other'
];

const SPARE_PART_TYPES: string[] = [
  'Engines','Fenders','Filters','Front Grills','Fuel Pump','Gasket&seals','Horns',
  'Ignition Coil','Ignition Switchers','Insulation Sheets','Lights','Mirrors','Oxygen Sensors',
  'Power Stearings','Radiators&Coolants','Spark Plugs','Sun Visor','Suspension Parts','Trunk Parts',
  'Tyres','Windscreens','Wipers','Ac&Heating','Antennas','Batteries','Belt & Cables','Bonnets',
  'Brakes','Bumpers','Bushing','Buttons','Catalytic Converters','Door & Components','Engine Shields'
];

const OIL_LUBRICANT_TYPES: string[] = [
  'Chain Lubes And Cleaners','Brake Oil','CUTE Oil','Engine Oil','Fuel Additives',
  'Gear Oil','Multipurpose Grease','Oil additives','Coolants'
];

const ELECTRONICS_TYPES: Record<string, string[]> = {
  'Computer & Accessories': ['Desktops', 'Workstations', 'Gaming Pcs', 'Laptops', 'Computer & Laptop Accessories', 'Computer components', 'Servers', 'Softwares', 'Networking', 'Printers & photocopier', 'Inks & Toners'],
  'Games & Entertainment': ['Gaming console', 'Video Games', 'Controllers', 'Gaming Accessories', 'Other'],
  'Cameras & Accessories': ['Digital Camera', 'CCTV Camera', 'Drones', 'Binowlars', 'Video Cameras', 'Camera lenses', 'Flash Guns', 'Bags & cases', 'Tripods & Stands', 'Camera Batteries', 'Professional Microphone', 'Video Lights', 'Gimbles & Stablizers', 'Other Cameras Accessories'],
  'Videos & Audios': ['Radios', 'Microphone', 'Home Theater system', 'Amplifiers', 'Sound Bars', 'Speaker', 'Audio interface', 'Digital Recorders', 'Audio Mixer', 'Walkie Talkie', 'CD DVD Player', 'Turntable & Accessories', 'Cassette Player & Recorders', 'Mp3 Player', 'Car Audio Video', 'Other Video-audios'],
  'AC & Coolers': ['Air Conditions', 'Air Coolers', 'AC & Cooler Accessories', 'Other'],
  'Heaters And Gysers': ['Heaters', 'Geysers', 'Heating Rods', 'Other'],
  'Microwave & Ovens': ['Ovens', 'Microwaves'],
  'Generators,UPS And Power Solutions': ['Generators', 'UPS', 'Solar Panels', 'Solar Inverters', 'Solar Accessories', 'Batteries', 'Other'],
  'Refrigerator & Freezers': ['Refigerators', 'Freezers', 'Mini'],
  'Irons & Steamers': ['Irons', 'steamers'],
  'Washing Machines & dryers': ['Washer', 'Spin Dryer','Washer&Dryer'],
  'Kitchen Appliances': ['juicers','Food Factory','Stover','Blenders','Air Fryers','Choppers','Grilss','Water pori frers','Mixers','Electric Kettles','Toasters','Cookers','Hot Plates','Coffee & TeaMachines','Hobs','Dinner Seats','Sandwich Makers','Vegetable slicers','Hoods','Meat Grinders','Dishwashers','Roti Maker','Sinks','Food Steamers','Other Kitchen appliances'],
  'Other Electronics': ['Other']
};

const BIKES_TYPES: Record<string, string[]> = {
  'MotorCycles': ['Standard','Sports & Heavy Bikes', 'Cruiser' , 'Trail', 'Cafe Racers', 'Electric Bikes', 'Others'],
  'Spare Parts': ['Air filter','Carburelors','Bearing','Side Mirrors','Motorcycle Batteries','Switches','Lighting','Cylinders','Clutches','Pistons','Chain,cover & sprockets','Brakes','Handle Bavs & Grips','Levers','Seats','Exhausts','Fuel Tanks','Horns','Speedometers','Plugs','Stands','Tyres & Tubes','Other spareparts','Body & Frume','Slincer','Steering','Suspension','Transmission'],
  'Bike Accessories': ['Bicycle,Air pumps','Oil,Lubricants','Bike Covers','Bike Gloves','Helmets','Tail Boxes','Bike jackets','Bike locks','Safe Guards Other Bike-accessories','Chargers sticker & emblems'],
  'Bicycle': ['Road Bikes','Mountain Bikes','Hybrid Bikes','BMX Bike','Electric Bicycle','Folding bikes','Other Bicycle'],
  'Scooters': ['Petrol', 'Electric', 'Other']
};

const BUSINESS_AGRICULTURE_TYPES: Record<string, string[]> = {
  'Business For Sale': ['Mobile Shops', 'Water Plants', 'Beauty Salons', 'Grocery Store', 'Hotel & Resturant', 'Pharmacies','Snooker Clubs','Cosmetic & jewellery Shop','Gyms','Clinics','Franchises','Gift and Toy Shops','Petrol Pump','Auto parts shop','Other Bussiness'],
  'Construction & Heavy Machinery': ['Construction Material','Concrete Grinders','Drill Machines','Road Roller','Cranes','Construction Lifters','Pavers','Excavators','Concrete Cutters','Compactors','Water Pumps','Air Compressors','Domp Truck','Motor Granders','Other Heavy Equipment'],
  'Medical & Pharma': ['Ultrasound Machines','Surgical Masks','patient Beds','Wheelchairs','Oxygen Cylinders','Pulse Oximeters','Hearing aid','Blood pressure Monitors','Themometers','Walkers','Nebulizer','Breast Pump','Surgical instrument','Microscopes','Other Medical Supplies'],
  'Trade & Industrial Machinery': ['Woodworking Machines','Currency counting machine','Plastic & Rubber processing machine','Molding Machine','Packing Machine','Welding equipemnt','paper machine','Air compressors','Sealing Machine','Lathe Machines','Liquid Filling Machine','Marking Machine','Textile Machinery','Sewing Machine','Knithing Machine','Embroidery Machine','Printing Machine','Other bussiness & Industrial Machines'],
  'Food & Restaurant': ['Baking equipment','Food display counters','Ovens & Tandoor','Fryers','Tables & Platform','Fruit & Vegetable Machine','Chillers','Food Stall','Delivery Bags','Crockery & Cutlery','Ic-Cream Machines','Other resturant equipment'],
  'Agriculture': ['Farm Machinery and equipment','Seads','Crops','Pesticides & Fertilizer','Plant & Tree','Other agriculture Silage']
};

const SERVICES_TYPES: Record<string, string[]> = {
  'Domestic Help': ['Maids', 'Babysitters', 'Cooks', 'Nursing Staff', 'Other Domestic Help'],
  'Driver & Taxi': ['Drivers', 'Pick & drop', 'CarPool'],
  'Health & Beauty': ['Beauty &SPA', 'Fitness Trainer', 'Health Services'],
  'Home & Office Repair': ['Plumber', 'Electrician', 'Carpenters', 'Painters', 'AC services', 'Pest Control' ,'Water Tank Cleaning','Deep Cleaning','Geyser Services','Other Repair Services']
};

const JOBS_TYPES: Record<string, string[]> = {
  'Domestic Help': ['Maids', 'Babysitters', 'Cooks', 'Nursing Staff', 'Other Domestic Help'],
  'Driver & Taxi': ['Drivers', 'Pick & drop', 'CarPool'],
  'Health & Beauty': ['Beauty &SPA', 'Fitness Trainer', 'Health Services'],
  'Home & Office Repair': ['Plumber', 'Electrician', 'Carpenters', 'Painters', 'AC services', 'Pest Control' ,'Water Tank Cleaning','Deep Cleaning','Geyser Services','Other Repair Services']
};

const ANIMALS_TYPES: Record<string, string[]> = {
  'Pets': ['Dogs', 'Cats', 'Rabbits', 'Hamsters'],
  'Livestock': ['Cows', 'Goats', 'Sheep', 'Horses'],
  'Aquarium': ['Tropical Fish', 'Goldfish', 'Shrimp', 'Snails'],
  'Birds': ['Parrots', 'Canaries', 'Pigeons'],
  'Animal Supplies': ['Food&Accessories', 'Medicine', 'Others'],
};

const BOOKSNSPORTS_TYPES: Record<string, string[]> = {
  'Books & Magazines': ['Books', 'Magazines', 'Dictionaries', 'Stationary Items','Calculators'],
};

const KIDS_TYPES: Record<string, string[]> = {
  'Kids Vehicle': ['Kids Bikes', 'Kids Cars', 'Kids Cycles', 'Kids Scooties', 'Others'],
  'Baby Gear': ['Prams & Walkers', 'Baby Bouncers', 'Baby Carriers', 'Baby Cots', 'Baby Swings','Baby Seats','Baby High Chairs','Other baby Gears'],
  'Kids Clothing': ['Kids Costumes', 'Kids Cloths', 'Kids Shoes', 'Kids Uniform', 'Others'],
};

const FASION_BEAUTY_TYPES: Record<string, string[]> = {
  'Clothes': ['Eastern', 'Western', 'Hijabs & Abayas', 'Sports Clothes', 'Kids Clothes','Others'],
  'Fashion Accessories': ['Caps', 'Scarves', 'Ties', 'Belts', 'Soacks','Gloves','Cufflinks','Sunglasses'],
  'Makeup': ['Brushes', 'Lips', 'Eyes', 'Face', 'Nails','Accessories','Others'],
  'Skin & Hair': ['Hair Care','Skin Care'],
  'Wedding': ['Bridal', 'Grooms', 'Formal'],
  'Books & Magazines': ['Books', 'Magazines', 'Dictionaries', 'Stationary Items', 'Calculators'],
};

const FURNITURE_HOME_DECOR: Record<string, string[]> = {
  'Sofa & Chair': [
    'Sofas',
    'Sofa Beds',
    'Sofa Covers',
    'Cushions',
    'Chairs',
    'Recliners',
    'Bean Bags'
  ],
  'Beds & Wardrobes': [
    'Beds',
    'Mattresses',
    'Mattress Covers',
    'Pillows & Cases',
    'Bed Sheets',
    'Blankets & Comforters',
    'Other Bedding Accessories'
  ],
  'Bathroom & Accessories': [
    'Basins',
    'Bath Cabinets',
    'Bath Towels',
    'Bathtubs',
    'Shower Cabins',
    'Soap Dispensers',
    'Taps',
    'Toilets',
    'Vanity Units',
    'Other Bathroom Accessories'
  ],
  'Garden & Outdoor': [
    'Artificial Grass',
    'Benches',
    'Outdoor Chairs',
    'Outdoor Tables',
    'Outdoor Fountains',
    'Outdoor Lights',
    'Outdoor Umbrellas',
    'Outdoor Swings',
    'Plants and Pots',
    'Tents and Shades',
    'Other Outdoor Items'
  ],
  'Painting & Mirror': [
    'Paintings',
    'Painting Accessories',
    'Frames',
    'Mirror Lights',
    'Mirrors'
  ],
  'Rugs & Carpets': [
    'Rugs',
    'Carpets',
    'DoorMats',
    'Prayer Mats',
    'Other Floor Covers'
  ],
  'Curtains & Blinds': [
    'Curtains',
    'Blinds',
    'Accessories'
  ],
  'Office Furniture': [
    'Office Chairs',
    'Office Sofas',
    'Office Cabinets',
    'shelves & Racks',
    'Office Tables',
    'Other Office Furniture'
  ],
  'Home Decoration': [
    'Artificial Flower & Plants',
    'Candles',
    'Chandelives',
    'Decorative Items',
    'Decorative Trays',
    'Indoor Fountains',
    'Lamps',
    'Tissues Boxes',
    'Sculptures',
    'Vases',
    'Flooring',
    'Wall Clocks',
    'Wall Hangings',
    'Wall Lights',
    'Other Decore Items'
  ],
};

// ==== Styled Components ====
const Wrapper = styled.div`
  padding: 30px 20px;
  max-width: 1100px;
  margin: auto;
`;

const PageHeading = styled.h2`
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #444;
  margin-bottom: 30px;
`;

const Grid = styled.div`
  overflow-x: auto;
`;

const GridInner = styled.div`
  display: flex;
  gap: 20px;
  min-width: 960px;
`;

const Box = styled.div`
  min-width: 300px;
  max-width: 400px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
`;

interface ItemProps {
  active?: boolean;
}

const Item = styled.div<ItemProps>`
  padding: 12px 16px;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: ${({ active }) => (active ? '600' : 'normal')};
  background-color: ${({ active }) => (active ? '#f1f1f1' : 'white')};
  
  &:hover {
    background-color: #f8f9fa;
    color: #e67e22;
  }
  
  &:focus {
    outline: 2px solid #e67e22;
  }
`;

const GroupTitle = styled(Item)`
  font-weight: bold;
  background: #fafafa;
`;

const Indent = styled.div`
  padding-left: 20px;
`;

const PostingContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const BackButton = styled.button`
  background: #f8f9fa;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #e9ecef;
  }
`;

// ==== Main Component ====
export default function CategorySelector({ category = null }: CategorySelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<string | null>(null);
  const [showPostingForm, setShowPostingForm] = useState(false);
  const [postingFormType, setPostingFormType] = useState<string | null>(null);
  const [selectionPath, setSelectionPath] = useState<string[]>([]);

  const accessoryItems = useMemo(() => {
    if (!selectedCategory || !selectedSubcategory) return [];
    
    switch (selectedCategory.name) {
      case 'Mobiles':
        return selectedSubcategory === 'Accessories' ? ACCESSORY_TYPES : [];
      case 'Vehicles':
        if (selectedSubcategory === 'Car Care') return CAR_CARE_TYPES;
        if (selectedSubcategory === 'Car Accessories') return CAR_ACCESSORY_TYPES;
        if (selectedSubcategory === 'Spare Parts') return SPARE_PART_TYPES;
        if (selectedSubcategory === 'Oil & Lubricant') return OIL_LUBRICANT_TYPES;
        return [];
      case 'Electronics & Home Appliances':
        return ELECTRONICS_TYPES[selectedSubcategory] || [];
      case 'Bikes':
        return BIKES_TYPES[selectedSubcategory] || [];
      case 'Business, Industrial & Agriculture':
        return BUSINESS_AGRICULTURE_TYPES[selectedSubcategory] || [];
      case 'Services':
        return SERVICES_TYPES[selectedSubcategory] || [];
      case 'Jobs':
        return JOBS_TYPES[selectedSubcategory] || [];
      case 'Animals':
        return ANIMALS_TYPES[selectedSubcategory] || [];
      case 'Books, Sports & Hobbies':
        return BOOKSNSPORTS_TYPES[selectedSubcategory] || [];
      case 'Kids':
        return KIDS_TYPES[selectedSubcategory] || [];
      case 'Fashion & Beauty':
        return FASION_BEAUTY_TYPES[selectedSubcategory] || [];
      case 'Furniture & Home Decor':
        return FURNITURE_HOME_DECOR[selectedSubcategory] || [];
      default:
        return [];
    }
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    if (category) {
      const found = CATEGORIES.find(c => c.id === category.id);
      if (found) {
        setSelectedCategory(found);
        setSelectedSubcategory(null);
        setSelectedAccessory(null);
        setShowPostingForm(false);
        setSelectionPath([found.name]);
      }
    }
  }, [category]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSelectedAccessory(null);
    setShowPostingForm(false);
    setSelectionPath([category.name]);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    if (!selectedCategory) return;
    
    setSelectedSubcategory(subcategory);
    setSelectedAccessory(null);
    setSelectionPath([selectedCategory.name, subcategory]);
    
    // Determine if we should show the posting form immediately
    if (selectedCategory.name === 'Mobiles') {
      if (['Tablets', 'Mobile Phones', 'Smart Watches'].includes(subcategory)) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    } 
    else if (selectedCategory.name === 'Vehicles') {
      if (!['Car Care', 'Car Accessories', 'Spare Parts', 'Oil & Lubricant'].includes(subcategory)) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (['Property for Rent', 'Property for Sale'].includes(selectedCategory.name)) {
      setPostingFormType(subcategory);
      setShowPostingForm(true);
    }
    else if (selectedCategory.name === 'Electronics & Home Appliances') {
      if (!ELECTRONICS_TYPES[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (selectedCategory.name === 'Bikes') {
      if (!BIKES_TYPES[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (selectedCategory.name === 'Business, Industrial & Agriculture') {
      if (!BUSINESS_AGRICULTURE_TYPES[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (selectedCategory.name === 'Services') {
      if (!SERVICES_TYPES[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (selectedCategory.name === 'Jobs') {
      if (!JOBS_TYPES[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (selectedCategory.name === 'Animals') {
      if (!ANIMALS_TYPES[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (selectedCategory.name === 'Books, Sports & Hobbies') {
      if (!BOOKSNSPORTS_TYPES[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (selectedCategory.name === 'Kids') {
      if (!KIDS_TYPES[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (selectedCategory.name === 'Fashion & Beauty') {
      if (!FASION_BEAUTY_TYPES[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
    else if (selectedCategory.name === 'Furniture & Home Decor') {
      if (!FURNITURE_HOME_DECOR[subcategory]) {
        setPostingFormType(subcategory);
        setShowPostingForm(true);
      }
    }
  };

  const handleAccessorySelect = (accessory: string) => {
    setSelectedAccessory(accessory);
    setPostingFormType(accessory);
    setShowPostingForm(true);
    setSelectionPath([...selectionPath, accessory]);
  };

  const renderCategoryItem = (cat: Category) => (
    <Item 
      key={cat.id} 
      onClick={() => handleCategorySelect(cat)} 
      active={selectedCategory?.id === cat.id}
      tabIndex={0}
      role="button"
      aria-pressed={selectedCategory?.id === cat.id}
    >
      <span>{cat.icon} {cat.name}</span>
      {cat.subcategories && <span>&rsaquo;</span>}
    </Item>
  );

  const renderSubcategoryItem = (sub: string) => (
    <Item 
      key={sub} 
      onClick={() => handleSubcategorySelect(sub)} 
      active={selectedSubcategory === sub}
      tabIndex={0}
      role="button"
      aria-pressed={selectedSubcategory === sub}
    >
      <span>{sub}</span>
      {selectedCategory && (
        (selectedCategory.name === 'Mobiles' && sub === 'Accessories') ||
        (selectedCategory.name === 'Vehicles' && ['Car Care', 'Car Accessories', 'Spare Parts', 'Oil & Lubricant'].includes(sub)) ||
        (selectedCategory.name === 'Electronics & Home Appliances' && ELECTRONICS_TYPES[sub]) ||
        (selectedCategory.name === 'Bikes' && BIKES_TYPES[sub]) ||
        (selectedCategory.name === 'Business, Industrial & Agriculture' && BUSINESS_AGRICULTURE_TYPES[sub]) ||
        (selectedCategory.name === 'Services' && SERVICES_TYPES[sub]) ||
        (selectedCategory.name === 'Jobs' && JOBS_TYPES[sub]) ||
        (selectedCategory.name === 'Animals' && ANIMALS_TYPES[sub]) ||
        (selectedCategory.name === 'Books, Sports & Hobbies' && BOOKSNSPORTS_TYPES[sub]) ||
        (selectedCategory.name === 'Kids' && KIDS_TYPES[sub]) ||
        (selectedCategory.name === 'Fashion & Beauty' && FASION_BEAUTY_TYPES[sub]) ||
        (selectedCategory.name === 'Furniture & Home Decor' && FURNITURE_HOME_DECOR[sub])
      ) && <span>&rsaquo;</span>}
    </Item>
  );

  const renderBreadcrumbs = () => (
    <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
      {selectionPath.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span style={{ color: '#6c757d' }}>/</span>}
          <span style={{ color: index === selectionPath.length - 1 ? '#e67e22' : '#6c757d' }}>
            {item}
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  const renderPostForm = () => {
    if (!selectedCategory) return null;

    switch (selectedCategory.name) {
      case 'Mobiles':
        return selectedSubcategory === 'Accessories' ? (
          <MobilesPosting selectedCat={'Mobiles'} selectedSubCatOption={selectedSubcategory} selectedAccessory={postingFormType} />
        ) : (
          <MobilesPosting selectedCat={'Mobiles'} selectedSubCatOption={postingFormType} selectedAccessory={null}/>
        );
      case 'Vehicles':
        return ['Car Care', 'Car Accessories', 'Spare Parts', 'Oil & Lubricant'].includes(selectedSubcategory || '') ? (
          <VehiclesPosting selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <VehiclesPosting selectedSubCat={postingFormType} selectedType={null} />
        );
      case 'Property for Rent':
        return <PropertyPosting selectedSubCat={postingFormType} />;
      case 'Property for Sale':
        return <PropertySalePosting selectedSubCat={postingFormType} />;
      case 'Electronics & Home Appliances':
        return <ElectronicsPosting selectedSubCat={selectedSubcategory} selectedType={postingFormType} />;
      case 'Bikes':
        return BIKES_TYPES[selectedSubcategory || ''] ? (
          <BikesPosting selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <BikesPosting selectedSubCat={postingFormType} selectedType={null}/>
        );
      case 'Business, Industrial & Agriculture':
        return BUSINESS_AGRICULTURE_TYPES[selectedSubcategory || ''] ? (
          <BusinessIndustrialForm selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <BusinessIndustrialForm selectedSubCat={postingFormType} selectedType={null} />
        );
      case 'Services':
        return SERVICES_TYPES[selectedSubcategory || ''] ? (
          <ServicePostingForm selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <ServicePostingForm selectedSubCat={postingFormType} selectedType={null}/>
        );
      case 'Jobs':
        return JOBS_TYPES[selectedSubcategory || ''] ? (
          <JobPostingForm selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <JobPostingForm selectedSubCat={postingFormType} selectedType={null}/>
        );
      case 'Animals':
        return ANIMALS_TYPES[selectedSubcategory || ''] ? (
          <CreateAnimalPost selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <CreateAnimalPost selectedSubCat={postingFormType} selectedType={null}/>
        );
      case 'Books, Sports & Hobbies':
        return BOOKSNSPORTS_TYPES[selectedSubcategory || ''] ? (
          <CreateBooksSportsHobbiesPost selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <CreateBooksSportsHobbiesPost selectedSubCat={postingFormType} selectedType={null}/>
        );
      case 'Kids':
        return KIDS_TYPES[selectedSubcategory || ''] ? (
          <CreateKidsPost selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <CreateKidsPost selectedSubCat={postingFormType} selectedType={null} />
        );
      case 'Fashion & Beauty':
        return FASION_BEAUTY_TYPES[selectedSubcategory || ''] ? (
          <CreateFashionBeautyPost selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <CreateFashionBeautyPost selectedSubCat={postingFormType} selectedType={null}/>
        );
      case 'Furniture & Home Decor':
        return FURNITURE_HOME_DECOR[selectedSubcategory || ''] ? (
          <FurnitureHomeDecorPosting selectedSubCat={selectedSubcategory} selectedType={postingFormType} />
        ) : (
          <FurnitureHomeDecorPosting selectedSubCat={postingFormType} selectedType={null}/>
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <PageHeading>Post your ad</PageHeading>

      {showPostingForm ? (
        <PostingContainer>
          {renderBreadcrumbs()}
          {renderPostForm()}
        </PostingContainer>
      ) : (
        <>
          {renderBreadcrumbs()}
          <Grid>
            <GridInner>
              <Box>
                <GroupTitle>Main Category</GroupTitle>
                {CATEGORIES.map(renderCategoryItem)}
              </Box>

              {selectedCategory?.subcategories && (
                <Box>
                  <GroupTitle>Sub Category</GroupTitle>
                  {selectedCategory.subcategories.map(renderSubcategoryItem)}
                </Box>
              )}

              {accessoryItems.length > 0 && (
                <Box>
                  <GroupTitle>{selectedSubcategory} Type</GroupTitle>
                  {accessoryItems.map((acc, index) => (
                    <Item
                      key={index}
                      onClick={() => handleAccessorySelect(acc)}
                      active={selectedAccessory === acc}
                      tabIndex={0}
                      role="button"
                      aria-pressed={selectedAccessory === acc}
                      >
                      <span>{acc}</span>
                    </Item>
                  ))}
                </Box>
              )}
            </GridInner>
          </Grid>
        </>
      )}
    </Wrapper>
  );
}
