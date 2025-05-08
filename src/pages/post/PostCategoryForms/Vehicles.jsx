"use client";
import React, { useState, useMemo } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch, FiCalendar } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import CarFeaturesSelection from '@/components/models/featureCarModel';

// Constants
const CATEGORIES = [
  { id: 1, name: 'Mobiles', icon: '📱', component: 'MobilesPosting' },
  { id: 2, name: 'Vehicles', icon: '🚗', component: 'VehiclesPosting' },
  { id: 3, name: 'Property for Sale', icon: '🏠', component: 'PropertySalePosting' },
  { id: 4, name: 'Property for Rent', icon: '🏘️', component: 'PropertyForRent' },
  { id: 5, name: 'Electronics & Home Appliances', icon: '💻', component: 'ElectronicsPosting' },
  { id: 6, name: 'Bikes', icon: '🚲', component: 'BikesPosting' },
  { id: 7, name: 'Business, Industrial & Agriculture', icon: '🏭', component: 'BusinessIndustrialForm' },
  { id: 8, name: 'Services', icon: '🔧', component: 'ServicePostingForm' },
  { id: 9, name: 'Jobs', icon: '💼', component: 'JobPostingForm' },
  { id: 10, name: 'Animals', icon: '🐕', component: 'CreateAnimalPost' },
  { id: 11, name: 'Furniture & Home Decor', icon: '🛋️', component: 'FasionNBeauty' },
  { id: 12, name: 'Fashion & Beauty', icon: '👗', component: 'FasionNBeauty' },
  { id: 13, name: 'Books, Sports & Hobbies', icon: '📚', component: 'CreateBooksPost' },
  { id: 14, name: 'Kids', icon: '👶', component: 'CreateKidsPost' },
  { id: 15, name: 'Others', icon: '🗂️', component: 'OthersPosting' },
];


const VEHICLE_TYPE_OPTIONS = {
  'Tractors&Trailers': ['Tractor', 'Trailer', 'Other'],
  'Rikshaw&Chingchi': ['Rikshaw', 'Chingchi', 'Other'],
  'Car Care': ['Air Fresher','Cleaners','Compound Polishes','Covers','Microfiber Clothes','Polishes','Presure Washers','Shampoos','waxes','Others'],
  'Car Accessories': ['Tools&Gadget','Safety&Security','Interior','Exterior','Audio&Multimedia','Others'],
  'Spare Parts': ['Engines','Fenders','Filters','Front Grills','Fuel Pump','Gasket&seals','Horns','Ignition Coil','Ignition Switchers','Insulation Sheets','Lights','Mirrors','Oxygen Sensors','Power Stearings','Radiators&Coolants','Spark Plugs','Sun Visor','Suspension Parts','Trunk Parts','Tyres','Windscreens','Wipers','Ac&Heating','Antennas','Batteries','Belt & Cables','Bonnets','Brakes','Bumpers','Bushing','Buttons','Catalytic Converters','Door & Components','Engine Shields'],
  'Oil & Lubricant': ['Chain Lubes And Cleaners','Brake Oil','CUTE Oil','Engine Oil' ,'Fuel Additives','Gear Oil ','Multipurpose Grease' ,'Oil additives','Coolants'],
  'Other Vehicles': []
};

// Car Care specific types
const CAR_CARE_TYPES = {
  'Air Fresher': ['Gel Air Freshener', 'Hanging Air Freshener', 'Spray Air Freshener'],
  'Cleaners': ['Interior Cleaner', 'Exterior Cleaner', 'Glass Cleaner', 'Wheel Cleaner', 'Engine Cleaner'],
  'Compound Polishes': ['Polish Compound', 'Rubbing Compound'],
  'Covers': ['Microfiber Cover', 'Parachute Cover'],
  'Microfiber Clothes': ['Applicator Pad', 'Microfiber Towel'],
  'Shampoos': ['Ceramic Shampu', 'Snow Foam Shampu','Wash&Wax Shampu'],
  'waxes': ['Liquid Wax', 'Paste Wax', 'Spray Wax'],
  'Others': ['Other']
};

