
"use client";
import React, { useState, useRef } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch, FiCalendar } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import axios from 'axios';
const ElectronicsPosting = ({selectedSubCat,selectedType}) => {
  console.log(selectedSubCat);
  // Data Constants
  const categories = [
    { id: 1, name: 'Vehicles', icon: '🚗' },
    { id: 2, name: 'Property', icon: '🏠' },
    { id: 3, name: 'Electronics', icon: '📱' },
    { id: 4, name: 'Furniture', icon: '🛋️' },
    { id: 5, name: 'Jobs', icon: '💼' },
    { id: 6, name: 'Kids', icon: '👶' },
    { id: 7, name: 'Services', icon: '🔧' },
    { id: 8, name: 'Business/Industrial/Agriculture', icon: '🏭' },
  ];

  const optionsData = {
    brands: {
      'Laptops': ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'Other'],
      'Digital Camera': ['Other','camera'],
      'CCTV Camera': ['Other'],
      'Drones': ['Other'],
      'Fans': ['Other','FANS'],
      'Washer': ['Other'],
      'Heaters': ['Other'],
      'Geysers': ['Other'],
      'Solar Panels': ['Other'],
      'Microwaves': ['Other'],
      'Generators': ['Other'],
      'Washer&Dryer': ['Other','new'],
      'Batteries': ['Other'],
      'UPS': ['Other'],
      'Solar Inverters': ['Other'],
      'Ovens': ['Other'],
      'Computer components': ['Intel', 'AMD', 'NVIDIA', 'Corsair', 'Kingston', 'Seagate', 'Western Digital', 'Other']
    },
    subTypeOptions: {
      'Laptops': ['Dell', 'Other'],
      'Networking': ['Modems','Other'],
      'Video Games': ['Other'],
      'Controllers': ['Other'],
      'Air Conditions': ['Other'],
      'Solar Panels': ['Other'],
      'Fans': ['Other','FANS'],
      'Digital Camera': ['Other','camera'],
      'Batteries': ['Other'],
      'Computer components': ['Intel', 'Other'],
      'Gaming console': ['Other']
    },
    models: {
      'Dell': ['XPS', 'Inspiron', 'Latitude', 'Alienware', 'Other'],
      'HP': ['Pavilion', 'Envy', 'Spectre', 'Omen', 'Other'],
      'Lenovo': ['ThinkPad', 'IdeaPad', 'Legion', 'Yoga', 'Other'],
      'Apple': ['MacBook Air', 'MacBook Pro', 'Other'],
      'Intel': ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'Other'],
      'AMD': ['Ryzen 3', 'Ryzen 5', 'Ryzen 7', 'Ryzen 9', 'Other']
    },
    wattage: {
      'Solar Panels': ['1-5 kw' ,'5-10 kw' ,'others'],
      'Generators': [],
      'Solar Inverters': ['1-5 kw' ,'5-10 kw' ,'others'],
    },
    cities: [
      'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar',
      'Quetta', 'Multan', 'Faisalabad', 'Hyderabad', 'Other'
    ]
  };

  // State Management
  const [state, setState] = useState({
    showCategoryModal: false,
    selectedCategory: 'Electronics & Home Appliances',
    subCategory: selectedSubCat,
    showSubCategoryDropdown: false,
    type: selectedType,
    functionType: '',
    brand: '',
    subType: '',
    doors: '',
    no_taps:'2',
    water_dispensers:'',
    model: '',
    wifi:'',
    kilowatt:'',
    condition: '',
    power: '',
    dryerLoad:'',
    warranty: '',
    generatorType: '',
    age: '',
    sub_type:'',
    capacity:'',
    fuelType:'',
    features: '',
    sensor_size:'',
    location: '',
    price: '',
    postDetails: {
      title: '',
      description: '',
      contactName: '',
    },
    images: [],
    videoFile: null,
    name: ''
  });
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    price: '',
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
  const showCondition = ['Laptops', 'Computer components', 'Printers & photocopier', 'Gaming console', 'Digital Camera','Solar Panels'].includes(state.type);
  const showBrand = ['Laptops', 'Computer components', 'Digital Camera', 'CCTV Camera', 'Drones', 'Heaters', 'Geysers','Ovens','Microwaves','Solar Panels','Solar Inverters','Batteries','Generators','UPS','Washer','Spin Dryer','Washer&Dryer'].includes(state.type);
  const showBrandFromSubCat = ['Fans'].includes(state.subCategory);
  const showCapacity = ['Air Conditions'].includes(state.type);
  const showSubTypeOptions = ['Computer components', 'Networking', 'Gaming console', 'Video Games', 'Controllers', 'Digital Camera', 'Air Conditions','Ovens','Solar Panels','Batteries'].includes(state.type);
  const showSubTypeOptionsFromSubCat = ['Fans'].includes(state.subCategory);

  // Helper functions
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateState({ postDetails: { ...state.postDetails, [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // Basic info
    formData.append('category', state.selectedCategory);
    formData.append('subCategory', state.subCategory);
    formData.append('type', state.type || '');
    formData.append('sub_type', state.sub_type || '');
    // Product details
    formData.append('brand', state.brand || '');
    formData.append('model', state.model || '');
    formData.append('condition', state.condition || '');
    formData.append('generatorType', state.generatorType || '');
    formData.append('fuelType', state.fuelType || '');
    formData.append('wifi', state.wifi || '');
    formData.append('wattage', state.wattage || '');
    formData.append('power', state.power || '');
    formData.append('sensor_size', state.sensor_size || '');
    formData.append('dryerLoad', state.dryerLoad || '');
    formData.append('warranty', state.warranty || '');
    formData.append('age', state.age || '');
    formData.append('doors', state.doors || '');
    formData.append('water_dispensers', state.water_dispensers || '');
    formData.append('no_taps', state.no_taps || '');
    formData.append('kilowatt', state.kilowatt || '');
    formData.append('capacity', state.capacity || '');
    /* formData.append('features', JSON.stringify(state.features || [])); */
  
    // Location and pricing
    formData.append('location', state.location || '');
    formData.append('price', state.price || '');
  
    // Post details
    formData.append('title', state.postDetails.title || '');
    formData.append('description', state.postDetails.description || '');
    formData.append('contactName', state.postDetails.contactName || '');
  
    // Media files
    postDetails.images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
  
    if (videoFile) {
      formData.append('videoFile', videoFile);
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      if (response.data.success) {
        alert('Post created successfully!');
      } else {
        alert('Post creation failed.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('An error occurred while submitting the form.');
    }
  };
  

  // Render Components
  const renderCategoryModal = () => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select Category</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => updateState({ showCategoryModal: false })}
            />
          </div>
          <div className="modal-body">
            <div className="row g-3">
              {categories.map(category => (
                <div key={category.id} className="col-6">
                  <div 
                    className={`p-3 border rounded text-center cursor-pointer ${
                      state.selectedCategory === category.name ? 'border-warning bg-light' : ''
                    }`}
                    onClick={() => {
                      updateState({ 
                        selectedCategory: category.name,
                        showCategoryModal: false
                      });
                    }}
                  >
                    <div className="fs-3 mb-2">{category.icon}</div>
                    <div className="fw-medium">{category.name}</div>
                    {state.selectedCategory === category.name && (
                      <FiCheck className="text-warning mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const renderFormField = ({ type = 'text', label, name, value, onChange, options, required = true, placeholder, additionalText, radioOptions, colWidth = 'col-4' }) => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className={colWidth}>
          <label className="form-label"><b>{label}</b></label>
        </div>
        <div className={`${colWidth === 'col-4' ? 'col-8' : 'col-6'} p-0`}>
          {type === 'select' ? (
            <select
              className="form-select"
              value={value}
              onChange={onChange}
              required={required}
            >
              <option value="" disabled>Select {label}</option>
              {options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          ) : type === 'radio' ? (
            <div className="btn-group w-100 gap-2" role="group">
              {radioOptions.map((option) => (
                <React.Fragment key={option.value}>
                  <input
                    type="radio"
                    className="btn-check"
                    name={name}
                    id={`${name}${option.value}`}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange({ target: { value: option.value } })}
                    required={required}
                  />
                  <label className="btn btn-outline-secondary" htmlFor={`${name}${option.value}`}>
                    {option.label}
                  </label>
                </React.Fragment>
              ))}
            </div>
          ) : type === 'textarea' ? (
            <textarea
              className="form-control"
              rows={5}
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
            />
          ) : (
            <input
              type={type}
              className="form-control"
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={onChange}
              required={required}
            />
          )}
          {additionalText && (
            <small className="text-muted d-block text-end">{additionalText}</small>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-8 mx-3">
          <div className="border rounded bg-white">
            {/* Header Row */}
            <div className="row align-items-center mb-3 p-3">
              <div className="col-2">
                <label className="fs-6 bold"><b>Category</b></label>
              </div>
              
              <div className="col-8 text-center">
                <div className="d-flex align-items-center justify-content-center gap-2 cursor-pointer">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                    style={{ width: '30px', height: '30px' }}>
                    {categories.find(c => c.name === state.selectedCategory)?.icon || '📱'}
                  </div>
                  <span className="fw-medium">{state.selectedCategory}</span>
                </div>
              </div>
              
              <div className="col-2">
                <button 
                  type="button" 
                  className="btn btn-link text-decoration-none p-0"
                  onClick={() => updateState({ showCategoryModal: true })}
                >
                  <span>Change</span>
                </button>
              </div>
            </div>
            <hr />

            <div className="row align-items-around mb-3 p-3">
              <form onSubmit={handleSubmit}>
               
                {/* Brand Field */}
                {(showBrand || showBrandFromSubCat) && renderFormField({
                  type: 'select',
                  label: 'Brand',
                  value: state.brand,
                  onChange: (e) => updateState({ 
                    brand: e.target.value,
                    model: ''
                  }),
                  options: showBrand 
                    ? optionsData.brands[state.type] 
                    : optionsData.brands[state.type],
                  colWidth: 'col-4'
                })}

                {/* Sub Type Field */}
                {(showSubTypeOptions || showSubTypeOptionsFromSubCat) && renderFormField({
                  type: 'select',
                  label: 'Type',
                  value: state.sub_type,
                  onChange: (e) => updateState({ sub_type: e.target.value }),
                  options: optionsData.subTypeOptions[state.type],
                  colWidth: 'col-4'
                })}

               
{/* Refrigerators num of doors Field */}
{(state.type === 'Refigerators' || state.type === 'Freezers') && renderFormField({
                  type: 'radio',
                  label: 'Number of Doors',
                  name: 'freezerDoors',
                  value: state.doors,
                  onChange: (e) => updateState({ doors: e.target.value }),
                  radioOptions: [
                    { value: '1', label: '1' },
                    { value: '2 or more', label: '2 or more' },
                  ],
                  colWidth: 'col-4'
                })}
                {/* Digital Camera sensor Field */}
                {state.type === 'Digital Camera' && renderFormField({
                  type: 'radio',
                  label: 'Sensor Size',
                  name: 'sensorSize',
                  value: state.sensor_size,
                  onChange: (e) => updateState({ sensor_size: e.target.value }),
                  radioOptions: [
                    { value: 'APS-C', label: 'APS-C' },
                    { value: 'Full Frame', label: 'Full Frame' },
                    { value: 'Others', label: 'Others' }
                  ],
                  colWidth: 'col-4'
                })}

                {/* Power source */}
                {(state.type === 'Heaters' || state.type === 'Geysers') && renderFormField({
                  type: 'radio',
                  label: 'Power Source',
                  name: 'power',
                  value: state.power,
                  onChange: (e) => updateState({ power: e.target.value }),
                  radioOptions: [
                    { value: 'Electric', label: 'Electric' },
                    { value: 'gas', label: 'Gas' },
                    { value: 'Dual', label: 'Dual' }
                  ],
                  colWidth: 'col-4'
                })}
 {/* Power source */}
 {state.type === 'Washer&Dryer' && renderFormField({
                  type: 'radio',
                  label: 'Load',
                  name: 'load',
                  value: state.dryerLoad,
                  onChange: (e) => updateState({ dryerLoad: e.target.value }),
                  radioOptions: [
                    { value: 'Top Load', label: 'Top Load' },
                    { value: 'Front Load', label: 'Front Load' },
                  ],
                  colWidth: 'col-4'
                })}



                {/* Function Type Field */}
                {state.type === 'Printers & photocopier' && renderFormField({
                  type: 'text',
                  label: 'Function Type',
                  name: 'functionType',
                  value: state.functionType,
                  onChange: (e) => updateState({ functionType: e.target.value }),
                  placeholder: 'Enter function type',
                  colWidth: 'col-4'
                })}

{/* Function Type Field */}
{state.type === 'Generators' && renderFormField({
                  type: 'text',
                  label: 'Fuel Type',
                  name: 'fuelType',
                  value: state.fuelType,
                  onChange: (e) => updateState({ fuelType: e.target.value }),
                  placeholder: 'Enter function type',
                  colWidth: 'col-4'
                })}

                {/* Capacity Field */}
                {(state.type === 'Air Conditions' || state.type === 'Batteries')&& renderFormField({
                  type: 'text',
                  label: 'Capacity',
                  name: 'capacity',
                  value: state.capacity,
                  onChange: (e) => updateState({ capacity: e.target.value }),
                  placeholder: 'Enter Capacity',
                  colWidth: 'col-4'
                })}

              
                {/* Condition Field */}
                {(showCondition || selectedSubCat) && renderFormField({
                  type: 'radio',
                  label: 'Condition',
                  name: 'condition',
                  value: state.condition,
                  onChange: (e) => updateState({ condition: e.target.value }),
                  radioOptions: [
                    { value: 'New', label: 'New' },
                    { value: 'Used', label: 'Used' }
                  ],
                  colWidth: 'col-4'
                })}
{/* wattage Field */}
{state.type === 'Solar Panels' && renderFormField({
                  type: 'select',
                  label: 'Wattage',
                  value: state.wattage,
                  onChange: (e) => updateState({ wattage: e.target.value }),
                  options: optionsData.wattage[state.type],
                  colWidth: 'col-4'
                })}
    {/* killowat for solar invertor Field */}
{state.type === 'Solar Inverters' && renderFormField({
                  type: 'radio',
                  label: 'Kilowatt',
                  name: 'killowatt',
                  value: state.kilowatt,
                  onChange: (e) => updateState({ kilowatt: e.target.value }),
                  radioOptions: [
                    { value: '1-5kw', label: '1-5kw' },
                    { value: '5-10kw', label: '5-10kw' },
                    { value: 'others', label: 'others' }
                  ],
                  colWidth: 'col-4'
                })}            
{/* wattage for Generators Field */}
{state.type === 'Generators' && renderFormField({
                  type: 'radio',
                  label: 'wattage',
                  name: 'wattage',
                  value: state.wattage,
                  onChange: (e) => updateState({ wattage: e.target.value }),
                  radioOptions: [
                    { value: '1-100kva', label: '1-100kva' },
                    { value: '100kva above', label: '100kva above' },
                  ],
                  colWidth: 'col-4'
                })}
                {/* wattage for Generators Field */}
{state.type === 'UPS' && renderFormField({
                  type: 'radio',
                  label: 'wattage',
                  name: 'wattageups',
                  value: state.wattage,
                  onChange: (e) => updateState({ wattage: e.target.value }),
                  radioOptions: [
                    { value: '500-1000 watts', label: '500-1000 watts' },
                    { value: '1000-15000 watts', label: '1000-15000 watts' },
                    { value: '15000&above', label: '15000&above' }
                  ],
                  colWidth: 'col-4'
                })}
{/* type for washer&dryer source */}
{state.type === 'Washer&Dryer' && renderFormField({
                  type: 'radio',
                  label: 'Type',
                  name: 'washerType',
                  value: state.sub_type,
                  onChange: (e) => updateState({ sub_type: e.target.value }),
                  radioOptions: [
                    { value: 'Fully Automatic', label: 'Fully Automatic' },
                    { value: 'Semi Automatic', label: 'Semi Automatic' }
                  ],
                  colWidth: 'col-4'
                })}
              {state.type === 'Irons' && renderFormField({
                  type: 'radio',
                  label: 'Type',
                  name: 'irons',
                  value: state.sub_type,
                  onChange: (e) => updateState({ sub_type: e.target.value }),
                  radioOptions: [
                    { value: 'Dry Iron', label: 'Dry Iron' },
                    { value: 'Steam Iron', label: 'Steam Iron' }
                  ],
                  colWidth: 'col-4'
                })}

{selectedType === 'Air Purifier & Humidfier' && renderFormField({
                  type: 'radio',
                  label: 'Type',
                  name: 'type',
                  value: state.sub_type,
                  onChange: (e) => updateState({ sub_type: e.target.value }),
                  radioOptions: [
                    { value: 'Air Purifier', label: 'Air Purifier' },
                    { value: 'Dehumidfiers', label: 'Dehumidfiers' },
                    { value: 'Humidfier', label: 'Humidfier' }
                  ],
                  colWidth: 'col-4'
                })}
                {/* type for Geyser invertor source */}
{state.type === 'Geysers' && renderFormField({
                  type: 'radio',
                  label: 'Type',
                  name: 'type',
                  value: state.sub_type,
                  onChange: (e) => updateState({ sub_type: e.target.value }),
                  radioOptions: [
                    { value: 'Instant', label: 'Instant' },
                    { value: 'Conventional Storage', label: 'Conventional Storage' }
                  ],
                  colWidth: 'col-4'
                })}
{/* type for solar invertor source */}
{state.type === 'Solar Inverters' && renderFormField({
                  type: 'radio',
                  label: 'Type',
                  name: 'type',
                  value: state.power,
                  onChange: (e) => updateState({ power: e.target.value }),
                  radioOptions: [
                    { value: 'On Grid Inverter', label: 'On Grid Inverter' },
                    { value: 'Off Grid Inverter', label: 'Off Grid Inverter' },
                    { value: 'Hybrid Inverter', label: 'Hybrid Inverter' }
                  ],
                  colWidth: 'col-4'
                })}
{/* type for solar invertor source */}
{state.type === 'Generators' && renderFormField({
  type: 'radio',
  label: 'Type',
  name: 'generatorType',
  value: state.sub_type,
  onChange: (e) => updateState({ sub_type: e.target.value }),
  radioOptions: [
    { value: 'Portable Generator', label: 'Portable Generator' },
    { value: 'Commercial Generator', label: 'Commercial Generator' },
    { value: 'Others', label: 'Others' }
  ],
  colWidth: 'col-4'
})}


                {/* Wifi Field */}
                {state.type === 'CCTV Camera' && renderFormField({
                  type: 'radio',
                  label: 'Wifi',
                  name: 'wifi',
                  value: state.wifi,
                  onChange: (e) => updateState({ wifi: e.target.value }),
                  radioOptions: [
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ],
                  colWidth: 'col-4'
                })}

{/* Wifi Field */}
{selectedSubCat === 'water dispensers' && renderFormField({
                  type: 'radio',
                  label: 'With Refrigerator',
                  name: 'water dispensers',
                  value: state.water_dispensers,
                  onChange: (e) => updateState({ water_dispensers: e.target.value }),
                  radioOptions: [
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' }
                  ],
                  colWidth: 'col-4'
                })}
{/* Wifi Field */}
{selectedSubCat === 'water dispensers' && renderFormField({
                  type: 'radio',
                  label: 'Number Of Taps',
                  name: 'Taps',
                  value: state.no_taps,
                  onChange: (e) => updateState({ no_taps: e.target.value }),
                  radioOptions: [
                    { value: '2', label: '2' },
                    { value: '3', label: '3' }
                  ],
                  colWidth: 'col-4'
                })}

                {/* Product/Service Title */}
                {renderFormField({
                  type: 'text',
                  label: 'Product Title',
                  name: 'title',
                  value: state.postDetails.title,
                  onChange: handleInputChange,
                  placeholder: 'Enter product title',
                  colWidth: 'col-4'
                })}

                {/* Description */}
                {renderFormField({
                  type: 'textarea',
                  label: 'Description',
                  name: 'description',
                  value: state.postDetails.description,
                  onChange: handleInputChange,
                  placeholder: 'Describe the product in detail',
                  additionalText: 'Include specifications, usage history, and any defects',
                  colWidth: 'col-4'
                })}

                {/* Location */}
                {renderFormField({
                  type: 'select',
                  label: 'Location',
                  value: state.location,
                  onChange: (e) => updateState({ location: e.target.value }),
                  options: optionsData.cities,
                  additionalText: 'Where is this item located?',
                  colWidth: 'col-4'
                })}
                <hr />

                {/* Price */}
                {renderFormField({
                  type: 'number',
                  label: 'Price',
                  name: 'price',
                  value: state.price,
                  onChange: (e) => updateState({ price: e.target.value }),
                  placeholder: 'Enter price',
                  colWidth: 'col-4',
                  additionalText: '',
                  inputGroup: (
                    <div className="input-group">
                      <span className="input-group-text">Rs</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter price"
                        value={state.price}
                        min={0}
                        onChange={(e) => updateState({ price: e.target.value })}
                        required
                      />
                    </div>
                  )
                })}
                <hr />
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
                <hr />
                {/* Contact Name */}
                {renderFormField({
                  type: 'text',
                  label: 'Contact Person',
                  name: 'contactName',
                  value: state.postDetails.contactName,
                  onChange: handleInputChange,
                  placeholder: 'Enter contact person\'s name',
                  colWidth: 'col-4'
                })}

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
          </div>
        </div>

        <div className="col-3 border">
          {/* Sidebar content */}
          <div className="p-3">
            <h5 className="fw-bold mb-3">Posting Tips</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Provide clear specifications (RAM, storage, etc.)</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Include high-quality photos from multiple angles</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Mention any defects or issues</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Be transparent about warranty status</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Specify if original accessories are included</li>
              <li><FiCheck className="text-warning me-2" /> Provide accurate contact information</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Category Selection Modal */}
      {state.showCategoryModal && renderCategoryModal()}
    </div>
  );
};

export default ElectronicsPosting;

