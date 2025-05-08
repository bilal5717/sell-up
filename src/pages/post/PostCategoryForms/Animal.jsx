"use client";
import React, { useState } from 'react';
import {  FiX, FiCheck, FiPlus } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import Image from 'next/image';
const CreateAnimalPost = ({selectedSubCat, selectedType}) => {
  // State Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Animals');
  const [selectedAnimalType] = useState(selectedSubCat || 'Select Type');
  const [selectedSubAnimalType] = useState(selectedType || 'Select Sub-Type');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [location, setLocation] = useState('');
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    price: '',
    contactName: '',
    images: [],
  });
  const [videoFile, setVideoFile] = useState(null);

  // Data Constants
  const categories = [
    { id: 1, name: 'Animals', icon: '🐕' },
    { id: 2, name: 'Vehicles', icon: '🚗' },
    { id: 3, name: 'Property', icon: '🏠' },
    { id: 4, name: 'Electronics', icon: '📱' },
  ];

  const animalSubTypes = {
    'Pets': ['Dogs', 'Cats', 'Rabbits', 'Hamsters'],
    'Livestock': ['Cows', 'Goats', 'Sheep', 'Horses'],
    'Birds': ['Parrots', 'Canaries', 'Pigeons'],
    'Others': ['Food & Accessories', 'Pet Services']
  };

  const breedOptions = {
    'Dogs': ['Labrador', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Beagle', 'Other'],
    'Cats': ['Persian', 'Siamese', 'Maine Coon', 'Bengal', 'Ragdoll', 'Other'],
    'Rabbits': ['Dutch', 'Mini Lop', 'Flemish Giant', 'Lionhead', 'Angora', 'Other'],
    'Hamsters': ['Syrian', 'Dwarf Campbell', 'Roborovski', 'Chinese', 'Winter White', 'Other'],
    'Cows': ['Holstein', 'Jersey', 'Angus', 'Hereford', 'Brahman', 'Other'],
    'Goats': ['Boer', 'Nubian', 'Alpine', 'Saanen', 'LaMancha', 'Other'],
    'Sheep': ['Merino', 'Dorset', 'Suffolk', 'Hampshire', 'Rambouillet', 'Other'],
    'Horses': ['Arabian', 'Quarter Horse', 'Thoroughbred', 'Appaloosa', 'Paint', 'Other'],
    'Parrots': ['African Grey', 'Macaw', 'Cockatoo', 'Amazon', 'Budgerigar', 'Other'],
    'Canaries': ['Gloster', 'Norwich', 'Border', 'Yorkshire', 'Roller', 'Other'],
    'Pigeons': ['Racing Homer', 'Fantail', 'Tumbler', 'King', 'Modena', 'Other']
  };

  const genderOptions = ['Male', 'Female'];
  const showAnimalDetailsFields = selectedAnimalType !== 'Others' && 
                                selectedAnimalType !== 'Select Type' && 
                                animalSubTypes[selectedAnimalType];

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
    
    // Add all the form fields to formData
    formData.append('title', postDetails.title);
    formData.append('description', postDetails.description);
    formData.append('category', 'Animals');
    formData.append('subCategory', selectedAnimalType);
    formData.append('price', postDetails.price);
    formData.append('location', location);
    formData.append('contactName', postDetails.contactName);
    
    // Animal-specific fields
    formData.append('animalType', selectedAnimalType);
    formData.append('subAnimalType', selectedSubAnimalType);
    formData.append('breed', breed);
    formData.append('gender', gender);
    formData.append('age', age);
    formData.append('isVaccinated', isVaccinated ? '1' : '0');
    
    // Add images
    postDetails.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    
    // Add video if exists
    if (videoFile) {
      formData.append('videoFile', videoFile);
    }
    
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
        console.log('Animal post created successfully:', data);
        // Redirect or show success message
      } else {
        console.error('Error creating animal post:', data);
        // Show error message
      }
    } catch (error) {
      console.error('Network error:', error);
      // Show network error message
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

            <div className="row align-items-around mb-3 p-3">
              <form onSubmit={handleSubmit}>
                {/* Animal Type Selection */}
                

                {/* Animal Details Fields */}
                {showAnimalDetailsFields && selectedSubAnimalType !== 'Select Sub-Type' && (
                  <>
                    {/* Breed Field */}
                    <div className="mb-3 d-flex align-items-center p-0">
                      <div className="row w-100 p-0">
                        <div className="col-4">
                          <label className="form-label"><b>Breed</b></label>
                        </div>
                        <div className="col-8 p-0">
                          <select
                            className="form-select"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            required
                          >
                            <option value="">Select Breed</option>
                            {breedOptions[selectedSubAnimalType]?.map((breedOption, index) => (
                              <option key={index} value={breedOption}>{breedOption}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Gender Field */}
                    <div className="mb-3 d-flex align-items-center">
                      <div className="row w-100">
                        <div className="col-4">
                          <label className="form-label"><b>Gender</b></label>
                        </div>
                        <div className="col-8 p-0 m-0">
                          <div className="d-flex gap-3">
                            {genderOptions.map(option => (
                              <div key={option} className="flex-grow-1">
                                <button
                                  type="button"
                                  className={`btn w-100 ${gender === option 
                                    ? 'btn-warning text-white' 
                                    : 'btn-outline-secondary'}`}
                                  onClick={() => setGender(option)}
                                  style={{
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {option}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Age Field */}
                    <div className="mb-3 d-flex align-items-center">
                      <div className="row w-100">
                        <div className="col-4">
                          <label className="form-label"><b>Age</b></label>
                        </div>
                        <div className="col-8 p-0">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter age (e.g., 2 years)"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vaccinated Field */}
                    <div className="mb-3 d-flex align-items-center">
                      <div className="row w-100">
                        <div className="col-4">
                          <label className="form-label"><b>Vaccinated</b></label>
                        </div>
                        <div className="col-8 p-0">
                          <div className="d-flex align-items-center">
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className={`btn ${!isVaccinated ? 'btn-warning' : 'btn-outline-secondary'}`}
                                onClick={() => setIsVaccinated(false)}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.875rem'
                                }}
                              >
                                No
                              </button>
                              <button
                                type="button"
                                className={`btn ${isVaccinated ? 'btn-warning' : 'btn-outline-secondary'}`}
                                onClick={() => setIsVaccinated(true)}
                                style={{
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.875rem'
                                }}
                              >
                                Yes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
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
      <small className="text-muted d-block text-end">
        Make sure it&apos;s clear and descriptive
      </small>
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
                      <small className="text-muted d-block text-end">Where is the animal located?</small>
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
                                <Image
            src={URL.createObjectURL(postDetails.images[index])}
            alt={`Preview ${index}`}
            width={60}
            height={60}
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
          <li className="mb-2"><FiCheck className="text-warning me-2" /> Be honest about the animal&apos;s condition</li>
          <li className="mb-2"><FiCheck className="text-warning me-2" /> Include vaccination and health details</li>
          <li className="mb-2"><FiCheck className="text-warning me-2" /> Mention any special needs or behaviors</li>
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

export default CreateAnimalPost;