// Car Accessories specific types
const CAR_ACCESSORIES_TYPES = {
  'Tools&Gadget': ['Car Vacuum', 'Tire Pressure Gauge', 'Jump Starter', 'Car Charger', 'Other'],
  'Safety&Security': ['Locks', 'Parking Sensor', 'Security Alarm', 'Other'],
  'Interior': ['Seat Covers', 'Steering Wheel Cover', 'Floor Mats', 'Dash Covers', 'Other'],
  'Exterior': ['Car Covers', 'Mud Flaps', 'Hood Protectors', 'Window Visors', 'Other'],
  'Audio&Multimedia': ['Car Stereo', 'Speakers', 'Subwoofers', 'Amplifiers', 'Other'],
  'Others': ['Other']
};
const SPARE_PARTS_TYPES = {
  'Bumpers': ['Front Bumper', 'Rear Bumper', 'Bumper Styling', 'Bumper Parts', 'Brackets/Mounts', 'Other'],
  'Brakes': ['Brake Discs', 'Drum Brake Shoe', 'Front Brake Pads', 'Rear Brake Pads', 'Brake Pads & Shoe', 'Other'],
  'Batteries': ['Acid Batteries', 'Dry Batteries', 'Other'],
  'Wipers': ['Frame Wiper', 'Silicone Wiper', 'Other'],
  'Tyres': ['Rims', 'Tyre Valve Caps', 'Tyres', 'Wheel Covers', 'Other'],
  'Mirrors': ['Blind Spot Mirrors', 'Rearview Mirrors', 'Side Mirrors', 'Other'],
  'Lights': ['Headlights', 'Tail Lights', 'Fog Lights', 'Indicator Lights', 'Interior Lights', 'Other'],
  'Filters': ['Air Filter', 'Cabin Filter', 'Oil Filter', 'Other'],
  'Fenders': ['Front Fenders', 'Rear Fenders', 'Fender Liners', 'Other'],
  // Add more spare parts types as needed
  'Other': ['Other']
};

const MAKES = {
  'Cars': ['Toyota', 'Honda', 'Suzuki', 'Nissan', 'Mitsubishi', 'Kia', 'Hyundai', 'Mercedes', 'BMW', 'Audi', 'Volkswagen', 'Ford', 'Chevrolet', 'Other'],
  'Tractors&Trailers': ['Massey Ferguson', 'New Holland', 'John Deere', 'Other'],
  'Rikshaw&Chingchi': ['Sazgar', 'Road Prince', 'Other'],
  'Car Care': [],
  'Cars On Installments': ['Trailer', 'Other'],
  'Car Accessories': [],
  'Spare Parts': [],
  'Oil & Lubricant': [],
  'Other Vehicles': []
};

const MODELS = {
  'Trailer': ['Corolla', 'Camry', 'Prius', 'Hilux', 'Land Cruiser', 'Other'],
  'Honda': ['Civic', 'Accord', 'City', 'CR-V', 'Other'],
  'Suzuki': ['Mehran', 'Cultus', 'Swift', 'Alto', 'Wagon R', 'Other'],
  'Nissan': ['Sunny', 'March', 'Sentra', 'Other'],
  'Mitsubishi': ['Lancer', 'Pajero', 'Other'],
  'Kia': ['Sportage', 'Picanto', 'Cerato', 'Other'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Other'],
  'Hino': ['Dutro', 'Ranger', 'Other'],
  'Mercedes': ['Sprinter', 'Tourismo', 'Other'],
  'Volvo': ['B7R', 'B9R', 'Other'],
  'Massey Ferguson': ['MF 240', 'MF 260', 'MF 385', 'Other'],
  'New Holland': ['TD5', 'TM120', 'TS6', 'Other'],
  'John Deere': ['5105', '5205', '5310', 'Other'],
  'Sazgar': ['Rikshaw Plus', 'Rikshaw Deluxe', 'Other'],
  'Road Prince': ['RP 100', 'RP 150', 'Other'],
  'Yamaha': ['FX Cruiser', 'GP1800', 'Other'],
  'Other': ['Other']
};

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric', 'LPG', 'Other'];
const INSTALL_PLANS = ['Other'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'Semi-Automatic', 'CVT', 'Other'];
const ASSEMBLY_OPTIONS = ['Local', 'Imported'];
const REGISTERED_OPTIONS = ['Yes', 'No'];
const DOC_TYPES = ['Original', 'Duplicate', 'Other'];
const REGISTRATION_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar',
  'Quetta', 'Multan', 'Faisalabad', 'Hyderabad', 'Other'
];


