"use client";
import React, { useState } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';

const CreateFashionBeautyPost = ({selectedSubCat,selectedType}) => {
  // State Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Fashion & Beauty');
  const [selectedFashionType, setSelectedFashionType] = useState(selectedSubCat);
  const [selectedSubFashionType, setSelectedSubFashionType] = useState(selectedType);
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [showFashionTypeDropdown, setShowFashionTypeDropdown] = useState(false);
  const [fashionTypeSearchTerm, setFashionTypeSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [type, setType] = useState('');
  const [fabric, setFabric] = useState('');
  const [language, setLanguage] = useState('');
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
  });
  const [videoFile, setVideoFile] = useState(null);

  // Fabric options for Eastern clothes
  const fabricOptions = [
    'Cotton', 'Silk', 'Linen', 'Chiffon', 'Georgette', 
    'Velvet', 'Denim', 'Wool', 'Polyester', 'Blend', 'Others'
  ];
  const footwearCategory = [
    'Boots', 'Casuals', 'Formals', 'Heels', 'Joggers', 
    'Khussas', 'Kids Shoes', 'Medicated Shoes', 'Sandals', 'Soes Accessory', 'Slippers' ,'Sneakers' ,'Sports Shoes','Others'
  ];
  const bagTypeOptions = [
    'Handbag', 'Backpack', 'Wallet', 'Clutch', 'Shoulder Bag', 'Tote', 'Laptop Bag', 'Other'
  ];
  
  // Type options for Eastern clothes
  const easternTypeOptions = [
    'Kurta', 'Salwar Suit', 'Lehenga', 'Saree', 'Sherwani',
    'Anarkali', 'Palazzo', 'Dhoti', 'Pathani', 'Others'
  ];
  const westernTypeOptions = [
    'Jeans', 'T-shirt', 'Jacket', 'Blazer', 'Dress',
    'Skirt', 'Trousers', 'Shirt', 'Coat', 'Other'
  ];
  const jewelleryTypeOptions = [
    'Necklace', 'Ring', 'Bracelet', 'Earrings', 'Pendant',
    'Bangles', 'Brooch', 'Anklet', 'Set', 'Other'
  ];
  
  const jewelleryMaterialOptions = [
    'Gold', 'Silver', 'Platinum', 'Artificial', 'Diamond', 'Pearl', 'Others'
  ];
  const hairCareProductOptions = [
    'Shampoo', 'Conditioner', 'Hair Oil', 'Hair Serum', 'Hair Color', 
    'Hair Spray', 'Hair Gel', 'Hair Mask', 'Other'
  ];
  const skinCareProductOptions = [
    'Face Wash', 'Moisturizer', 'Cleanser', 'Sunscreen', 'Night Cream',
    'Face Serum', 'Scrub', 'Toner', 'Lip Balm', 'Anti-Aging', 'Other'
  ];
  const watchCategoryOptions = [
    'Analog', 'Digital', 'Smartwatch', 'Chronograph', 'Luxury', 'Fitness Tracker', 'Pocket Watch', 'Other'
  ];
  const fragranceTypeOptions = [
    'Eau de Parfum', 'Eau de Toilette', 'Body Spray', 'Cologne', 'Attar', 'Other'
  ];
  const shouldHideGender = 
  ['Hijabs & Abayas', 'Hair Care', 'Skin Care'].includes(selectedType) ||
  ['Makeup', 'Fragrance'].includes(selectedSubCat);

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
  
  // Data Constants
  const fashionSubTypes = {
    'Eastern': easternTypeOptions,
  };

  const categories = [
    { id: 1, name: 'Vehicles', icon: '🚗' },
    { id: 2, name: 'Property', icon: '🏠' },
    { id: 3, name: 'Electronics', icon: '📱' },
    { id: 4, name: 'Furniture', icon: '🛋️' },
    { id: 5, name: 'Jobs', icon: '💼' },
    { id: 6, name: 'Fashion & Beauty', icon: '👗' },
    { id: 7, name: 'Services', icon: '🔧' },
  ];

  const fashionTypes = ['Eastern'];
  
  const conditionOptions = ['New', 'Used'];
  const genderOptions = ['Male', 'Female', 'Unisex', 'Girl', 'Boy'];

  // Event Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostDetails(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...postDetails,
      category: selectedCategory,
      fashionType: selectedFashionType,
      subFashionType: selectedSubFashionType,
      type,
      fabric,
      brand,
      condition,
      ageRange,
      gender
    };
    console.log('Post submitted:', submissionData);
  };

  // Render Functions
  const renderCategoryModal = () => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select Category</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowCategoryModal(false)}
            />
          </div>
          <div className="modal-body">
            <div className="row g-3">
              {categories.map(category => (
                <div key={category.id} className="col-6">
                  <div 
                    className={`p-3 border rounded text-center cursor-pointer ${
                      selectedCategory === category.name ? 'border-warning bg-light' : ''
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.name);
                      setShowCategoryModal(false);
                    }}
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
                    {categories.find(c => c.name === selectedCategory)?.icon || '📋'}
                  </div>
                  <span className="fw-medium">{selectedCategory}</span>
                </div>
              </div>
              
              <div className="col-2">
                <button 
                  type="button" 
                  className="btn btn-link text-decoration-none p-0"
                  onClick={() => setShowCategoryModal(true)}
                >
                  <span>Change</span>
                </button>
              </div>
            </div>
            <hr />

            <div className="row align-items-around mb-3 p-3">
              <form onSubmit={handleSubmit}>
               {/* Type Field - Dropdown for Eastern or Western clothes */}
               {(selectedType === 'Eastern' || selectedType === 'Western' || selectedSubCat === 'Bags' || selectedSubCat === 'Jewellery') && (
  <div className="mb-3 d-flex align-items-center">
    <div className="row w-100">
      <div className="col-4">
        <label className="form-label"><b>Type</b></label>
      </div>
      <div className="col-8 position-relative p-0">
        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="" disabled>Select Type</option>
          {(selectedType === 'Eastern'
            ? easternTypeOptions
            : selectedType === 'Western'
            ? westernTypeOptions
            : selectedSubCat === 'Bags'
            ? bagTypeOptions
            : selectedSubCat === 'Jewellery'
            ? jewelleryTypeOptions
            : []
          ).map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
)}

{selectedSubCat === 'Jewellery' && (
  <div className="mb-3 d-flex align-items-center">
    <div className="row w-100">
      <div className="col-4">
        <label className="form-label"><b>Material</b></label>
      </div>
      <div className="col-8 position-relative p-0">
        <select
          className="form-select"
          value={fabric}
          onChange={(e) => setFabric(e.target.value)}
          required
        >
          <option value="" disabled>Select Material</option>
          {jewelleryMaterialOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
)}

 {/* Category Field for Footwear or Watches */}
{(selectedSubCat === 'Footwear' || selectedSubCat === 'Watches') && (
  <div className="mb-3 d-flex align-items-center">
    <div className="row w-100">
      <div className="col-4">
        <label className="form-label"><b>Category</b></label>
      </div>
      <div className="col-8 position-relative p-0">
        <select
          className="form-select"
          value={fabric}
          onChange={(e) => setFabric(e.target.value)}
          required
        >
          <option value="" disabled>Select Category</option>
          {(selectedSubCat === 'Footwear' ? footwearCategory : watchCategoryOptions).map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
)}
{selectedSubCat === 'Fragrance' && (
  <div className="mb-3 d-flex align-items-center">
    <div className="row w-100">
      <div className="col-4">
        <label className="form-label"><b>Category</b></label>
      </div>
      <div className="col-8 p-0">
        <div className="btn-group w-100 gap-2" role="group">
          {['Men', 'Women', 'Unisex'].map((option) => (
            <React.Fragment key={option}>
              <input
                type="radio"
                className="btn-check"
                name="fragranceCategory"
                id={`fragrance-${option}`}
                value={option}
                checked={gender === option}
                onChange={() => setGender(option)}
              />
              <label
                className="btn btn-outline-secondary"
                htmlFor={`fragrance-${option}`}
              >
                {option}
              </label>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
{selectedSubCat === 'Fragrance' && (
  <div className="mb-3 d-flex align-items-center">
    <div className="row w-100">
      <div className="col-4">
        <label className="form-label"><b>Type</b></label>
      </div>
      <div className="col-8 position-relative p-0">
        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="" disabled>Select Type</option>
          {fragranceTypeOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
)}


{(selectedType === 'Hair Care' || selectedType === 'Skin Care') && (
  <div className="mb-3 d-flex align-items-center">
    <div className="row w-100">
      <div className="col-4">
        <label className="form-label"><b>Products</b></label>
      </div>
      <div className="col-8 position-relative p-0">
        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="" disabled>Select Product</option>
          {(selectedType === 'Hair Care'
            ? hairCareProductOptions
            : selectedType === 'Skin Care'
            ? skinCareProductOptions
            : []
          ).map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
)}


                {/* Fabric Field - Dropdown */}
               {selectedType === 'Eastern' &&(
                 <div className="mb-3 d-flex align-items-center">
                 <div className="row w-100">
                   <div className="col-4">
                     <label className="form-label"><b>Fabric</b></label>
                   </div>
                   <div className="col-8 position-relative p-0">
                     <select
                       className="form-select"
                       value={fabric}
                       onChange={(e) => setFabric(e.target.value)}
                       required
                     >
                       <option value="" disabled>Select Fabric</option>
                       {fabricOptions.map((option, index) => (
                         <option key={index} value={option}>{option}</option>
                       ))}
                     </select>
                   </div>
                 </div>
               </div>

               )}
                {/* Gender Field */}
{!shouldHideGender && (
  <div className="mb-3 d-flex align-items-center">
    <div className="row w-100">
      <div className="col-4">
        <label className="form-label"><b>Gender</b></label>
      </div>
      <div className="col-8 p-0">
        <div className="d-flex gap-2 flex-wrap">
          {genderOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              className={`btn ${gender === option ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setGender(option)}
              style={{
                padding: '0.375rem 0.75rem',
                border: '1px solid #dee2e6',
                borderRadius: '0.25rem'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

                {/* Condition Field */}
                <div className="mb-3">
                  <div className="row w-100 align-items-center">
                    <div className="col-4">
                      <label className="form-label"><b>Condition</b></label>
                    </div>
                    <div className="col-8">
                      <div className="d-flex gap-2 flex-wrap">
                        {conditionOptions.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`btn ${condition === option ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setCondition(option)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #dee2e6',
                              borderRadius: '0.25rem'
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <hr />

                {/* Brand Field */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Brand</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter brand name (optional)"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Title Field */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold"><b>Ad Title</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter a descriptive title"
                        name="title"
                        value={postDetails.title}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted d-block text-end">Make sure it's clear and descriptive</small>
                    </div>
                  </div>
                </div>

                {/* Description Field */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold"><b>Description</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Describe what you're offering in detail"
                        name="description"
                        value={postDetails.description}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted d-block text-end">Include details like condition, features, etc.</small>
                    </div>
                  </div>
                </div>

                {/* Location Field */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold">Location</label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                      <small className="text-muted d-block text-end">Where is the item located?</small>
                    </div>
                  </div>
                </div>
                <hr />

                {/* Price Field */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold">Price</label>
                    </div>
                    <div className="col-8 p-0">
                      <div className="input-group">
                        <span className="input-group-text">Rs</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter price"
                          name="price"
                          value={postDetails.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <small className="text-muted d-block text-end">Set your asking price</small>
                    </div>
                  </div>
                </div>
                <hr />

                {/* Image Upload Field */}
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

                {/* Name Field */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Your Name</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                      <label className="form-label"><b>Show My Phone Number In Ads</b></label>
                    </div>
                    <div className="col-7 p-0 text-end border">
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
        </div>
      </div>

      {/* Category Selection Modal */}
      {showCategoryModal && renderCategoryModal()}
    </div>
  );
};

export default CreateFashionBeautyPost;