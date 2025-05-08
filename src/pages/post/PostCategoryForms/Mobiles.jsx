"use client";
import React, { useState, useMemo } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch, FiCalendar } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import axios from 'axios';

// ====================== CONSTANTS ======================
const CATEGORIES = [
  { id: 1, name: 'Mobiles', icon: '📱' },
  { id: 2, name: 'Property', icon: '🏠' },
  { id: 3, name: 'Electronics', icon: '💻' },
  { id: 4, name: 'Furniture', icon: '🛋️' },
  { id: 5, name: 'Jobs', icon: '💼' },
  { id: 6, name: 'Kids', icon: '👶' },
  { id: 7, name: 'Services', icon: '🔧' },
  { id: 8, name: 'Business/Industrial/Agriculture', icon: '🏭' },
];

const MOBILE_BRANDS = [
  'Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Vivo', 
  'Realme', 'OnePlus', 'Nokia', 'Sony', 'LG', 'Other'
];

const MOBILE_MODELS = {
  'Apple': ['iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11', 'iPhone X', 'Other'],
  'Samsung': ['Galaxy S23', 'Galaxy S22', 'Galaxy S21', 'Galaxy Note 20', 'Galaxy A Series', 'Other'],
  'Huawei': ['P50', 'P40', 'Mate 40', 'Nova Series', 'Other'],
  'Xiaomi': ['Redmi Note 12', 'Redmi Note 11', 'Mi 11', 'Mi 12', 'Other'],
  'Oppo': ['Reno 8', 'Reno 7', 'Find X5', 'A Series', 'Other'],
  'Vivo': ['V25', 'V23', 'Y Series', 'Other'],
  'Realme': ['GT Neo 3', '9 Pro+', '8 Pro', 'C Series', 'Other'],
  'OnePlus': ['11', '10 Pro', '9 Pro', 'Nord Series', 'Other'],
  'Nokia': ['G60', 'X30', 'C Series', 'Other'],
  'Sony': ['Xperia 1 IV', 'Xperia 5 IV', 'Xperia 10 IV', 'Other'],
  'LG': ['Wing', 'Velvet', 'Other'],
  'Other': ['Other']
};

const TABLET_BRANDS = ['Apple', 'Samsung', 'Huawei', 'Lenovo', 'Microsoft', 'Amazon', 'Other'];
const WATCH_BRANDS = ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Fitbit', 'Garmin', 'Other'];

const CHARGING_CABLE_TYPES = ['USB-C', 'Lightning', 'Micro USB', 'USB-A to USB-C', 'USB-A to Lightning', 'Other'];
const CHARGER_TYPES = ['Fast Charger', 'Wireless Charger', 'Car Charger', 'Travel Charger', 'Other'];
const DEVICE_TYPES = ['Tablet', 'Mobile', 'Smart Watch'];
const HEADPHONE_TYPES = ['Wired', 'Wireless'];
const CONDITION_OPTIONS = ['New', 'Used','Open Box','Refurbished'];
const PTA_OPTIONS = ['PTA Approved', 'Non PTA','JV','Factory Lock'];
const POWERBANK_BRANDS = ['Anker', 'Samsung', 'Xiaomi', 'Realme', 'Baseus', 'Mi', 'Other'];
const EARPHONES_BRANDS = ['Apple', 'Samsung', 'Sony', 'JBL', 'Realme', 'Xiaomi', 'Other'];

