"use client";
import React, { useState, useRef } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch, FiCalendar } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import axios from 'axios';
const PropertyPosting = ({selectedSubCat}) => {
  // Data Constants
  const categories = [
    { id: 1, name: 'Mobiles', icon: '📱' },
    { id: 2, name: 'Vehicles', icon: '🚗' },
    { id: 3, name: 'Property for Rent', icon: '🏠' },  // FIX
    { id: 4, name: 'Property for Sale', icon: '🏘️' }, // FIX
    { id: 5, name: 'Electronics & Home Appliances', icon: '💻' },
    { id: 6, name: 'Bikes', icon: '🚲' },
    { id: 7, name: 'Business, Industrial & Agriculture', icon: '🏭' },
    { id: 8, name: 'Services', icon: '🔧' },
    { id: 9, name: 'Jobs', icon: '💼' },
    { id: 10, name: 'Animals', icon: '🐕' },
    { id: 11, name: 'Books, Sports & Hobbies', icon: '📚' },
    { id: 12, name: 'Furniture & Home Decor', icon: '🛋️' },
    { id: 13, name: 'Fashion & Beauty', icon: '👗' },
    { id: 14, name: 'Kids', icon: '👶' },
    { id: 15, name: 'Others', icon: '🗂️' },
  ];
  const optionsData = {
    subTypeOptions: {
        'Shops, Offices & Commercial Spaces': ['Office', 'Shop' ,'warehouse' ,'Factory' ,'Building'],
        'Land & Plots': ['Agriculture Land', 'Commercial Plots' ,'Industrial Plots' ,'Residential Plots'],
      },
  }


  const featureOptions = {
    'Houses': [
      'Student Quarters', 'Drawing Room', 'Dining Room', 
      'Kitchen', 'Study Room', 'Prayer Room', 
      'Powder Room', 'Gym', 'Store Room',
      'Steam Room', 'Sitting Room', 'Laundry Room',
      'Swimming Pool', 'Garden', 'Garage',
      'Servant Quarters', 'Home Theater', 'Others'
    ],
    'Apartments & Flats': [
        'Student Quarters', 'Drawing Room', 'Dining Room', 
        'Kitchen', 'Study Room', 'Prayer Room', 
        'Powder Room', 'Gym', 'Store Room',
        'Steam Room', 'Sitting Room', 'Laundry Room',
        'Swimming Pool', 'Garden', 'Garage',
        'Servant Quarters', 'Home Theater', 'Others'
    ],
    'Portions & Floors': [
      'Student Quarters', 'Drawing Room', 'Dining Room', 
        'Kitchen', 'Study Room', 'Prayer Room', 
        'Powder Room', 'Gym', 'Store Room',
        'Steam Room', 'Sitting Room', 'Laundry Room',
        'Swimming Pool', 'Garden', 'Garage',
        'Servant Quarters', 'Home Theater', 'Others'
    ],
    'Shops, Offices & Commercial Spaces': [
      'Parking Space Available', 'Lobby In Building', 'Double Glazed Window',
      'Central Air Conditioning', 'Central Heating', 'Electricity Backup','Waste Disposal','Elevators',
      'Others'
    ],
    'Vacation Rentals & Guest Houses': [
      'AC', 'Kitchen', 'Laundry',
      'WiFi', 'Parking', 'Swimming Pool',
      'Garden', 'Others'
    ],
    'Land & Plots': [
      'Corner Plot',  'Park Facing','Dispoted','Water Supply','Gas Supply',
      'Electricity', 'Sewerage',
      'Boundary Wall', 'Others'
    ]
  };

  const areaUnits = ['Marla', 'Kanal', 'Square Feet', 'Square Yards', 'Square Meters', 'Acres'];
  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar',
    'Quetta', 'Multan', 'Faisalabad', 'Hyderabad', 'Other'
  ];

  // State Management
  const [state, setState] = useState({
    showCategoryModal: false,
    selectedCategory: 'Property for Rent',
    subCategory: selectedSubCat,
    showSubCategoryDropdown: false,
    bedrooms: '',
    bathrooms: '',
    storeys: '',
    subType:'',
    furnish: '',
    area: '',
    floorlevel:'',
    areaUnit: '',
    otherFeature: '',
    features: [],
    location: '',
    price: '',
    pricePeriod: 'monthly',
    postDetails: {
      title: '',
      description: '',
      contactName: '',
      images: [],
    },
    
    videoFile: null
  });
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
  });
  const [videoFile, setVideoFile] = useState(null);
 const [uploadProgress, setUploadProgress] = useState({
    video: null
  });
  // Add video upload handler
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.includes('video')) {
        console.error("Invalid file type. Please upload a video.");
        return;
    }

    try {
        const contentType = file.type;
        const fileSize = file.size;

        // Reset video progress
        setUploadProgress(prev => ({
          ...prev,
          video: { progress: 0, fileName: file.name }
        }));

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
        const uploadRes = await axios.put(uploadUrl, file, {
            headers: {
                'Content-Type': contentType,
                'x-amz-acl': 'public-read', // Public access
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(prev => ({
                  ...prev,
                  video: { ...prev.video, progress }
                }));
            }
        });

        if (uploadRes.status !== 200) {
            throw new Error(`Upload failed with status ${uploadRes.status}`);
        }

        console.log('✅ Video uploaded successfully:', publicUrl);
    } catch (err) {
        console.error('❌ Video upload error:', err.message);
        alert(`Failed to upload video. Error: ${err.message}`);
        setUploadProgress(prev => ({
          ...prev,
          video: null
        }));
    }
  };
  
  // Add video remove handler
  const removeVideo = () => {
    setVideoFile(null);
  };
  
  const [showOtherFeatureInput, setShowOtherFeatureInput] = useState(false);
  const showSubTypeOptions = ['Shops, Offices & Commercial Spaces','Land & Plots'].includes(state.subCategory);
  // Helper functions
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateState({ postDetails: { ...state.postDetails, [name]: value } });
  };
