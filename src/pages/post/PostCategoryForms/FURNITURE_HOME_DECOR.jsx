"use client";
import React, { useState, useCallback } from 'react';
import { FiX, FiCheck, FiPlus } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import axios from 'axios';

// Constants moved outside component to prevent recreation
const CATEGORIES = [
  { id: 1, name: 'Vehicles', icon: '🚗' },
  { id: 2, name: 'Property', icon: '🏠' },
  { id: 3, name: 'Electronics', icon: '📱' },
  { id: 4, name: 'Furniture', icon: '🛋️' },
  { id: 5, name: 'Jobs', icon: '💼' },
  { id: 6, name: 'Kids', icon: '👶' },
  { id: 7, name: 'Services', icon: '🔧' },
  { id: 8, name: 'Business/Industrial/Agriculture', icon: '🏭' },
];

const OPTIONS_DATA = {
  furnitureTypes: {
    'Sofa & Chairs': ['Sofa Set', 'Arm Chair', 'Dining Chair', 'Recliner', 'Rocking Chair', 'Other'],
    'Tables': ['Dining Table', 'Coffee Table', 'Study Table', 'Office Table', 'Other'],
    'Beds': ['Single Bed', 'Double Bed', 'Bunk Bed', 'Sofa Bed', 'Other'],
    'Wardrobes': ['Single Door', 'Double Door', 'Sliding Door', 'Walk-in', 'Other'],
    'Home Decor': ['Mirrors', 'Clocks', 'Paintings', 'Vases', 'Other'],
    'Other Furniture': ['Bookshelves', 'TV Stands', 'Shoe Racks', 'Cabinets', 'Other']
  },
  materials: {
    'Wood': ['Teak', 'Sheesham', 'Mango', 'Pine', 'Other'],
    'Metal': ['Iron', 'Steel', 'Aluminum', 'Other'],
    'Plastic': ['PVC', 'Acrylic', 'Other'],
    'Glass': ['Tempered', 'Frosted', 'Other'],
    'Other': ['Rattan', 'Bamboo', 'Wicker', 'Other']
  },
  conditions: ['New', 'Like New', 'Used - Good', 'Used - Fair', 'Used - Needs Repair'],
  cities: [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar',
    'Quetta', 'Multan', 'Faisalabad', 'Hyderabad', 'Other'
  ],
  mattressTypes: ['Single Bed', 'King Bed', 'Queen Bed'],
  mattressMaterials: ['Foam', 'Spring', 'Coir', 'Latex', 'Hybrid', 'Other'],
  rugOrigins: ['Pakistan', 'Iran', 'Turkey', 'Afghanistan', 'India', 'Other']
};

