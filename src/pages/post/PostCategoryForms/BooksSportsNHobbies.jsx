'use client';
import React, { useState } from 'react';
import {  FiX,FiCheck, FiPlus } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import axios from 'axios';
const CreateBooksSportsHobbiesPost = ({ selectedSubCat, selectedType }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Books, Sports & Hobbies');
  const [selectedKidsType] = useState(selectedSubCat || 'Select Type');
  const [selectedSubKidsType, setSelectedSubKidsType] = useState(selectedType || 'Select Sub-Type');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    contactName: '',
    images: [],
  });
 const [videoFile, setVideoFile] = useState(null);
const [uploadProgress, setUploadProgress] = useState({
    video: null
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
    
   const imageUrls = postDetails.images.map(img => img.publicUrl);
        formData.append('imageUrls', JSON.stringify(imageUrls));
         // Append video if exists
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