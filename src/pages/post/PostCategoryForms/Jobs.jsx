"use client";
import React, { useState } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import axios from 'axios';
const JobPostingForm = ({selectedSubCat,selectedType}) => {
  // State Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Jobs');
  const [jobType, setJobType] = useState(selectedSubCat);
  const [hiringType, setHiringType] = useState('company');
  const [companyName, setCompanyName] = useState('');
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [careerLevel, setCareerLevel] = useState('');
  const [salaryPeriod, setSalaryPeriod] = useState('');
  const [positionType, setPositionType] = useState('');
  const [price, setPrice] = useState('');
  const [jobTypeSearchTerm, setJobTypeSearchTerm] = useState('');
  const [location, setLocation] = useState('');
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
  // Data Constants
  const categories = [
    { id: 1, name: 'Vehicles', icon: '🚗' },
    { id: 2, name: 'Property', icon: '🏠' },
    { id: 3, name: 'Electronics', icon: '📱' },
    { id: 4, name: 'Furniture', icon: '🛋️' },
    { id: 5, name: 'Jobs', icon: '💼' },
    { id: 6, name: 'Kids', icon: '👶' },
    { id: 7, name: 'Services', icon: '🔧' },
  ];

  const jobTypes = [
    'Accounting & Finance',
    'Advertising & PR',
    'Architecture & Interior Design',
    'Clerical & Administration',
    'Content Writing',
    'Customer Service',
    'Delivery Riders',
    'Domestic Staff',
    'Education',
    'Engineering',
    'Graphic Design',
    'Hotels & Tourism',
    'Human Resources',
    'Internships',
    'IT & Networking',
    'Manufacturing',
    'Marketing',
    'Medical',
    'Online',
    'Part Time',
    'Real Estate',
    'Restaurents & Hospitals',
    'Sales',
    'Security'
  ];

  const careerLevels = [
    'Entry Level',
    'Mid-Senior Level',
    'Senior Level',
    'Executive',
    'Associate',
    'Director'
  ];

  const salaryPeriods = [
    'Hourly',
    'Daily',
    'Weekly',
    'Monthly',
    'Yearly'
  ];

  const positionTypes = [
    'Full Time',
    'Part Time',
    'Contract',
    'Temporary'
  ];

 

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
    formData.append('subCategory', jobType);
    formData.append('location', location);
    formData.append('price', price);
    formData.append('contactName', postDetails.contactName);
    
    // Job-specific fields
    formData.append('jobType', jobType);
    formData.append('hiringType', hiringType);
    formData.append('companyName', companyName);
    formData.append('salaryFrom', salaryFrom);
    formData.append('salaryTo', salaryTo);
    formData.append('careerLevel', careerLevel);
    formData.append('salaryPeriod', salaryPeriod);
    formData.append('positionType', positionType);
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
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Job posted successfully:', data);
        // Redirect or show success message
      } else {
        console.error('Error posting job:', data);
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
                

                {/* Hiring Type Selection */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Hiring As</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className={`btn ${hiringType === 'company' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setHiringType('company')}
                        >
                          Company
                        </button>
                        <button
                          type="button"
                          className={`btn ${hiringType === 'individual' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setHiringType('individual')}
                        >
                          Individual
                        </button>
                        <button
                          type="button"
                          className={`btn ${hiringType === 'agency' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setHiringType('agency')}
                        >
                          Agency
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company/Organization Name */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>{hiringType === 'company' ? 'Company Name' : hiringType === 'agency' ? 'Agency Name' : 'Your Name'}</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Enter ${hiringType === 'company' ? 'company' : hiringType === 'agency' ? 'agency' : 'your'} name`}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Salary Range</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <div className="row g-2">
                        <div className="col-6">
                          <div className="input-group">
                            <span className="input-group-text">Rs</span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="From"
                              value={salaryFrom}
                              min={0}
                              onChange={(e) => setSalaryFrom(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="input-group">
                            <span className="input-group-text">Rs</span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="To"
                              min={0}
                              value={salaryTo}
                              onChange={(e) => setSalaryTo(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career Level */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Career Level</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <select
                        className="form-select"
                        value={careerLevel}
                        onChange={(e) => setCareerLevel(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select Career Level</option>
                        {careerLevels.map((level, index) => (
                          <option key={index} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Salary Period */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Salary Period</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <select
                        className="form-select"
                        value={salaryPeriod}
                        onChange={(e) => setSalaryPeriod(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select Salary Period</option>
                        {salaryPeriods.map((period, index) => (
                          <option key={index} value={period}>{period}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Position Type */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Position Type</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <select
                        className="form-select"
                        value={positionType}
                        onChange={(e) => setPositionType(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select Position Type</option>
                        {positionTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <hr />

                {/* Job Title */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold"><b>Job Title</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter job title"
                        name="title"
                        value={postDetails.title}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted d-block text-end">Be specific (e.g. "Senior React Developer")</small>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold"><b>Job Description</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <textarea
                        className="form-control"
                        rows={5}
                        placeholder="Describe the job responsibilities and requirements"
                        name="description"
                        value={postDetails.description}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted d-block text-end">Include key responsibilities, requirements, and benefits</small>
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
                        placeholder="Enter job location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                      <small className="text-muted d-block text-end">Where is this job located?</small>
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
                  Post Job Now
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-3 border">
          {/* Sidebar content */}
          <div className="p-3">
            <h5 className="fw-bold mb-3">Job Posting Tips</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Be clear about the job title</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Specify required qualifications</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Highlight key responsibilities</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Mention benefits and perks</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Include accurate location details</li>
              <li><FiCheck className="text-warning me-2" /> Be transparent about salary</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Category Selection Modal */}
      {showCategoryModal && renderCategoryModal()}
    </div>
  );
};

export default JobPostingForm;