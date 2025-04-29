"use client";
import React, { useState } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
const CreateAnimalPost = ({selectedSubCat,selectedType}) => {
  // State Management
  console.log(selectedType);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [selectedAnimalType, setSelectedAnimalType] = useState(selectedSubCat);
  const [selectedSubAnimalType, setSelectedSubAnimalType] = useState(selectedType);
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [condition, setCondition] = useState('');
  const [age, setAge] = useState('');
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
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
  
  // Data Constants
  const animalSubTypes = {
    Pets: ['Dogs', 'Cats', 'Rabbits', 'Hamsters'],
    Livestock: ['Cows', 'Goats', 'Sheep', 'Horses'],
    Aquarium: ['Tropical Fish', 'Goldfish', 'Shrimp', 'Snails'],
    Birds: ['Parrots', 'Canaries', 'Pigeons'],
  };
  
  const categories = [
    { id: 1, name: 'Vehicles', icon: '🚗' },
    { id: 2, name: 'Property', icon: '🏠' },
    { id: 3, name: 'Electronics', icon: '📱' },
    { id: 4, name: 'Furniture', icon: '🛋️' },
    { id: 5, name: 'Jobs', icon: '💼' },
    { id: 6, name: 'Services', icon: '🔧' },
  ];



  const genderOptions = ['Male', 'Female'];

  const conditionOptions = ['New', 'Used'];

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
      images: [...prev.images, ...files.slice(0, 5 - prev.images.length)]
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
      animalType: selectedAnimalType,
      subAnimalType: selectedSubAnimalType,
      breed,
      gender,
      age,
      isVaccinated
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
          <div className="border rounded   bg-white">
            {/* Header Row */}
            <div className="row align-items-center mb-3 p-3 ">
              <div className="col-2  ">
                <label className="fs-6 bold"><b>Category</b></label>
              </div>
              
              <div className="col-8 text-center ">
                <div className="d-flex align-items-center justify-content-center gap-2 cursor-pointer">
                  <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                    style={{ width: '30px', height: '30px' }}>
                    {categories.find(c => c.name === selectedCategory)?.icon || '📋'}
                  </div>
                  <span className="fw-medium">{selectedCategory}</span>
                </div>
              </div>
              
              <div className="col-2 ">
                <button 
                  type="button" 
                  className="btn btn-link text-decoration-none p-0"
                  onClick={() => setShowCategoryModal(true)}
                >
                  <span>Change</span>
                </button>
              </div>
            </div>

            <div className="row align-items-around mb-3  p-3 ">
              <form onSubmit={handleSubmit}>
                

                {/* Animal Details Fields */}
                {showAnimalDetailsFields && (
                  <>
                    
<div className="">
  {/* Breed Field */}
{selectedSubAnimalType !== 'Select Sub-Type' && (
                      <div className="mb-3 d-flex align-items-center p-0">
                        <div className="row w-100 p-0">
                          <div className="col-4 ">
                            <label className="form-label"><b>Breed</b></label>
                          </div>
                          <div className="col-8  p-0">
                            <input
                              type="text"
                              className="form-control "
                              placeholder={`Enter ${selectedSubAnimalType} breed`}
                              value={breed}
                              onChange={(e) => setBreed(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Gender Field - Updated to Tab Buttons */}
                    {selectedSubAnimalType !== 'Select Sub-Type' && (
  <div className="mb-3 d-flex align-items-center">
    <div className="row w-100">
      <div className="col-4">
        <label className="form-label"><b>Gender</b></label>
      </div>
      <div className="col-8 p-0 m-0">
        <div className="d-flex gap-3"> {/* Increased gap between buttons */}
          {genderOptions.map(option => (
            <div key={option} className="flex-grow-1"> {/* Each button in its own container */}
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
        <small className="text-muted d-block text-end mt-1">Select the animal's gender</small>
      </div>
    </div>
  </div>
)}


                    {/* Age Field */}
                    {selectedSubAnimalType !== 'Select Sub-Type' && (
                    <div className="mb-3 d-flex align-items-center z-index-0">
                      <div className="row w-100">
                        <div className="col-4">
                          <label className="form-label"><b>Age</b></label>
                        </div>
                        <div className="col-8 p-0">
                          <input
                            type="text"
                            className="form-control "
                            placeholder="Enter age (e.g., 2 years)"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
)}
                    {/* Vaccinated Field - Updated to Styled Toggle */}
                    {selectedSubAnimalType !== 'Select Sub-Type' && (
                    <div className="mb-3 d-flex align-items-center">
                      <div className="row w-100">
                        <div className="col-4">
                          <label className="form-label"><b>Vaccinated</b></label>
                        </div>
                        <div className="col-8 p-0">
                          <div className="d-flex align-items-center ">
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className={`btn ${isVaccinated ? 'btn-outline-secondary' : 'btn-warning'}`}
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
                                className={`btn ${!isVaccinated ? 'btn-outline-secondary' : 'btn-warning'}`}
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
)}
</div>
                  </>
                )}
                
               {/* Gender Field - Updated to Tab Buttons */}
               {selectedSubAnimalType === 'Food&Accessories' &&(
  <div className="mb-3 d-flex align-items-center">
    <div className="row w-100">
      <div className="col-4">
        <label className="form-label"><b>Gender</b></label>
      </div>
      <div className="col-8 p-0 m-0">
        <div className="d-flex gap-3"> {/* Increased gap between buttons */}
          {genderOptions.map(option => (
            <div key={option} className="flex-grow-1"> {/* Each button in its own container */}
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
        <small className="text-muted d-block text-end mt-1">Select the animal's gender</small>
      </div>
    </div>
  </div>
)}
                <hr />
<div className="">
  {/* Title Field */}
<div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold"><b> Ad Title</b></label>
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
                      <small className="text-muted d-block text-end">Where is the animal located?</small>
                    </div>
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
<div className="mb-4">
      
      
      <div className="row w-100">
        <div className="col-4"><label className="form-label fw-bold">Upload Images</label></div> {/* Empty column for alignment */}
        <div className="col-8 p-0">
          <div className="d-flex flex-wrap gap-2">
            {/* Image preview boxes */}
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
          
          {/* Hidden file input */}
          <input
            type="file"
            id="image-upload"
            className="d-none"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={postDetails.images.length >= 5}
          />
        </div>
      </div>
    </div>
    {/* video upload */}
      {/* Video Upload Field */}
      <div className="mb-4">
      
      
      <div className="row w-100">
        <div className="col-4"> <label className="form-label fw-bold">Upload Video</label></div> {/* Empty column for alignment */}
        <div className="col-8 p-0">
          <div className="d-flex">
            {/* Video preview box */}
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
          
          {/* Hidden video input */}
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
    {/* Name Field - Add this after the category section */}
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
     {/* Name Field - Add this after the category section */}
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
{/* show number in ads */}
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

export default CreateAnimalPost;