const ProgressBar = ({ progress, fileName }) => (
  <div className="w-100 mt-1">
    <div className="d-flex justify-content-between small">
      <span>{fileName}</span>
      <span>{progress}%</span>
    </div>
    <div className="progress" style={{ height: '5px' }}>
      <div 
        className="progress-bar bg-success" 
        role="progressbar" 
        style={{ width: `${progress}%` }}
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  </div>
);
const ImageUploadStatus = ({ status }) => {
  if (status === 'uploading') {
    return (
      <div className="position-absolute top-50 start-50 translate-middle">
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (status === 'uploaded') {
    return (
      <div className="position-absolute top-0 end-0 bg-success rounded-circle p-0 border-0 d-flex align-items-center justify-content-center"
        style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}>
        <FiCheck className="text-white" style={{ fontSize: '10px' }} />
      </div>
    );
  }
  return null;
};
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    formData.append('title', state.postDetails.title);
    formData.append('description', state.postDetails.description);
    formData.append('category', state.selectedCategory);
    formData.append('subCategory', state.subCategory);
    formData.append('bedrooms', state.bedrooms);
    formData.append('bathrooms', state.bathrooms);
    formData.append('storeys', state.storeys);
    formData.append('furnish', state.furnish);
    formData.append('area', state.area);
    formData.append('areaUnit', state.areaUnit);
    formData.append('floorlevel', state.floorlevel);
    formData.append('otherFeature', state.otherFeature);
    formData.append('location', state.location);
    formData.append('price', state.price);
    formData.append('pricePeriod', state.pricePeriod);
    formData.append('contactName', state.postDetails.contactName);
    formData.append('user_id', 1); // or get from auth
  
    // ✅ Correctly append features array
    state.features.forEach((feature, index) => {
      formData.append('features[]', feature);
    });
  
     // Append image URLs as JSON array
        const imageUrls = postDetails.images.map(img => img.publicUrl);
        formData.append('imageUrls', JSON.stringify(imageUrls));
        
        // Append video if exists
        if (videoFile) {
            const videoUrls = [videoFile.publicUrl];
            formData.append('videoUrls', JSON.stringify(videoUrls));
        }
  
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Success:', res.data);
      alert('Post Created Successfully!');
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      alert('Failed to submit post');
    }
  };
  const handleImageUpload = async (file) => {
    if (!file) return console.error("No file provided");

    const contentType = file.type;
    const fileSize = file.size;
    const fileName = file.name;

    try {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        // Add to state immediately with preview and status
        setPostDetails(prev => ({
          ...prev,
          images: [...prev.images, { 
            preview: previewUrl, 
            filename: fileName,
            status: 'uploading' // initial status
          }],
        }));

        // Get the pre-signed URL from the server
        const res = await axios.post('http://127.0.0.1:8000/api/generate-image-url', {
            contentType,
            fileSize,
        });

        if (!res.data.uploadUrl || !res.data.publicUrl) {
            throw new Error('Upload URL not received from server');
        }

        const { uploadUrl, publicUrl } = res.data;

        // Upload the file using the pre-signed URL
        await axios.put(uploadUrl, file, {
            headers: {
                'Content-Type': contentType,
                'x-amz-acl': 'public-read',
            }
        });

        // Update state with public URL and mark as uploaded
        setPostDetails(prev => ({
          ...prev,
          images: prev.images.map(img => 
            img.filename === fileName ? 
            { ...img, publicUrl, status: 'uploaded' } : 
            img
          ),
        }));

        console.log('✅ Image uploaded successfully:', publicUrl);
    } catch (err) {
        console.error('❌ Image upload error:', err.message);
        // Remove the failed upload from state
        setPostDetails(prev => ({
          ...prev,
          images: prev.images.filter(img => img.filename !== fileName)
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

 
  const handleFeatureToggle = (feature) => {
    if (feature === 'Others') {
      setShowOtherFeatureInput(!showOtherFeatureInput);
      if (!showOtherFeatureInput) {
        // If showing the input, add "Others" to features
        setState(prev => ({
          ...prev,
          features: [...prev.features.filter(f => f !== 'Others'), 'Others']
        }));
      } else {
        // If hiding the input, remove "Others" and the custom feature
        setState(prev => ({
          ...prev,
          features: prev.features.filter(f => f !== 'Others'),
          otherFeature: ''
        }));
      }
    } else {
      setState(prev => {
        const newFeatures = prev.features.includes(feature)
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature];
        return { ...prev, features: newFeatures };
      });
    }
  };

  const handleOtherFeatureChange = (e) => {
    setState(prev => ({ ...prev, otherFeature: e.target.value }));
  };

  const renderFeaturesSection = () => {
    if (!featureOptions[state.subCategory]) return null;

    return (
      <div className="mb-3 d-flex align-items-center">
        <div className="row w-100">
          <div className="col-4">
            <label className="form-label"><b>Features</b></label>
          </div>
          <div className="col-8 p-0">
            <div className="row">
              {featureOptions[state.subCategory].map((feature, index) => (
                <div className="col-md-4 mb-2" key={index}>
                  <div 
                    className={`p-2 border rounded cursor-pointer text-center ${
                      state.features.includes(feature) ? 'bg-warning text-white' : ''
                    }`}
                    onClick={() => handleFeatureToggle(feature)}
                  >
                    {feature}
                  </div>
                </div>
              ))}
            </div>
            {showOtherFeatureInput && (
              <div className="mt-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Specify other feature"
                  value={state.otherFeature}
                  onChange={handleOtherFeatureChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
                    {categories.find(c => c.name === state.selectedCategory)?.icon || '🏠'}
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
               
 {/* Sub Type Field */}
 {showSubTypeOptions && renderFormField({
                  type: 'select',
                  label: 'Type',
                  value: state.subType,
                  onChange: (e) => updateState({ subType: e.target.value }),
                  options: optionsData.subTypeOptions[state.subCategory],
                  colWidth: 'col-4'
                })}
                {/* Furnished Field */}
                {['Houses', 'Apartments & Flats', 'Portions & Floors','Roommates & Paying Guests','Rooms'].includes(state.subCategory) && renderFormField({
                  type: 'radio',
                  label: 'Furnished',
                  name: 'furnished',
                  value: state.furnish,
                  onChange: (e) => updateState({ furnish: e.target.value }),
                  radioOptions: [
                    { value: 'Furnished', label: 'Furnished' },
                    { value: 'Unfurnished', label: 'Unfurnished' },
                    { value: 'Semi-Furnished', label: 'Semi-Furnished' }
                  ],
                  colWidth: 'col-4'
                })}

                {/* Bedrooms Field */}
                {['Houses', 'Apartments & Flats', 'Portions & Floors', 'Rooms'].includes(state.subCategory) && renderFormField({
                  type: 'number',
                  label: 'Bedrooms',
                  name: 'bedrooms',
                  value: state.bedrooms,
                  onChange: (e) => updateState({ bedrooms: e.target.value }),
                  placeholder: 'Number of bedrooms',
                  colWidth: 'col-4'
                })}

                {/* Bathrooms Field */}
                {['Houses', 'Apartments & Flats', 'Portions & Floors', 'Shops, Offices & Commercial Spaces','Rooms'].includes(state.subCategory) && renderFormField({
                  type: 'number',
                  label: 'Bathrooms',
                  name: 'bathrooms',
                  value: state.bathrooms,
                  onChange: (e) => updateState({ bathrooms: e.target.value }),
                  placeholder: 'Number of bathrooms',
                  colWidth: 'col-4'
                })}

                {/* Storeys Field */}
                {['Houses'].includes(state.subCategory) && renderFormField({
                  type: 'number',
                  label: 'No of Storeys',
                  name: 'storeys',
                  value: state.storeys,
                  onChange: (e) => updateState({ storeys: e.target.value }),
                  placeholder: 'Number of storeys',
                  colWidth: 'col-4'
                })}
{/* Floor level Field */}
{['Apartments & Flats' , 'Portions & Floors','Shops, Offices & Commercial Spaces'].includes(state.subCategory) && renderFormField({
                  type: 'number',
                  label: 'Floor level',
                  name: 'floor',
                  value: state.floorlevel,
                  onChange: (e) => updateState({ floorlevel: e.target.value }),
                  placeholder: 'Floor level',
                  colWidth: 'col-4'
                })}
                {/* Area and Area Unit Fields */}
                {!['Roommates & Paying Guests', 'Rooms'].includes(state.subCategory) && (
                  <>
                    <div className="mb-3 d-flex align-items-center">
                      <div className="row w-100">
                        <div className="col-4">
                          <label className="form-label"><b>Area</b></label>
                        </div>
                        <div className="col-4 pe-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Area size"
                            value={state.area}
                            onChange={(e) => updateState({ area: e.target.value })}
                          />
                        </div>
                        <div className="col-4 ps-0">
                          <select
                            className="form-select"
                            value={state.areaUnit}
                            onChange={(e) => updateState({ areaUnit: e.target.value })}
                          >
                            <option value="">Unit</option>
                            {areaUnits.map((unit, index) => (
                              <option key={index} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Features Section */}
                {renderFeaturesSection()}
{/* Wifi Field */}
{state.subCategory === 'Roommates & Paying Guests' && renderFormField({
                  type: 'radio',
                  label: 'Type',
                  name: 'subtype',
                  value: state.subType,
                  onChange: (e) => updateState({ subType: e.target.value }),
                  radioOptions: [
                    { value: 'Single', label: 'Single' },
                    { value: 'Sharing', label: 'Sharing' }
                  ],
                  colWidth: 'col-4'
                })}
                <hr />

                {/* Title */}
                {renderFormField({
                  type: 'text',
                  label: 'Property Title',
                  name: 'title',
                  value: state.postDetails.title,
                  onChange: handleInputChange,
                  placeholder: 'Enter property title',
                  additionalText: 'Be specific (e.g. "2 Bed Apartment in DHA Phase 5")',
                  colWidth: 'col-4'
                })}

                {/* Description */}
                {renderFormField({
                  type: 'textarea',
                  label: 'Description',
                  name: 'description',
                  value: state.postDetails.description,
                  onChange: handleInputChange,
                  placeholder: 'Describe the property in detail',
                  additionalText: 'Include amenities, nearby facilities, and any special features',
                  colWidth: 'col-4'
                })}

                {/* Location */}
                {renderFormField({
                  type: 'select',
                  label: 'Location',
                  value: state.location,
                  onChange: (e) => updateState({ location: e.target.value }),
                  options: cities,
                  additionalText: 'Where is the property located?',
                  colWidth: 'col-4'
                })}
                <hr />

                {/* Price */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Price</b></label>
                    </div>
                    <div className="col-5 pe-2">
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
                    </div>
                    <div className="col-3 ps-0">
                      <select
                        className="form-select"
                        value={state.pricePeriod}
                        onChange={(e) => updateState({ pricePeriod: e.target.value })}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        {['Land & Plots'].includes(state.subCategory) && (
                          <option value="total">Total</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                <hr />
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
                                           <ImageUploadStatus status={image.status} />
                                           <img
                                             src={image.preview || image.publicUrl}
                                             alt={`Preview ${index}`}
                                             className={`w-100 h-100 object-fit-cover rounded ${image.status === 'uploading' ? 'opacity-50' : ''}`}
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
               
                                       {/* Empty slots for new uploads */}
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
                                      
                                      {/* Show video upload progress */}
                                      {uploadProgress.video && (
                                        <div className="mt-2">
                                          <ProgressBar 
                                            progress={uploadProgress.video.progress} 
                                            fileName={uploadProgress.video.fileName}
                                          />
                                        </div>
                                      )}
                
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
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Include clear photos of all rooms</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Mention nearby landmarks and facilities</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Specify security features</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Be clear about maintenance charges if any</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Mention parking availability</li>
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

export default PropertyPosting;