const VehiclesPosting = ({ selectedSubCat, selectedType }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Vehicles');
  const [subCategory, setSubCategory] = useState(selectedSubCat);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [vehicleType, setVehicleType] = useState(selectedType);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [kmsDriven, setKmsDriven] = useState('');
  const [monthlyInstall, setMonthlyInstall] = useState('');
  const [transmission, setTransmission] = useState('');
  const [assembly, setAssembly] = useState('');
  const [condition, setCondition] = useState('');
  const [registrationCity, setRegistrationCity] = useState('');
  const [location, setLocation] = useState('');
  const [docType, setDocType] = useState('Original');
  const [price, setPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [numberOfOwners, setNumberOfOwners] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [registered, setRegistered] = useState('');
  const [installPlan, setInstallPlan] = useState('');
  const [features, setFeatures] = useState({});
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    contactName: '',
    images: [],
  });
  const [videoFile, setVideoFile] = useState(null);

  // Add video upload handler
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('video')) {
      setVideoFile(file);
    }
  };
  
  // Add video remove handler
  const removeVideo = () => {
    setVideoFile(null);
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPostDetails(prev => ({
      ...prev,
      images: [...prev.images, ...files.slice(0, 14 - prev.images.length)]
    }));
  };

  const removeImage = (index) => {
    setPostDetails(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  // Derived values
  const isCars = useMemo(() => subCategory === 'Cars', [subCategory]);
  const isCarsOnInstallments = useMemo(() => subCategory === 'Cars On Installments', [subCategory]);
  const isBusesVansTrucks = useMemo(() => subCategory === 'Buses,Vans&Trucks', [subCategory]);
  const isRikshawChingchi = useMemo(() => subCategory === 'Rikshaw&Chingchi', [subCategory]);
  const isTractorsTrailers = useMemo(() => subCategory === 'Tractors&Trailers', [subCategory]);
  const isCarCare = useMemo(() => subCategory === 'Car Care', [subCategory]);
  const isCarAccessories = useMemo(() => subCategory === 'Car Accessories', [subCategory]);
  const isSpareParts = useMemo(() => subCategory === 'Spare Parts', [subCategory]);

  // Show model dropdown only after make is selected
  const showModel = useMemo(() => (isCars || isCarsOnInstallments) && make, [isCars, isCarsOnInstallments, make]);
  
  // Show fields after model is selected
  const showFieldsAfterModel = useMemo(() => (isCars || isCarsOnInstallments) && make && model, 
    [isCars, isCarsOnInstallments, make, model]);

  // Determine how to display type options (tabs or dropdown)
  const showTypeAsTabs = useMemo(() => {
    if (!isCarCare && !isCarAccessories && !isSpareParts) return false;
    return [
      'Air Fresher', 'Compound Polishes', 'Covers', 'Microfiber Clothes', 
      'Shampoos', 'Safety&Security', 'Bumpers', 'Brakes', 'Batteries'
    ].includes(vehicleType);
  }, [isCarCare, isCarAccessories, isSpareParts, vehicleType]);
// Event Handlers
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setPostDetails(prev => ({ ...prev, [name]: value }));
};
  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...postDetails,
      category: selectedCategory,
      subCategory,
      vehicleType,
      make,
      model,
      year,
      fuelType,
      kmsDriven,
      transmission,
      assembly,
      condition,
      registrationCity,
      location,
      price,
      docType,
      numberOfOwners,
      features
    };
    console.log('Vehicle post created:', submissionData);
    // Here you would typically send this data to your backend
  };
 // Reusable component functions
 const renderSelectInput = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder, 
  required = true 
}) => (
  <select
    className="form-select"
    value={value}
    onChange={onChange}
    required={required}
    disabled={options.length === 0}
  >
    <option value="" disabled>
      {options.length === 0 ? 'No options available' : placeholder}
    </option>
    {options.map((option, index) => (
      <option key={index} value={option}>{option}</option>
    ))}
  </select>
);
const renderRadioGroup = ({ name, value, options, onChange, required = true }) => (
  <div className="btn-group w-100 gap-2" role="group">
    {options.map((option) => (
      <React.Fragment key={option}>
        <input
          type="radio"
          className="btn-check"
          name={name}
          id={`${name}${option}`}
          value={option}
          checked={value === option}
          onChange={() => onChange(option)}
          required={required}
        />
        <label className="btn btn-outline-secondary" htmlFor={`${name}${option}`}>
          {option}
        </label>
      </React.Fragment>
    ))}
  </div>
);
const renderTextInput = ({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  min, 
  max, 
  prefix, 
  icon,
  required = true 
}) => (
  <div className="input-group">
    {prefix && <span className="input-group-text">{prefix}</span>}
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      value={value}
      min={min}
      max={max}
      onChange={onChange}
      required={required}
    />
    {icon && (
      <span className="input-group-text">
        {icon === 'calendar' ? <FiCalendar /> : null}
      </span>
    )}
  </div>
);
  return (
    <div className="container mt-4 mb-5">
      {/* ... (keep your existing JSX structure until the form) */}

      <form onSubmit={handleSubmit}>
        

        {/* Make - shown for Cars and Cars On Installments */}
        {(isCars || isCarsOnInstallments) && (
          <div className="mb-3 d-flex align-items-center">
            <div className="row w-100">
              <div className="col-4">
                <label className="form-label"><b>Make</b></label>
              </div>
              <div className="col-8 p-0">
                {renderSelectInput({
                  value: make,
                  onChange: (e) => {
                    setMake(e.target.value);
                    setModel('');
                  },
                  options: MAKES[subCategory] || [],
                  placeholder: 'Select Make'
                })}
              </div>
            </div>
          </div>
        )}

        {/* Model - shown after make is selected */}
        {showModel && (
          <div className="mb-3 d-flex align-items-center">
            <div className="row w-100">
              <div className="col-4">
                <label className="form-label"><b>Model</b></label>
              </div>
              <div className="col-8 p-0">
                {renderSelectInput({
                  value: model,
                  onChange: (e) => setModel(e.target.value),
                  options: MODELS[make] || [],
                  placeholder: 'Select Model'
                })}
              </div>
            </div>
          </div>
        )}

        {/* Fields for Cars after model selection */}
        {isCars && showFieldsAfterModel && (
          <>
            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Condition</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderRadioGroup({
                    name: 'condition',
                    value: condition,
                    options: ['New', 'Used'],
                    onChange: setCondition
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Kms Driven</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderTextInput({
                    value: kmsDriven,
                    onChange: (e) => setKmsDriven(e.target.value),
                    placeholder: "Enter kilometers driven",
                    type: 'number',
                    min: 0
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Year</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderTextInput({
                    value: year,
                    onChange: (e) => setYear(e.target.value),
                    placeholder: "Enter year",
                    type: 'number',
                    min: 1900,
                    max: new Date().getFullYear()
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Engine Type</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderSelectInput({
                    value: fuelType,
                    onChange: (e) => setFuelType(e.target.value),
                    options: FUEL_TYPES,
                    placeholder: 'Select Engine Type'
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Transmission</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderSelectInput({
                    value: transmission,
                    onChange: (e) => setTransmission(e.target.value),
                    options: TRANSMISSIONS,
                    placeholder: 'Select Transmission'
                  })}
                </div>
              </div>
            </div>

            <CarFeaturesSelection features={features} setFeatures={setFeatures} />

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Number of Owners</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderTextInput({
                    value: numberOfOwners,
                    onChange: (e) => setNumberOfOwners(e.target.value),
                    placeholder: "Enter number of owners",
                    type: 'number',
                    min: 0
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Car Documents</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderRadioGroup({
                    name: 'docType',
                    value: docType,
                    options: DOC_TYPES,
                    onChange: setDocType
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Assembly</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderRadioGroup({
                    name: 'assembly',
                    value: assembly,
                    options: ASSEMBLY_OPTIONS,
                    onChange: setAssembly
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Fields for Cars On Installments after model selection */}
        {isCarsOnInstallments && showFieldsAfterModel && (
          <>
            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Year</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderTextInput({
                    value: year,
                    onChange: (e) => setYear(e.target.value),
                    placeholder: "Enter year",
                    type: 'number',
                    min: 1900,
                    max: new Date().getFullYear()
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Condition</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderRadioGroup({
                    name: 'condition',
                    value: condition,
                    options: ['New', 'Used'],
                    onChange: setCondition
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Transmission</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderSelectInput({
                    value: transmission,
                    onChange: (e) => setTransmission(e.target.value),
                    options: TRANSMISSIONS,
                    placeholder: 'Select Transmission'
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Registered</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderRadioGroup({
                    name: 'registered',
                    value: registered,
                    options: REGISTERED_OPTIONS,
                    onChange: setRegistered
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Monthly Installment</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderTextInput({
                    value: monthlyInstall,
                    onChange: (e) => setMonthlyInstall(e.target.value),
                    placeholder: "Enter monthly installment",
                    type: 'number',
                    min: 0,
                    prefix: 'Rs'
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Installment Plan</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderSelectInput({
                    value: installPlan,
                    onChange: (e) => setInstallPlan(e.target.value),
                    options: INSTALL_PLANS,
                    placeholder: 'Select Installment Plan'
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Engine Type</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderSelectInput({
                    value: fuelType,
                    onChange: (e) => setFuelType(e.target.value),
                    options: FUEL_TYPES,
                    placeholder: 'Select Engine Type'
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Body Type</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderSelectInput({
                    value: features.bodyType || '',
                    onChange: (e) => setFeatures(prev => ({ ...prev, bodyType: e.target.value })),
                    options: ['Sedan', 'Hatchback', 'SUV', 'Crossover', 'Coupe', 'Convertible', 'Wagon', 'Van', 'Other'],
                    placeholder: 'Select Body Type'
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Color</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderSelectInput({
                    value: features.color || '',
                    onChange: (e) => setFeatures(prev => ({ ...prev, color: e.target.value })),
                    options: ['Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Other'],
                    placeholder: 'Select Color'
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Car Documents</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderRadioGroup({
                    name: 'docType',
                    value: docType,
                    options: DOC_TYPES,
                    onChange: setDocType
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Assembly</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderRadioGroup({
                    name: 'assembly',
                    value: assembly,
                    options: ASSEMBLY_OPTIONS,
                    onChange: setAssembly
                  })}
                </div>
              </div>
            </div>

            <CarFeaturesSelection features={features} setFeatures={setFeatures} />

            {/* Down Payment instead of Price */}
            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Down Payment</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderTextInput({
                    value: downPayment,
                    onChange: (e) => setDownPayment(e.target.value),
                    placeholder: "Enter down payment",
                    type: 'number',
                    min: 0,
                    prefix: 'Rs'
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Fields for Buses/Vans&Trucks, Rikshaw&Chingchi, Tractors&Trailers */}
        {(isBusesVansTrucks || isRikshawChingchi || isTractorsTrailers) && (
          <>
            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Year</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderTextInput({
                    value: year,
                    onChange: (e) => setYear(e.target.value),
                    placeholder: "Enter year",
                    type: 'number',
                    min: 1900,
                    max: new Date().getFullYear()
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Kms Driven</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderTextInput({
                    value: kmsDriven,
                    onChange: (e) => setKmsDriven(e.target.value),
                    placeholder: "Enter kilometers driven",
                    type: 'number',
                    min: 0
                  })}
                </div>
              </div>
            </div>

            <div className="mb-3 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-4">
                  <label className="form-label"><b>Condition</b></label>
                </div>
                <div className="col-8 p-0">
                  {renderRadioGroup({
                    name: 'condition',
                    value: condition,
                    options: ['New', 'Used'],
                    onChange: setCondition
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Type selection for Car Care, Car Accessories, Spare Parts */}
        {(isCarCare || isCarAccessories || isSpareParts) && vehicleType && (
          <div className="mb-3 d-flex align-items-center">
            <div className="row w-100">
              <div className="col-4">
                <label className="form-label"><b>Type</b></label>
              </div>
              <div className="col-8 p-0">
                {showTypeAsTabs ? (
                  renderRadioGroup({
                    name: 'typeSelection',
                    value: features.type || '',
                    options: 
                      isCarCare ? CAR_CARE_TYPES[vehicleType] || [] :
                      isCarAccessories ? CAR_ACCESSORIES_TYPES[vehicleType] || [] :
                      SPARE_PARTS_TYPES[vehicleType] || [],
                    onChange: (val) => setFeatures(prev => ({ ...prev, type: val }))
                  })
                ) : (
                  renderSelectInput({
                    value: features.type || '',
                    onChange: (e) => setFeatures(prev => ({ ...prev, type: e.target.value })),
                    options: 
                      isCarCare ? CAR_CARE_TYPES[vehicleType] || [] :
                      isCarAccessories ? CAR_ACCESSORIES_TYPES[vehicleType] || [] :
                      SPARE_PARTS_TYPES[vehicleType] || [],
                    placeholder: 'Select Type'
                  })
                )}
              </div>
            </div>
          </div>
        )}
{/* Title - always visible */}
<div className="mb-3 d-flex align-items-center">
          <div className="row w-100">
            <div className="col-4">
              <label className="form-label fw-bold"><b>Title</b></label>
            </div>
            <div className="col-8 p-0">
              <input
                type="text"
                className="form-control"
                placeholder="Enter title"
                name="title"
                value={postDetails.title}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Description - always visible */}
        <div className="mb-3 d-flex align-items-center">
          <div className="row w-100">
            <div className="col-4">
              <label className="form-label fw-bold"><b>Description</b></label>
            </div>
            <div className="col-8 p-0">
              <textarea
                className="form-control"
                rows={5}
                placeholder="Enter description"
                name="description"
                value={postDetails.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>
        {/* Location - always visible */}
        <div className="mb-3 d-flex align-items-center">
          <div className="row w-100">
            <div className="col-4">
              <label className="form-label fw-bold">Location</label>
            </div>
            <div className="col-8 p-0">
              <input
                type="text"
                className="form-control"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Price - shown for all except Cars On Installments */}
        {!isCarsOnInstallments && (
          <div className="mb-3 d-flex align-items-center">
            <div className="row w-100">
              <div className="col-4">
                <label className="form-label"><b>Price</b></label>
              </div>
              <div className="col-8 p-0">
                {renderTextInput({
                  value: price,
                  onChange: (e) => setPrice(e.target.value),
                  placeholder: "Enter price",
                  type: 'number',
                  min: 0,
                  prefix: 'Rs'
                })}
              </div>
            </div>
          </div>
        )}

<div className="mb-4">
                  <div className="row w-100">
                    <div className="col-4"><label className="form-label fw-bold">Upload Images</label></div>
                    <div className="col-8 p-0">
                      <div className="d-flex flex-wrap gap-2">
                        {Array.from({ length: 14 }).map((_, index) => (
                          <div 
                            key={index} 
                            className="border rounded position-relative"
                            style={{
                              width: '60px',
                              height: '60px',
                              backgroundColor: '#f7f7f7'
                            }}
                          >
                            {postDetails.images[index] ? (
                              <>
                                <img
                                  src={URL.createObjectURL(postDetails.images[index])}
                                  alt={`Preview ${index}`}
                                  className="w-100 h-100 object-fit-cover rounded"
                                />
                                <button
                                  type="button"
                                  className="position-absolute top-0 end-0 bg-danger rounded-circle p-0 border-0 d-flex align-items-center justify-content-center"
                                  style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                  onClick={() => removeImage(index)}
                                >
                                  <FiX className="text-white" style={{ fontSize: '10px' }} />
                                </button>
                              </>
                            ) : (
                              <label 
                                htmlFor="image-upload"
                                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer"
                              >
                                <FiPlus className="text-muted mb-1" />
                              </label>
                            )}
                          </div>
                        ))}
                      </div>
                      <input
                        type="file"
                        id="image-upload"
                        className="d-none"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={postDetails.images.length >= 14}
                      />
                    </div>
                  </div>
                </div>

                {/* Video Upload Field */}
                <div className="mb-4">
                  <div className="row w-100">
                    <div className="col-4"> <label className="form-label fw-bold">Upload Video</label></div>
                    <div className="col-8 p-0">
                      <div className="d-flex">
                        <div 
                          className="border rounded position-relative"
                          style={{
                            width: '100%',
                            height: '120px',
                            backgroundColor: '#f7f7f7'
                          }}
                        >
                          {videoFile ? (
                            <>
                              <video
                                src={URL.createObjectURL(videoFile)}
                                className="w-100 h-100 object-fit-cover rounded"
                                controls
                              />
                              <button
                                type="button"
                                className="position-absolute top-0 end-0 bg-danger rounded-circle p-0 border-0 d-flex align-items-center justify-content-center"
                                style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                                onClick={removeVideo}
                              >
                                <FiX className="text-white" style={{ fontSize: '10px' }} />
                              </button>
                            </>
                          ) : (
                            <label 
                              htmlFor="video-upload"
                              className="w-100 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer"
                            >
                              <FiPlus className="text-muted mb-1" />
                              <small className="text-muted text-center" style={{ fontSize: '0.7rem' }}>
                                Add Video
                              </small>
                            </label>
                          )}
                        </div>
                      </div>
                      <input
                        type="file"
                        id="video-upload"
                        className="d-none"
                        accept="video/*"
                        onChange={handleVideoUpload}
                      />
                    </div>
                  </div>
                </div>
                
{/* Contact Name */}
<div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Contact Person</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter contact person's name"
                        name="contactName"
                        value={postDetails.contactName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Number Field */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label">Your Phone Number</label>
                    </div>
                    <div className="col-8 p-0 text-end">
                      848764568998
                    </div>
                  </div>
                </div>

                {/* Show Phone Number Toggle */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-5">
                      <label className="form-label"><b>Show My Phone Number</b></label>
                    </div>
                    <div className="col-7 p-0 text-end d-flex align-items-end justify-content-end">
                      <Switch />
                    </div>
                  </div>
                </div>
        <button type="submit" className="btn btn-warning w-100 fw-bold">
          Post Now
        </button>
      </form>
    </div>
  );
};

export default VehiclesPosting;