const FormField = React.memo(({ 
  type = 'text', 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  required = true, 
  placeholder, 
  additionalText, 
  radioOptions, 
  colWidth = 'col-4' 
}) => {
  const inputId = `${name}-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
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
              id={inputId}
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
                    id={`${inputId}-${option.value}`}
                    value={option.value}
                    checked={value === option.value}
                    onChange={() => onChange({ target: { value: option.value } })}
                    required={required}
                  />
                  <label 
                    className="btn btn-outline-secondary" 
                    htmlFor={`${inputId}-${option.value}`}
                  >
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
              id={inputId}
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
              id={inputId}
            />
          )}
          {additionalText && (
            <small className="text-muted d-block text-end">{additionalText}</small>
          )}
        </div>
      </div>
    </div>
  );
});

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

const CategoryModal = React.memo(({ show, selectedCategory, onClose, onSelectCategory }) => {
  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select Category</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
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
                    onClick={() => onSelectCategory(category.name)}
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
});

const PostingTips = React.memo(() => (
  <div className="p-3">
    <h5 className="fw-bold mb-3">Posting Tips</h5>
    <ul className="list-unstyled">
      <li className="mb-2"><FiCheck className="text-warning me-2" /> Provide clear dimensions and material information</li>
      <li className="mb-2"><FiCheck className="text-warning me-2" /> Include high-quality photos from multiple angles</li>
      <li className="mb-2"><FiCheck className="text-warning me-2" /> Mention any scratches, stains or defects</li>
      <li className="mb-2"><FiCheck className="text-warning me-2" /> Be transparent about the item's condition</li>
      <li className="mb-2"><FiCheck className="text-warning me-2" /> Specify if assembly is required</li>
      <li><FiCheck className="text-warning me-2" /> Provide accurate contact information</li>
    </ul>
  </div>
));

const FurniturePosting = ({ selectedSubCat, selectedType }) => {
  // Combined state to reduce re-renders
  const [state, setState] = useState({
    showCategoryModal: false,
    selectedCategory: 'Furniture & Home Decor',
    subCategory: selectedSubCat,
    type: selectedType,
    furnitureType: '',
    material: '',
    dimensions: '',
    color: '',
    condition: '',
    warranty: '',
    folding: '',
    age: '',
    handmade: 'No', 
    length:'',
    width:'',
    features: '',
    location: '',
    price: '',
    postDetails: {
      title: '',
      description: '',
      contactName: '',
    },
  });

  const [postDetails, setPostDetails] = useState({
    images: [],
    title: '',
    description: '',
    contactName: '',
  });

  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    video: null
  });

  // Derived values
  const isRugs = selectedType === 'Rugs';
  const isCarpets = selectedType === 'Carpets';
  const isDoorMats = selectedType === 'DoorMats';
  const isPrayersMats = selectedType === 'Prayer Mats';
  const isOfficeTable = selectedType === 'Office Tables';
  const isOfficeChairs = selectedType === 'Office Chairs';
  const isOfficeSofas = selectedType === 'Office Sofas';
  const isOtherHouseHoldItems = selectedSubCat === 'Other Household items';

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

  const removeVideo = () => {
    setVideoFile(null);
  };

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setPostDetails(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        
        // Add all form data
        formData.append('title', postDetails.title);
        formData.append('description', postDetails.description);
        formData.append('category', state.selectedCategory);
        formData.append('subCategory', state.subCategory);
        formData.append('price', state.price);
        formData.append('location', state.location);
        formData.append('contactName', postDetails.contactName);
        
        // Furniture specific fields
        formData.append('furnitureType', state.furnitureType);
        formData.append('material', state.material);
        formData.append('dimensions', state.dimensions);
        formData.append('color', state.color);
        formData.append('condition', state.condition);
        formData.append('warranty', state.warranty);
        formData.append('folding', state.folding);
        formData.append('age', state.age);
        formData.append('length', state.length);
        formData.append('width', state.width);
        formData.append('handmade', state.handmade);
        formData.append('origin', state.origin);
        
        const imageUrls = postDetails.images.map(img => img.publicUrl);
        formData.append('imageUrls', JSON.stringify(imageUrls));
        
        // Append video if exists
        if (videoFile) {
            const videoUrls = [videoFile.publicUrl];
            formData.append('videoUrls', JSON.stringify(videoUrls));
        }

        const response = await fetch('http://127.0.0.1:8000/api/posts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            alert('Post created successfully!');
        } else {
            throw new Error(data.message || 'Failed to create post');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert(error.message);
    }
  }, [state, postDetails, videoFile]);

  const closeCategoryModal = useCallback(() => {
    updateState({ showCategoryModal: false });
  }, [updateState]);

  const selectCategory = useCallback((category) => {
    updateState({ 
      selectedCategory: category,
      showCategoryModal: false
    });
  }, [updateState]);

  const currentCategory = CATEGORIES.find(c => c.name === state.selectedCategory);

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
                    {currentCategory?.icon || '🛋️'}
                  </div>
                  <span className="fw-medium">{state.selectedCategory}</span>
                </div>
              </div>
              
              <div className="col-2">
                <button 
                  type="button" 
                  className="btn btn-link text-decoration-none p-0"
                  onClick={() => updateState({ showCategoryModal: true })}
                  aria-label="Change category"
                >
                  <span>Change</span>
                </button>
              </div>
            </div>
            <hr />

            <div className="row align-items-around mb-3 p-3">
              <form onSubmit={handleSubmit}>
                {/* Furniture Type Fields - Now properly organized by selectedType */}
                {selectedType === 'Sofas' && (
                  <FormField
                    type="select"
                    label="Furniture Type"
                    value={state.furnitureType}
                    onChange={(e) => updateState({ furnitureType: e.target.value })}
                    options={OPTIONS_DATA.furnitureTypes['Sofa & Chairs']}
                    colWidth="col-4"
                  />
                )}

                {selectedType === 'Beds' && (
                  <>
                    <FormField
                      type="select"
                      label="Type"
                      value={state.furnitureType}
                      onChange={(e) => updateState({ furnitureType: e.target.value })}
                      options={OPTIONS_DATA.furnitureTypes['Beds']}
                      colWidth="col-4"
                    />

                    <FormField
                      type="radio"
                      label="Material"
                      name="material"
                      value={state.material}
                      onChange={(e) => updateState({ material: e.target.value })}
                      radioOptions={[
                        { value: 'Wooden', label: 'Wooden' },
                        { value: 'Iron', label: 'Iron' },
                        { value: 'Other', label: 'Other' }
                      ]}
                      colWidth="col-4"
                    />
                  </>
                )}

                {selectedType === 'Tables' && (
                  <FormField
                    type="select"
                    label="Type"
                    value={state.furnitureType}
                    onChange={(e) => updateState({ furnitureType: e.target.value })}
                    options={OPTIONS_DATA.furnitureTypes['Tables']}
                    colWidth="col-4"
                  />
                )}

                {selectedType === 'Wardrobes' && (
                  <FormField
                    type="select"
                    label="Type"
                    value={state.furnitureType}
                    onChange={(e) => updateState({ furnitureType: e.target.value })}
                    options={OPTIONS_DATA.furnitureTypes['Wardrobes']}
                    colWidth="col-4"
                  />
                )}

                {selectedType === 'Home Decor' && (
                  <FormField
                    type="select"
                    label="Type"
                    value={state.furnitureType}
                    onChange={(e) => updateState({ furnitureType: e.target.value })}
                    options={OPTIONS_DATA.furnitureTypes['Home Decor']}
                    colWidth="col-4"
                  />
                )}

                {selectedType === 'Other Furniture' && (
                  <FormField
                    type="select"
                    label="Type"
                    value={state.furnitureType}
                    onChange={(e) => updateState({ furnitureType: e.target.value })}
                    options={OPTIONS_DATA.furnitureTypes['Other Furniture']}
                    colWidth="col-4"
                  />
                )}

                {(isOfficeTable || isOfficeChairs || isOfficeSofas || isOtherHouseHoldItems) && (
                  <FormField
                    type="select"
                    label="Type"
                    name="furnitureType"
                    value={state.furnitureType}
                    onChange={(e) => updateState({ furnitureType: e.target.value })}
                    options={['Executive Table', 'Computer Table', 'Workstation', 'Other']}
                    colWidth="col-4"
                  />
                )}

                {(isRugs || isCarpets || isDoorMats || isPrayersMats) && (
                  <>
                    <FormField
                      type="radio"
                      label="Handmade"
                      name="handmade"
                      value={state.handmade}
                      onChange={(e) => updateState({ handmade: e.target.value })}
                      radioOptions={[
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' }
                      ]}
                      colWidth="col-4"
                    />

                    <FormField
                      type="number"
                      label="Length (ft)"
                      name="length"
                      value={state.length}
                      onChange={(e) => updateState({ length: e.target.value })}
                      placeholder="Enter length in feet"
                      colWidth="col-4"
                    />

                    <FormField
                      type="number"
                      label="Width (ft)"
                      name="width"
                      value={state.width}
                      onChange={(e) => updateState({ width: e.target.value })}
                      placeholder="Enter width in feet"
                      colWidth="col-4"
                    />

                    <FormField
                      type="select"
                      label="Origin"
                      name="origin"
                      value={state.origin}
                      onChange={(e) => updateState({ origin: e.target.value })}
                      options={OPTIONS_DATA.rugOrigins}
                      colWidth="col-4"
                    />
                  </>
                )}

                {selectedType === 'Mattresses' && (
                  <>
                    <FormField
                      type="radio"
                      label="Type"
                      name="furnitureType"
                      value={state.furnitureType}
                      onChange={(e) => updateState({ furnitureType: e.target.value })}
                      radioOptions={OPTIONS_DATA.mattressTypes.map(type => ({ value: type, label: type }))}
                    />

                    <FormField
                      type="select"
                      label="Material Type"
                      value={state.material}
                      onChange={(e) => updateState({ material: e.target.value })}
                      options={OPTIONS_DATA.mattressMaterials}
                    />

                    <FormField
                      type="radio"
                      label="Folding"
                      name="folding"
                      value={state.folding}
                      onChange={(e) => updateState({ folding: e.target.value })}
                      radioOptions={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                    />
                  </>
                )}
    
                <FormField
                  type="radio"
                  label="Condition"
                  name="condition"
                  value={state.condition}
                  onChange={(e) => updateState({ condition: e.target.value })}
                  radioOptions={[
                    { value: 'New', label: 'New' },
                    { value: 'Used', label: 'Used' }
                  ]}
                  colWidth="col-4"
                />
                <hr />

                <FormField
                  type="text"
                  label="Item Title"
                  name="title"
                  value={postDetails.title}
                  onChange={handleInputChange}
                  placeholder="Enter item title"
                  additionalText="Be specific (e.g. 'Teak Wood Dining Table Set with 6 Chairs')"
                  colWidth="col-4"
                />

                <FormField
                  type="textarea"
                  label="Description"
                  name="description"
                  value={postDetails.description}
                  onChange={handleInputChange}
                  placeholder="Describe the item in detail"
                  additionalText="Include material quality, usage history, and any defects"
                  colWidth="col-4"
                />

                <FormField
                  type="select"
                  label="Location"
                  value={state.location}
                  onChange={(e) => updateState({ location: e.target.value })}
                  options={OPTIONS_DATA.cities}
                  additionalText="Where is this item located?"
                  colWidth="col-4"
                />
                <hr />

                <FormField
                  type="number"
                  label="Price"
                  name="price"
                  value={state.price}
                  onChange={(e) => updateState({ price: e.target.value })}
                  placeholder="Enter price"
                  colWidth="col-4"
                />
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

                <FormField
                  type="text"
                  label="Contact Person"
                  name="contactName"
                  value={postDetails.contactName}
                  onChange={handleInputChange}
                  placeholder="Enter contact person's name"
                  colWidth="col-4"
                />

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
          <PostingTips />
        </div>
      </div>

      <CategoryModal 
        show={state.showCategoryModal} 
        selectedCategory={state.selectedCategory} 
        onClose={closeCategoryModal}
        onSelectCategory={selectCategory}
      />
    </div>
  );
};

export default React.memo(FurniturePosting);