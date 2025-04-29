"use client";
import React, { useState, useRef } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch, FiClock, FiDollarSign, FiMapPin, FiUser, FiPhone } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';

const ServicePostingForm = ({selectedSubCat,selectedType}) => {
  // State Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Home Services');
  const [serviceType, setServiceType] = useState(selectedSubCat);
  const [businessType, setBusinessType] = useState('individual');
  const [businessName, setBusinessName] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('fixed');
  const [availability, setAvailability] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [showServiceTypeDropdown, setShowServiceTypeDropdown] = useState(false);
  const [serviceTypeSearchTerm, setServiceTypeSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [typeforCatering, settypeforCatering] = useState('');
  const [typeforCarPool,settypeforCarPool]=useState('Male');
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    contactName: '',
  });
  const [specialField, setSpecialField] = useState(selectedType);
  const [specialTypeField, setspecialTypeField] = useState('');
  const [images, setImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [name, setName] = useState('');
  
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Data Constants
  const categories = [
    { id: 1, name: 'Services', icon: '🏠' },
    { id: 2, name: 'Professional Services', icon: '💼' },
    { id: 3, name: 'Health & Wellness', icon: '❤️' },
    { id: 4, name: 'Beauty & Personal Care', icon: '💅' },
    { id: 5, name: 'Automotive Services', icon: '🚗' },
    { id: 6, name: 'Cleaning Services', icon: '🧹' },
    { id: 7, name: 'Event Services', icon: '🎉' },
    { id: 8, name: 'IT & Tech Services', icon: '💻' },
  ];

  const serviceTypes = [
    'Architecture & Interior Design',
    'Camera Installation',
    'Car Rental',
    'Car Services',
    'Catering & Restaurent',
    'Construction Services',
    'Consolatancy Services',
    'Domestic Help',
    'Driver & Taxi',
    'Tution & academics',
    'Electronic & Computer Repair',
    'Event Services',
    'Farm & Fresh Food',
    'Health & Beauty',
    'Home & Office Repair',
    'Insurances Services',
    'Movers & Packers',
    'Renting Services',
    'Tailor Services',
    'Travel & Visa',
    'Video & Photography',
    'Web Developement',
    'Other Services'
  ];

  // Special fields for specific service types
  const specialFields = {
    'Domestic Help': ['Maids', 'Babysitters', 'Cooks', 'Nursing Staff', 'Other Domestic Help'],
    'Driver & Taxi': ['Drivers', 'Pick & drop', 'CarPool'],
    'Health & Beauty': ['Beauty &SPA', 'Fitness Trainer', 'Health Services'],
    'Home & Office Repair': ['Plumber', 'Electrician', 'Carpenters', 'Painters', 'AC services', 'Pest Control' ,'Water Tank Cleaning','Deep Cleaning','Geyser Services','Other Repair Services']
  };

  const specialType = {
    'Tution & academics': ['Computer', 'Language Classes', 'Music & dance', 'Tutoring', 'Others',],
    'Electronic & Computer Repair': ['Computer', 'Home appiances', 'Mobile', 'Other Electronics'],
    'Travel & Visa': ['Hajj & Umrah Visa', 'Visit Visas', 'Study Visas', 'Work Visas', 'Business Visas','Family Visit Visas' ,'Others'],
   'Farm & Fresh Food': ['Eggs', 'Milk','Fruit & Vegitables' ,'Honey' , 'Oil & Ghee' , 'Meat','Others'],
  };


  // Check if current service type has special fields
  const hasSpecialField = Object.keys(specialFields).includes(serviceType);
  const hasSpecialTypeField = Object.keys(specialType).includes(serviceType);
  // Derived Values
  const filteredServiceTypes = serviceTypes.filter(option => 
    option.toLowerCase().includes(serviceTypeSearchTerm.toLowerCase())
  );

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
      serviceType,
      businessType,
      businessName,
      price,
      priceType,
      availability,
      experienceLevel,
      location,
      name,
      images,
      video: videoFile,
      ...(hasSpecialField && { specialField })
    };
    console.log('Service posted:', submissionData);
    // Here you would typically send this data to your backend
  };

  // Image and Video Handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 14) {
      alert('You can upload a maximum of 14 images');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('Video file size should be less than 50MB');
      return;
    }
    setVideoFile(file);
  };

  const removeVideo = () => {
    setVideoFile(null);
  };

  const triggerImageInput = () => {
    imageInputRef.current.click();
  };

  const triggerVideoInput = () => {
    videoInputRef.current.click();
  };

  // Render Functions
  const renderCategoryModal = () => (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select Service Category</h5>
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

  const renderServiceTypeDropdown = () => (
    <div className="position-absolute top-100 start-0 end-0 mx-5 bg-white border rounded shadow-sm z-1 mt-1">
      <div className="max-h-200 overflow-auto">
        <div className="p-2 border-bottom">
          <div className="input-group">
            <span className="input-group-text">
              <FiSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search service types..."
              value={serviceTypeSearchTerm}
              onChange={(e) => setServiceTypeSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        {filteredServiceTypes.map((type, index) => (
          <div
            key={index}
            className={`p-2 cursor-pointer ${serviceType === type ? 'bg-light' : ''}`}
            onClick={() => {
              setServiceType(type);
              setShowServiceTypeDropdown(false);
              setServiceTypeSearchTerm('');
              setSpecialField(''); // Reset special field when service type changes
            }}
          >
            {type}
          </div>
        ))}
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
                    {categories.find(c => c.name === selectedCategory)?.icon || '🔧'}
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
              
                {/* Special Field Dropdown (Conditional) */}
                {hasSpecialTypeField && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Type</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <select
                          className="form-select"
                          value={specialTypeField}
                          onChange={(e) => setspecialTypeField(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select {serviceType} Type</option>
                          {specialType[serviceType].map((field, index) => (
                            <option key={index} value={field}>{field}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
 {(serviceType === 'Catering & Restaurent')&& (
                        <div className="mb-3 d-flex align-items-center">
                          <div className="row w-100">
                            <div className="col-4">
                              <label className="form-label"><b>Type</b></label>
                            </div>
                            <div className="col-8 p-0">
                              <div className="d-flex gap-2">
                                <button
                                  type="button"
                                  className={`btn ${typeforCatering === 'Catering' ? 'btn-warning' : 'btn-outline-secondary'}`}
                                  onClick={() => settypeforCatering('Male')}
                                  style={{
                                    flex: 1,
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.25rem'
                                  }}
                                >
                                  Catering
                                </button>
                                <button
                                  type="button"
                                  className={`btn ${typeforCatering === 'Cooked Food' ? 'btn-warning' : 'btn-outline-secondary'}`}
                                  onClick={() => settypeforCatering('Cooked Food')}
                                  style={{
                                    flex: 1,
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.25rem'
                                  }}
                                >
                                  Cooked Food
                                </button>
                                <button
                                  type="button"
                                  className={`btn ${typeforCatering === 'Others' ? 'btn-warning' : 'btn-outline-secondary'}`}
                                  onClick={() => settypeforCatering('Others')}
                                  style={{
                                    flex: 1,
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.25rem'
                                  }}
                                >
                                  Others
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                      )}

                      {/* gender type  */}

                      {(specialField === 'CarPool')&& (
                        <div className="mb-3 d-flex align-items-center">
                          <div className="row w-100">
                            <div className="col-4">
                              <label className="form-label"><b>Type</b></label>
                            </div>
                            <div className="col-8 p-0">
                              <div className="d-flex gap-2">
                                <button
                                  type="button"
                                  className={`btn ${typeforCarPool === 'Male' ? 'btn-warning' : 'btn-outline-secondary'}`}
                                  onClick={() => settypeforCarPool('Male')}
                                  style={{
                                    flex: 1,
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.25rem'
                                  }}
                                >
                                  Male
                                </button>
                                <button
                                  type="button"
                                  className={`btn ${typeforCarPool === 'Female' ? 'btn-warning' : 'btn-outline-secondary'}`}
                                  onClick={() => settypeforCarPool('Female')}
                                  style={{
                                    flex: 1,
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.25rem'
                                  }}
                                >
                                  Female
                                </button>
                                <button
                                  type="button"
                                  className={`btn ${typeforCarPool === 'Both' ? 'btn-warning' : 'btn-outline-secondary'}`}
                                  onClick={() => settypeforCarPool('Both')}
                                  style={{
                                    flex: 1,
                                    padding: '0.375rem 0.75rem',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '0.25rem'
                                  }}
                                >
                                  Both
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                      )}
               

                {/* Service Title */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold"><b>Service Title</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter service title"
                        name="title"
                        value={postDetails.title}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted d-block text-end">Be specific (e.g. "Professional House Cleaning")</small>
                    </div>
                  </div>
                </div>

                {/* Service Description */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold"><b>Service Description</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Describe your service in detail"
                        name="description"
                        value={postDetails.description}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted d-block text-end">
                        Include what you offer, your approach, and why customers should choose you
                      </small>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold">Service Location</label>
                    </div>
                    <div className="col-8 p-0">
                      <div className="input-group">
                        <span className="input-group-text"><FiMapPin /></span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter service area or location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </div>
                      <small className="text-muted d-block text-end">Where do you provide this service?</small>
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
                        {/* Existing image previews */}
                        {images.map((image, index) => (
                          <div 
                            key={index} 
                            className="border rounded position-relative"
                            style={{
                              width: '60px',
                              height: '60px',
                              backgroundColor: '#f7f7f7'
                            }}
                          >
                            <img
                              src={URL.createObjectURL(image)}
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
                          </div>
                        ))}
                        
                        {/* Empty slots for remaining images */}
                        {Array.from({ length: Math.max(0, 14 - images.length) }).map((_, index) => (
                          <div 
                            key={`empty-${index}`} 
                            className="border rounded position-relative"
                            style={{
                              width: '60px',
                              height: '60px',
                              backgroundColor: '#f7f7f7'
                            }}
                            onClick={triggerImageInput}
                          >
                            <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer">
                              <FiPlus className="text-muted mb-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <input
                        type="file"
                        id="image-upload"
                        ref={imageInputRef}
                        className="d-none"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
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
                            <div 
                              className="w-100 h-100 d-flex flex-column align-items-center justify-content-center cursor-pointer"
                              onClick={triggerVideoInput}
                            >
                              <FiPlus className="text-muted mb-1" />
                              <small className="text-muted text-center" style={{ fontSize: '0.7rem' }}>
                                Add Video (max 50MB)
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <input
                        type="file"
                        id="video-upload"
                        ref={videoInputRef}
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

                {/* Contact Name */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Contact Person</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <div className="input-group">
                        <span className="input-group-text"><FiUser /></span>
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
                </div>

                {/* Phone Number Field */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label">Your Phone Number</label>
                    </div>
                    <div className="col-8 p-0 text-end">
                      <div className="input-group">
                        <span className="input-group-text"><FiPhone /></span>
                        <input
                          type="text"
                          className="form-control"
                          value="848764568998"
                          readOnly
                        />
                      </div>
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
                  Post Service Now
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-3 border">
          {/* Sidebar content */}
          <div className="p-3">
            <h5 className="fw-bold mb-3">Service Posting Tips</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Be clear about what you offer</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Highlight your qualifications</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Describe your process</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Mention any certifications</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Be specific about service areas</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Include clear pricing</li>
              <li><FiCheck className="text-warning me-2" /> Add photos of your previous work</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Category Selection Modal */}
      {showCategoryModal && renderCategoryModal()}
    </div>
  );
};

export default ServicePostingForm;