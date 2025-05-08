"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { FiEdit, FiX, FiCheck, FiPlus } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';

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

const ImageUploader = React.memo(({ images, onImageUpload, onRemoveImage }) => {
  return (
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
                {images[index] ? (
                  <>
                    <img
                      src={URL.createObjectURL(images[index])}
                      alt={`Preview ${index}`}
                      className="w-100 h-100 object-fit-cover rounded"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="position-absolute top-0 end-0 bg-danger rounded-circle p-0 border-0 d-flex align-items-center justify-content-center"
                      style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                      onClick={() => onRemoveImage(index)}
                      aria-label={`Remove image ${index + 1}`}
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
            onChange={onImageUpload}
            disabled={images.length >= 14}
          />
        </div>
      </div>
    </div>
  );
});

const VideoUploader = React.memo(({ videoFile, onVideoUpload, onRemoveVideo }) => {
  return (
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
                    preload="metadata"
                  />
                  <button
                    type="button"
                    className="position-absolute top-0 end-0 bg-danger rounded-circle p-0 border-0 d-flex align-items-center justify-content-center"
                    style={{ width: '20px', height: '20px', transform: 'translate(30%, -30%)' }}
                    onClick={onRemoveVideo}
                    aria-label="Remove video"
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
            onChange={onVideoUpload}
          />
        </div>
      </div>
    </div>
  );
});

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

  const [media, setMedia] = useState({
    images: [],
    videoFile: null
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

  // Handlers
  const handleVideoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file?.type.includes('video')) {
      setMedia(prev => ({ ...prev, videoFile: file }));
    }
  }, []);

  const removeVideo = useCallback(() => {
    setMedia(prev => ({ ...prev, videoFile: null }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    setMedia(prev => ({
      ...prev,
      images: [...prev.images, ...files.slice(0, 14 - prev.images.length)]
    }));
  }, []);

  const removeImage = useCallback((index) => {
    setMedia(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    updateState({ 
      postDetails: { 
        ...state.postDetails, 
        [name]: value 
      } 
    });
  }, [state.postDetails, updateState]);
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData();
        
        // Add all form data
        formData.append('title', state.postDetails.title);
        formData.append('description', state.postDetails.description);
        formData.append('category', state.selectedCategory);
        formData.append('subCategory', state.subCategory);
        formData.append('price', state.price);
        formData.append('location', state.location);
        formData.append('contactName', state.postDetails.contactName);
        
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
        formData.append('handmade', state.handmade); // Use state.handmade
        formData.append('origin', state.origin);
        
        // Add images
        media.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
        
        // Add video if exists
        if (media.videoFile) {
            formData.append('videoFile', media.videoFile);
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
}, [state, media]);
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
                  value={state.postDetails.title}
                  onChange={handleInputChange}
                  placeholder="Enter item title"
                  additionalText="Be specific (e.g. 'Teak Wood Dining Table Set with 6 Chairs')"
                  colWidth="col-4"
                />

                <FormField
                  type="textarea"
                  label="Description"
                  name="description"
                  value={state.postDetails.description}
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

                <ImageUploader 
                  images={media.images} 
                  onImageUpload={handleImageUpload} 
                  onRemoveImage={removeImage} 
                />
                <VideoUploader 
                  videoFile={media.videoFile} 
                  onVideoUpload={handleVideoUpload} 
                  onRemoveVideo={removeVideo} 
                />
                <hr />

                <FormField
                  type="text"
                  label="Contact Person"
                  name="contactName"
                  value={state.postDetails.contactName}
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