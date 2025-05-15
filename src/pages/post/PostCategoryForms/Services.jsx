"use client";
import React, { useState, useRef } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch, FiClock, FiDollarSign, FiMapPin, FiUser, FiPhone } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import axios from 'axios';
const ServicePostingForm = ({selectedSubCat,selectedType}) => {
  // State Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Services');
  const [serviceType, setServiceType] = useState(selectedSubCat);
  const [businessType, setBusinessType] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [showServiceTypeDropdown, setShowServiceTypeDropdown] = useState(false);
  const [serviceTypeSearchTerm, setServiceTypeSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [typeforCatering, settypeforCatering] = useState('');
  const [typeforCarPool,settypeforCarPool]=useState('');
  const [postDetails, setPostDetails] = useState({
      title: '',
      description: '',
      price: '',
      images: [],
    });
  const [specialField, setSpecialField] = useState(selectedType);
  const [specialTypeField, setspecialTypeField] = useState('');
  const [videoFile, setVideoFile] = useState(null);
     const [uploadProgress, setUploadProgress] = useState({
         video: null
       });
  const [name, setName] = useState('');


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Add all the form fields to formData
    formData.append('title', postDetails.title);
    formData.append('description', postDetails.description);
    formData.append('category', selectedCategory);
    formData.append('subCategory', serviceType);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('contactName', postDetails.contactName);
    formData.append('name', name);
    
    // Service-specific fields
    formData.append('serviceType', serviceType);
    formData.append('businessType', businessType);
    formData.append('businessName', businessName);
    formData.append('availability', availability);
    formData.append('experienceLevel', experienceLevel);
    formData.append('specialField', specialField);
    formData.append('specialTypeField', specialTypeField);
    formData.append('typeforCatering', typeforCatering);
    formData.append('typeforCarPool', typeforCarPool);
    
     const imageUrls = postDetails.images.map(img => img.publicUrl);
        formData.append('imageUrls', JSON.stringify(imageUrls));

        if (videoFile) {
            const videoUrls = [videoFile.publicUrl];
            formData.append('videoUrls', JSON.stringify(videoUrls));
        }
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type when using FormData, let the browser set it
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Post created successfully:', data);
        // Redirect or show success message
      } else {
        console.error('Error creating post:', data);
        // Show error message
      }
    } catch (error) {
      console.error('Network error:', error);
      // Show network error message
    }
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
                                  onClick={() => settypeforCatering('Catering')}
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

                {/* Price */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Price</b></label>
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