// ====================== REUSABLE COMPONENTS ======================
const SelectInput = ({ value, onChange, options = [], placeholder, required = true }) => (
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

const RadioGroup = ({ name, value, options, onChange, required = true }) => (
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

const TextInput = ({ value, onChange, placeholder, type = 'text', min, max, prefix, icon, required = true }) => (
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

const CategoryModal = ({ show, onClose, selectedCategory, onSelect }) => (
  <div className="modal fade show" style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Select Category</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            {CATEGORIES.map(category => (
              <div key={category.id} className="col-6">
                <div 
                  className={`p-3 border rounded text-center cursor-pointer ${
                    selectedCategory === category.name ? 'border-warning bg-light' : ''
                  }`}
                  onClick={() => onSelect(category.name)}
                >
                  <div className="fs-3 mb-2">{category.icon}</div>
                  <div className="fw-medium">{category.name}</div>
                  {selectedCategory === category.name && (
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

// ====================== MAIN COMPONENT ======================
const MobilesPosting = ({selectedCat,selectedSubCatOption,selectedAccessory}) => {
  console.log("selectedcategory" ,selectedCat,"selectedsubcat" ,selectedSubCatOption,"accesooryType",selectedAccessory);
  // ====================== STATE MANAGEMENT ======================
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(selectedCat);
  const [subCategory, setSubCategory] = useState(selectedSubCatOption);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('');
  const [ptaStatus, setPtaStatus] = useState('');
  const [storage, setStorage] = useState('');
  const [batteryStatus, setBatteryStatus] = useState('');
  const [accessoryType, setAccessoryType] = useState(selectedAccessory || '');
  const [price, setPrice] = useState('');
  const [storageUnit,setStorageUnit]=useState('GB');
  const [location, setLocation] = useState('');
  const [memory, setMemory] = useState('');
  const [memoryUnit, setMemoryUnit] = useState('GB');
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    contactName: '',
    images: [],
  });
  const [videoFile, setVideoFile] = useState(null);
  const [chargingCableType, setChargingCableType] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [chargerType, setChargerType] = useState('');
  const [headphoneType, setHeadphoneType] = useState('');
  const [showPhoneNumber, setShowPhoneNumber] = useState(true);

  // ====================== DERIVED VALUES ======================
  const isMobilePhones = useMemo(() => subCategory === 'Mobile Phones', [subCategory]);
  const isTablets = useMemo(() => subCategory === 'Tablets', [subCategory]);
  const isAccessories = useMemo(() => subCategory === 'Accessories', [subCategory]);
  const isSmartWatches = useMemo(() => subCategory === 'Smart Watches', [subCategory]);
  
  // Field visibility logic based on requirements
  const showBrandField = useMemo(() => 
    isTablets || isSmartWatches || 
    (isAccessories && ['Power Banks', 'EarPhones'].includes(accessoryType)) ||
    isMobilePhones,
    [isTablets, isSmartWatches, isAccessories, accessoryType, isMobilePhones]
  );

  const showModelField = useMemo(() => 
    isMobilePhones && brand,
    [isMobilePhones, brand]
  );

  const showConditionField = useMemo(() => 
    isMobilePhones ||
    isTablets || 
    isSmartWatches || 
    (isAccessories && [
      'Charging Cables', 'Converters', 'Chargers', 'Mobile Stands', 
      'Ring Lights', 'Selfie Sticks', 'Power Banks', 'Headphones', 
      'EarPhones', 'Covers & Cases', 'External Memory'
    ].includes(accessoryType)),
    [isTablets, isSmartWatches, isAccessories, accessoryType]
  );

  const showPtaField = useMemo(() => isMobilePhones && brand && model, [isMobilePhones, brand, model]);
  const showStorageField = useMemo(() => isMobilePhones && brand && model, [isMobilePhones, brand, model]);
  const showMemoryField = useMemo(() => isMobilePhones && brand && model, [isMobilePhones, brand, model]);
  const showBatteryStatusField = useMemo(() => isMobilePhones && brand && model, [isMobilePhones, brand, model]);
  const showChargingCableTypeField = useMemo(() => isAccessories && accessoryType === 'Charging Cables', [isAccessories, accessoryType]);
  const showDeviceTypeField = useMemo(() => 
    isAccessories && ['Chargers', 'Screens', 'Screen Protector', 'Covers & Cases'].includes(accessoryType), 
    [isAccessories, accessoryType]
  );
  const showChargerTypeField = useMemo(() => isAccessories && accessoryType === 'Chargers', [isAccessories, accessoryType]);
  const showHeadphoneTypeField = useMemo(() => 
    isAccessories && ['Headphones', 'EarPhones'].includes(accessoryType), 
    [isAccessories, accessoryType]
  );
  const showSizeField = useMemo(() => isAccessories && accessoryType === 'Ring Lights', [isAccessories, accessoryType]);
  const showCapacityField = useMemo(() => isAccessories && accessoryType === 'Power Banks', [isAccessories, accessoryType]);

  // ====================== EVENT HANDLERS ======================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.includes('video')) {
        console.error("Invalid file type. Please upload a video.");
        return;
    }

    try {
        const contentType = file.type;
        const fileSize = file.size;

        // Get the pre-signed URL from the server
        const res = await axios.post('http://127.0.0.1:8000/api/generate-video-url', {
            contentType,
            fileSize,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.data.uploadUrl || !res.data.publicUrl) {
            throw new Error('Upload URL not received from server');
        }

        const { uploadUrl, publicUrl } = res.data;

        // Add to state immediately for preview
        const previewUrl = URL.createObjectURL(file);

        setVideoFile({
            file,      // Save the actual file for upload
            preview: previewUrl, // Save the preview URL for displaying
            publicUrl  // Save the final public URL after upload
        });

        // Upload the file using the pre-signed URL
        const uploadRes = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': contentType,
                'x-amz-acl': 'public-read', // Public access
            },
            body: file,
            mode: 'cors', // Handle CORS
        });

        if (!uploadRes.ok) {
            throw new Error(`Upload failed with status ${uploadRes.status} - ${uploadRes.statusText}`);
        }

        console.log('✅ Video uploaded successfully:', publicUrl);
    } catch (err) {
        console.error('❌ Video upload error:', err.message);
        alert(`Failed to upload video. Error: ${err.message}`);
    }
};

  
const removeVideo = () => {
  if (videoFile && videoFile.preview) {
      URL.revokeObjectURL(videoFile.preview);
  }
  setVideoFile(null);
};


const handleImageUpload = async (file) => {
  if (!file) return console.error("No file provided");

  const contentType = file.type;
  const fileSize = file.size;

  try {
      // Get the pre-signed URL from the server
      const res = await axios.post('http://127.0.0.1:8000/api/generate-image-url', {
          contentType,
          fileSize,
      });

      if (!res.data.uploadUrl || !res.data.publicUrl) {
          throw new Error('Upload URL not received from server');
      }

      const { uploadUrl, publicUrl, filename } = res.data;
      // Construct the direct image URL using the R2 bucket public domain
      const directImageUrl = `${publicUrl}`;

      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      // Add to state immediately with preview
      setPostDetails((prev) => ({
          ...prev,
          images: [...prev.images, { preview: previewUrl, publicUrl: directImageUrl, filename }],
      }));
      console.log(previewUrl);
      // Upload the file using the pre-signed URL
      const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
              'Content-Type': contentType,
              'x-amz-acl': 'public-read',
          },
          body: file,
      });

      if (!uploadRes.ok) {
          throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      console.log('✅ Image uploaded successfully:', directImageUrl);
  } catch (err) {
      console.error('❌ Image upload error:', err.message);
      // Remove the failed upload from state
      setPostDetails(prev => ({
          ...prev,
          images: prev.images.filter(img => img.publicUrl !== publicUrl)
      }));
      alert(`Failed to upload image. Error: ${err.message}`);
  }
};

  
  
const removeImage = (index) => {
  setPostDetails(prev => {
      const newImages = [...prev.images];
      const removed = newImages.splice(index, 1);
      // Clean up object URL if it exists
      if (removed[0]?.preview) {
          URL.revokeObjectURL(removed[0].preview);
      }
      return { ...prev, images: newImages };
  });
};

 const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        
        // Append all text/number fields
        formData.append('title', postDetails.title);
        formData.append('description', postDetails.description);
        formData.append('category', selectedCategory);
        formData.append('subCategory', subCategory);
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('condition', condition);
        formData.append('ptaStatus', ptaStatus);
        formData.append('storage', storage ? `${storage} ${storageUnit}` : '');
        formData.append('memory', memory ? `${memory} ${memoryUnit}` : '');
        formData.append('batteryStatus', batteryStatus);
        formData.append('price', price);
        formData.append('isShowPhone', showPhoneNumber);
        formData.append('location', location);
        formData.append('contactName', postDetails.contactName);
        
        // Append accessory-specific fields if applicable
        if (isAccessories) {
            formData.append('accessoryType', accessoryType);
            if (accessoryType === 'Charging Cables') formData.append('chargingCableType', chargingCableType);
            if (['Chargers', 'Screens', 'Screen Protector', 'Covers & Cases'].includes(accessoryType)) 
                formData.append('deviceType', deviceType);
            if (accessoryType === 'Chargers') formData.append('chargerType', chargerType);
            if (['Headphones', 'EarPhones'].includes(accessoryType)) formData.append('headphoneType', headphoneType);
            if (accessoryType === 'Ring Lights') formData.append('size', storage);
            if (accessoryType === 'Power Banks') formData.append('capacity', storage);
        }
        
        // Append image URLs as JSON array
        const imageUrls = postDetails.images.map(img => img.publicUrl);
        formData.append('imageUrls', JSON.stringify(imageUrls));
        
        // Append video if exists
        // Append video if exists
if (videoFile) {
    const videoUrls = [videoFile.publicUrl];
    formData.append('videoUrls', JSON.stringify(videoUrls));
}

        
        // Send the request
        const response = await axios.post('http://127.0.0.1:8000/api/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        // Handle success response
        console.log('Post created successfully:', response.data);
        
    } catch (error) {
        console.error('Error submitting form:', error.response?.data || error.message);
        alert('Failed to create post. Please try again.');
    }
};

  const resetDetails = () => {
    setBrand('');
    setModel('');
    setCondition('');
    setPtaStatus('');
    setStorage('');
    setMemory('');
    setAccessoryType('');
    setChargingCableType('');
    setDeviceType('');
    setChargerType('');
    setHeadphoneType('');
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowCategoryModal(false);
  };

  // ====================== RENDER FUNCTIONS ======================
  const renderBatteryStatusField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>Battery Status (%)</b></label>
        </div>
        <div className="col-8 p-0">
          <TextInput
            value={batteryStatus}
            onChange={(e) => {
              let value = e.target.value;
              if (value > 100) value = 100;
              if (value < 0) value = 0;
              setBatteryStatus(value);
            }}
            placeholder="Enter battery health percentage"
            type="number"
            min={0}
            max={100}
          />
        </div>
      </div>
    </div>
  );

  const renderBrandDropdown = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>Brand</b></label>
        </div>
        <div className="col-8 p-0">
          <SelectInput
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setModel('');
            }}
            options={
              isMobilePhones ? MOBILE_BRANDS : 
              isTablets ? TABLET_BRANDS : 
              isSmartWatches ? WATCH_BRANDS : 
              accessoryType === 'Power Banks' ? POWERBANK_BRANDS :
              accessoryType === 'EarPhones' ? EARPHONES_BRANDS :
              []
            }
            placeholder="Select Brand"
          />
        </div>
      </div>
    </div>
  );

  const renderModelDropdown = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>Model</b></label>
        </div>
        <div className="col-8 p-0">
          <SelectInput
            value={model}
            onChange={(e) => setModel(e.target.value)}
            options={
              isMobilePhones ? MOBILE_MODELS[brand] || [] : 
              []
            }
            placeholder="Select Model"
          />
        </div>
      </div>
    </div>
  );

  const renderConditionField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>Condition</b></label>
        </div>
        <div className="col-8 p-0">
          <RadioGroup
            name="condition"
            value={condition}
            options={CONDITION_OPTIONS}
            onChange={setCondition}
          />
        </div>
      </div>
    </div>
  );

  const renderPtaField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>PTA Status</b></label>
        </div>
        <div className="col-8 p-0">
          <RadioGroup
            name="ptaStatus"
            value={ptaStatus}
            options={PTA_OPTIONS}
            onChange={setPtaStatus}
          />
        </div>
      </div>
    </div>
  );

  const renderStorageField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100 align-items-center">
        <div className="col-4">
          <label className="form-label mb-0"><b>{isAccessories && accessoryType === 'Power Banks' ? 'Capacity' : 'Storage'}</b></label>
        </div>
        <div className="col-8  p-0">
          <div className="input-group">
            <input
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              placeholder={isAccessories && accessoryType === 'Power Banks' ? "Enter capacity (e.g. 10000 mAh)" : "Enter storage"}
              type="number"
              min={0}
              className="form-control"
            />
            {!isAccessories && (
              <select
                className="form-select"
                value={storageUnit}
                onChange={(e) => setStorageUnit(e.target.value)}
                style={{ maxWidth: '100px' }}
              >
                <option value="GB">GB</option>
                <option value="TB">TB</option>
                <option value="TB">MB</option>
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMemoryField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100 align-items-center">
        <div className="col-4">
          <label className="form-label mb-0"><b>RAM</b></label>
        </div>
        <div className="col-8 p-0">
          <div className="input-group">
            <input
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              placeholder="Enter RAM"
              type="number"
              min={0}
              className="form-control"
            />
            <select
              className="form-select"
              value={memoryUnit}
              onChange={(e) => setMemoryUnit(e.target.value)}
              style={{ maxWidth: '100px' }}
            >
              <option value="GB">GB</option>
              <option value="TB">MB</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChargingCableTypeField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>Type</b></label>
        </div>
        <div className="col-8 p-0">
          <SelectInput
            value={chargingCableType}
            onChange={(e) => setChargingCableType(e.target.value)}
            options={CHARGING_CABLE_TYPES}
            placeholder="Select Cable Type"
          />
        </div>
      </div>
    </div>
  );

  const renderDeviceTypeField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>Device Type</b></label>
        </div>
        <div className="col-8 p-0">
          <RadioGroup
            name="deviceType"
            value={deviceType}
            options={DEVICE_TYPES}
            onChange={setDeviceType}
          />
        </div>
      </div>
    </div>
  );

  const renderChargerTypeField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>Type</b></label>
        </div>
        <div className="col-8 p-0">
          <SelectInput
            value={chargerType}
            onChange={(e) => setChargerType(e.target.value)}
            options={CHARGER_TYPES}
            placeholder="Select Charger Type"
          />
        </div>
      </div>
    </div>
  );

  const renderHeadphoneTypeField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>Type</b></label>
        </div>
        <div className="col-8 p-0">
          <RadioGroup
            name="headphoneType"
            value={headphoneType}
            options={HEADPHONE_TYPES}
            onChange={setHeadphoneType}
          />
        </div>
      </div>
    </div>
  );

  const renderSizeField = () => (
    <div className="mb-3 d-flex align-items-center">
      <div className="row w-100">
        <div className="col-4">
          <label className="form-label"><b>Size</b></label>
        </div>
        <div className="col-8 p-0">
          <TextInput
            value={storage}
            onChange={(e) => setStorage(e.target.value)}
            placeholder="Enter size (e.g. 12 inches)"
          />
        </div>
      </div>
    </div>
  );

  // ====================== MAIN RENDER ======================
  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        {/* Main Form Column */}
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
                    {CATEGORIES.find(c => c.name === selectedCategory)?.icon || '📱'}
                  </div>
                  <span className="fw-medium">{selectedCategory}</span>
                </div>
              </div>
              
              <div className="col-2">
                <button 
                  type="button" 
                  className="btn btn-link text-decoration-none p-0"
                  onClick={() => setShowCategoryModal(true)}
                  aria-label="Change category"
                >
                  <span>Change</span>
                </button>
              </div>
            </div>
            <hr />

            {/* Main Form Content */}
            <div className="row align-items-around mb-3 p-3">
              <form onSubmit={handleSubmit}>
                {/* Dynamic Fields Based on Selection */}
                {showBrandField && renderBrandDropdown()}
                {showModelField && renderModelDropdown()}
                {showChargingCableTypeField && renderChargingCableTypeField()}
                {showDeviceTypeField && renderDeviceTypeField()}
                {showChargerTypeField && renderChargerTypeField()}
                {showHeadphoneTypeField && renderHeadphoneTypeField()}
                {showSizeField && renderSizeField()}
                {showConditionField && renderConditionField()}
                {showPtaField && renderPtaField()}
                {showStorageField && renderStorageField()}
                {showMemoryField && renderMemoryField()}
                {showBatteryStatusField && renderBatteryStatusField()}
                <hr />
                <br />

                {/* Product/Service Title */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold">Product/Service Title</label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter product or service title"
                        name="title"
                        value={postDetails.title}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted d-block text-end">
                        {isMobilePhones ? 
                          `Be specific (e.g. "${brand} ${model} ${storage}GB")` : 
                          isTablets ?
                          `Be specific (e.g. "${brand} Tablet")` :
                          isSmartWatches ?
                          `Be specific (e.g. "${brand} Smart Watch")` :
                          isAccessories ?
                          `Be specific (e.g. "${accessoryType} for ${brand} ${model || deviceType || ''}")` :
                          'Be specific with your title'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold">Description</label>
                    </div>
                    <div className="col-8 p-0">
                      <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Describe the product or service in detail"
                        name="description"
                        value={postDetails.description}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted d-block text-end">
                        {isMobilePhones ? 
                          "Include key features, condition details, and any accessories included" : 
                          isTablets ?
                          "Describe the tablet's condition, features, and any included accessories" :
                          isSmartWatches ?
                          "Mention the watch condition, features, and compatibility" :
                          isAccessories ?
                          "Describe the accessory, its condition, and compatibility" :
                          "Include all relevant details about your item"}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Location */}
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
                      <small className="text-muted d-block text-end">Where is this item located?</small>
                    </div>
                  </div>
                </div>
                <hr />
                <br />

                {/* Price */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Price</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <TextInput
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                        type="number"
                        min={0}
                        prefix="Rs"
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <br />

                <div className="mb-4">
  <div className="row w-100">
    <div className="col-4">
      <label className="form-label fw-bold">Upload Images</label>
    </div>
    <div className="col-8 p-0">
      <div className="d-flex flex-wrap gap-2">
        {/* Display uploaded images */}
        {postDetails.images.map((image, index) => (
          <div key={index} className="border rounded position-relative"
            style={{ width: '60px', height: '60px', backgroundColor: '#f7f7f7' }}>
            <img
              src={image.preview || image.publicUrl}
              alt={`Preview ${index}`}
              className="w-100 h-100 object-fit-cover rounded"
              onLoad={() => {
                if (image.preview) {
                  URL.revokeObjectURL(image.preview);
                }
              }}
            />
            <button
              type="button"
              className="position-absolute top-0 end-0 bg-danger rounded-circle p-0 border-0"
              style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
              onClick={() => removeImage(index)}
            >
              <FiX className="text-white" style={{ fontSize: '10px' }} />
            </button>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, 14 - postDetails.images.length) }).map((_, index) => (
          <div key={`empty-${index}`} className="border rounded position-relative"
            style={{ width: '60px', height: '60px', backgroundColor: '#f7f7f7' }}>
            <label htmlFor="image-upload" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer">
              <FiPlus className="text-muted mb-1" />
            </label>
          </div>
        ))}
      </div>

      {/* File input (hidden) */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        className="d-none"
        onChange={(e) => {
          const files = Array.from(e.target.files);
          files.forEach(file => handleImageUpload(file));
          e.target.value = ''; // reset to allow re-uploading the same file
        }}
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
                          {videoFile && videoFile.preview ? (
    <>
        <video
            src={videoFile.preview}
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

                {/* Contact Information */}
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

                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-5">
                      <label className="form-label"><b>Show My Phone Number</b></label>
                    </div>
                    <div className="col-7 p-0 text-end d-flex align-items-end justify-content-end">
                    <Switch
                      value={showPhoneNumber}
                      onChange={setShowPhoneNumber}
                    />
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

        {/* Sidebar Tips Column */}
        <div className="col-3 border bg-light p-3">
          <h6 className="fw-bold mb-3">Posting Tips</h6>
          <ul className="small ps-3">
            <li>Use clear and high-quality images</li>
            <li>Mention exact model, specs, and condition</li>
            <li>Set a fair and competitive price</li>
            <li>Write a detailed and honest description</li>
            <li>Avoid misleading or false information</li>
          </ul>
          <div className="mt-4">
            <h6 className="fw-bold">Need Help?</h6>
            <p className="small">Reach us at <a href="mailto:info@sellup.pk">info@sellup.pk</a></p>
          </div>
        </div>
      </div>

      {/* Category Selection Modal */}
      <CategoryModal 
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
      />
    </div>
  );
};

export default MobilesPosting;
