'use client';
import React, { useState } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';

const CreateBooksSportsHobbiesPost = ({ selectedSubCat, selectedType }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Books, Sports & Hobbies');
  const [selectedKidsType, setSelectedKidsType] = useState(selectedSubCat || 'Select Type');
  const [selectedSubKidsType, setSelectedSubKidsType] = useState(selectedType || 'Select Sub-Type');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [language, setLanguage] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    contactName: '',
    images: [],
  });

  const conditionOptions = ['New', 'Used'];
  const languages = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Others'];

  const kidsSubTypes = {
    'Books & Magazines': ['Books', 'Magazines', 'Dictionaries', 'Stationary Items', 'Calculators'],
    'Musical Instruments': ['Guitar', 'Drums', 'Keyboard'],
    'Sports Equipment': ['Cricket Bat', 'Football', 'Tennis Racket'],
    'Gym & Fitness': ['Treadmill', 'Dumbbells', 'Yoga Mat'],
  };

  const categories = [
    { id: 1, name: 'Vehicles', icon: '🚗' },
    { id: 2, name: 'Property', icon: '🏠' },
    { id: 3, name: 'Electronics', icon: '📱' },
    { id: 4, name: 'Furniture', icon: '🛋️' },
    { id: 5, name: 'Books, Sports & Hobbies', icon: '📚' },
    { id: 6, name: 'Kids', icon: '👶' },
    { id: 7, name: 'Services', icon: '🔧' },
  ];

  const showTypeField = ['Musical Instruments', 'Sports Equipment', 'Gym & Fitness'].includes(selectedSubCat) || selectedSubCat === 'Books & Magazines';
  const showConditionField = ['Musical Instruments', 'Sports Equipment', 'Gym & Fitness', 'Books & Magazines'].includes(selectedSubCat);
  const showLanguageField = selectedSubCat === 'Books & Magazines' && (selectedType === 'Books' || selectedType === 'Magazines');
  const showAuthorField = selectedSubCat === 'Books & Magazines' && selectedType === 'Books';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPostDetails((prev) => ({
      ...prev,
      images: [...prev.images, ...files.slice(0, 14 - prev.images.length)],
    }));
  };

  const removeImage = (index) => {
    setPostDetails((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('video')) {
      setVideoFile(file);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append('title', postDetails.title);
    formData.append('description', postDetails.description);
    formData.append('category', selectedCategory);
    formData.append('subCategory', selectedKidsType);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('contactName', postDetails.contactName);
    
    if (showTypeField) formData.append('subType', selectedSubKidsType);
    if (showConditionField) formData.append('condition', condition);
    if (showLanguageField) formData.append('language', language);
    if (showAuthorField) formData.append('author', brand);
    
    postDetails.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    
    if (videoFile) formData.append('videoFile', videoFile);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Post created successfully:', data);
      } else {
        console.error('Error creating post:', data);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

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
                {/* Type Field */}
                {showTypeField && kidsSubTypes[selectedKidsType] && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Type</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <select
                          className="form-select"
                          value={selectedSubKidsType}
                          onChange={(e) => setSelectedSubKidsType(e.target.value)}
                          required
                        >
                          <option value="Select Sub-Type" disabled>Select Sub-Type</option>
                          {kidsSubTypes[selectedKidsType]?.map((type, i) => (
                            <option key={i} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Condition Field */}
                { (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Condition</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <div className="d-flex gap-2">
                          {conditionOptions.map((opt, i) => (
                            <button
                              type="button"
                              key={i}
                              className={`btn ${condition === opt ? 'btn-warning' : 'btn-outline-secondary'}`}
                              onClick={() => setCondition(opt)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                fontSize: '0.875rem'
                              }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Language Field */}
                {showLanguageField && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Language</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <select
                          className="form-select"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Language</option>
                          {languages.map((lang, i) => (
                            <option key={i} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Author Field */}
                {showAuthorField && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Author</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Author Name"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                <hr />

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
                          value={price}
                          min={0}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </div>
                      <small className="text-muted d-block text-end">Set your asking price</small>
                    </div>
                  </div>
                </div>
                <hr />

                {/* Image Upload Section */}
                <div className="mb-4">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold">Upload Images</label>
                    </div>
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
                      <small className="text-muted d-block mt-2">
                        Upload up to 14 images (JPEG, PNG, GIF)
                      </small>
                    </div>
                  </div>
                </div>

                {/* Video Upload Section */}
                <div className="mb-4">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold">Upload Video</label>
                    </div>
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
          </div>
        </div>

        <div className="col-3 border">
          {/* Sidebar content */}
          <div className="p-3">
            <h5 className="fw-bold mb-3">Posting Tips</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Use clear, high-quality photos</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Be honest about the item's condition</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Include all relevant details</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Mention any special features</li>
              <li><FiCheck className="text-warning me-2" /> Provide accurate contact information</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Category Selection Modal */}
      {showCategoryModal && renderCategoryModal()}
    </div>
  );
};

export default CreateBooksSportsHobbiesPost;