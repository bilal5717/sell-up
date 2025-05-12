"use client";
import React, { useState, useRef } from 'react';
import {  FiCheck,FiX, FiCalendar,FiPlus  } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import axios from 'axios';
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

const BikesPosting = ({selectedSubCat, selectedType}) => {
  // State Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Bikes');
  const [subCategory] = useState(selectedSubCat);
  const [kind] = useState(selectedType);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engineType, setEngineType] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('');
  const [kmsDriven, setKmsDriven] = useState('');
  const [ignitionType, setIgnitionType] = useState('');
  const [origin, setOrigin] = useState('');
  const [condition, setCondition] = useState('');
  const [registrationCity, setRegistrationCity] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    contactName: '',
    images: [],
  });
  const [videoFile, setVideoFile] = useState(null);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false); // Added state for phone number toggle
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
    { id: 8, name: 'Business/Industrial/Agriculture', icon: '🏭' },
  ];

  const makes = [
    'Honda', 'Yamaha', 'Suzuki','United', 'Road prince','Unique' ,'Super Power','Super Star','Metro','Crown','kawasaki','Power','Ravi','Eagle','Habib','Ghani','Sohrab','Benelli','Derbi','Zongshen','CF Moto','Cineco','Qingqi','Hero','speed','Lifan','Pak Hero','Safari','Super Asia','Toyo','Treet','Union Star','Other'
  ];

  const models = {
    'Honda': ['CBR', 'CB', 'CRF', 'Gold Wing', 'Other'],
    'Yamaha': ['YZF-R', 'MT', 'FZ', 'YZ', 'Other'],
    'Suzuki': ['GSX-R', 'Hayabusa', 'V-Strom', 'Other'],
    'Kawasaki': ['Ninja', 'Z', 'Versys', 'Other'],
    'Harley-Davidson': ['Sportster', 'Softail', 'Touring', 'Other'],
    'Royal Enfield': ['Classic', 'Bullet', 'Himalayan', 'Other']
  };

  const registrationCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar',
    'Quetta', 'Multan', 'Faisalabad', 'Hyderabad', 'Other'
  ];


  // Event Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostDetails(prev => ({ ...prev, [name]: value }));
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
    if (videoFile && videoFile.preview) {
        URL.revokeObjectURL(videoFile.preview);
    }
    setVideoFile(null);
    setUploadProgress(prev => ({
      ...prev,
      video: null
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
  
    // Append regular fields
    formData.append('title', postDetails.title);
    formData.append('description', postDetails.description);
    formData.append('contactName', postDetails.contactName);
    formData.append('category', selectedCategory);
    formData.append('subCategory', subCategory);
    formData.append('kind', kind);
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('engineType', engineType);
    formData.append('engineCapacity', engineCapacity);
    formData.append('kmsDriven', kmsDriven);
    formData.append('ignitionType', ignitionType);
    formData.append('origin', origin);
    formData.append('condition', condition);
    formData.append('registrationCity', registrationCity);
    formData.append('location', location);
    formData.append('price', price);
    formData.append('showPhoneNumber', showPhoneNumber);
  
    // Append image URLs as JSON array
        const imageUrls = postDetails.images.map(img => img.publicUrl);
        formData.append('imageUrls', JSON.stringify(imageUrls));
         // Append video if exists
        if (videoFile) {
            const videoUrls = [videoFile.publicUrl];
            formData.append('videoUrls', JSON.stringify(videoUrls));
        }
  
    // Append video
    if (videoFile) {
      formData.append('videoFile', videoFile);
    }
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (result.success) {
        alert('Post created!');
      } else {
        alert('Failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred');
    }
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
                    {categories.find(c => c.name === selectedCategory)?.icon || '🚗'}
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
               
                  {subCategory !== 'Spare Parts' && subCategory !== 'Bike Accessories' && (
                    <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Make</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <select
                          className="form-select"
                          value={make}
                          onChange={(e) => {
                            setMake(e.target.value);
                            setModel(''); // Reset model when make changes
                          }}
                          required
                        >
                          <option value="" disabled>Select Make</option>
                          {makes.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  )}
            

                {/* Model Dropdown */}
                {make && subCategory !== 'Bicycle' && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Model</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <select
                          className="form-select"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Model</option>
                          {models[make]?.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Year Dropdown with Custom Input */}
                {model && subCategory !== 'Spare Parts' && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Year</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <div className="input-group">
                          <input
                            type="number"
                            className="form-control"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="Enter year (e.g., 2023)"
                            min="1900"
                            max="2100"
                            required
                          />
                          <span className="input-group-text">
                            <FiCalendar />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Engine Type */}
                {subCategory !== 'Spare Parts' && kind !== 'Electric Bikes' && kind !== 'Electric' && subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle' && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Engine Type</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <div className="btn-group gap-2 w-100" role="group">
                          <input
                            type="radio"
                            className="btn-check"
                            name="engineType"
                            id="engineType2stroke"
                            value="2 Stroke"
                            checked={engineType === '2 Stroke'}
                            onChange={() => setEngineType('2 Stroke')}
                            required
                          />
                          <label className="btn btn-outline-secondary" htmlFor="engineType2stroke">2 Stroke</label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="engineType"
                            id="engineType4stroke"
                            value="4 Stroke"
                            checked={engineType === '4 Stroke'}
                            onChange={() => setEngineType('4 Stroke')}
                          />
                          <label className="btn btn-outline-secondary" htmlFor="engineType4stroke">4 Stroke</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Engine Capacity */}
                {subCategory !== 'Spare Parts' && kind !== 'Electric Bikes' && kind !== 'Electric' && subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle' && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Engine Capacity (cc)</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter engine capacity"
                          value={engineCapacity}
                          min={0}
                          onChange={(e) => setEngineCapacity(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Battery Capacity */}
                {(kind === 'Electric Bikes' || kind === 'Electric') && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Battery Capacity (mAh)</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter battery capacity"
                          value={engineCapacity}
                          min={0}
                          onChange={(e) => setEngineCapacity(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Kms Driven */}
                {subCategory !== 'Spare Parts' && subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle' && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Kms Driven</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter kilometers driven"
                          value={kmsDriven}
                          min={0}
                          onChange={(e) => setKmsDriven(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Ignition Type */}
                {selectedType !== 'Electric Bikes' && kind !== 'Electric' && subCategory !== 'Spare Parts' && subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle' && subCategory !== 'ATV & Quads' && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Ignition Type</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <div className="btn-group w-100 gap-2" role="group">
                          <input
                            type="radio"
                            className="btn-check"
                            name="ignitionType"
                            id="ignitionSelfStart"
                            value="Self Start"
                            checked={ignitionType === 'Self Start'}
                            onChange={() => setIgnitionType('Self Start')}
                            required
                          />
                          <label className="btn btn-outline-secondary" htmlFor="ignitionSelfStart">Self Start</label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="ignitionType"
                            id="ignitionKickStart"
                            value="Kick Start"
                            checked={ignitionType === 'Kick Start'}
                            onChange={() => setIgnitionType('Kick Start')}
                          />
                          <label className="btn btn-outline-secondary" htmlFor="ignitionKickStart">Kick Start</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Origin */}
                {subCategory !== 'Bicycle' && subCategory !== 'ATV & Quads' && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Origin</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <div className="btn-group w-100 gap-2" role="group">
                          <input
                            type="radio"
                            className="btn-check"
                            name="origin"
                            id="originLocal"
                            value="Local"
                            checked={origin === 'Local'}
                            onChange={() => setOrigin('Local')}
                            required
                          />
                          <label className="btn btn-outline-secondary" htmlFor="originLocal">Local</label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="origin"
                            id="originImport"
                            value="Import"
                            checked={origin === 'Import'}
                            onChange={() => setOrigin('Import')}
                          />
                          <label className="btn btn-outline-secondary" htmlFor="originImport">Import</label>

                          <input
                            type="radio"
                            className="btn-check"
                            name="origin"
                            id="originChinese"
                            value="Chinese"
                            checked={origin === 'Chinese'}
                            onChange={() => setOrigin('Chinese')}
                          />
                          <label className="btn btn-outline-secondary" htmlFor="originChinese">Chinese</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Condition */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label"><b>Condition</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <div className="btn-group w-100 gap-2" role="group">
                        <input
                          type="radio"
                          className="btn-check"
                          name="condition"
                          id="conditionNew"
                          value="New"
                          checked={condition === 'New'}
                          onChange={() => setCondition('New')}
                          required
                        />
                        <label className="btn btn-outline-secondary" htmlFor="conditionNew">New</label>

                        <input
                          type="radio"
                          className="btn-check"
                          name="condition"
                          id="conditionUsed"
                          value="Used"
                          checked={condition === 'Used'}
                          onChange={() => setCondition('Used')}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="conditionUsed">Used</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration City */}
                {subCategory !== 'Spare Parts' && subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle' && (
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Registration City</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <select
                          className="form-select"
                          value={registrationCity}
                          onChange={(e) => setRegistrationCity(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Registration City</option>
                          {registrationCities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <hr />

                {/* Product/Service Title */}
                <div className="mb-3 d-flex align-items-center">
                  <div className="row w-100">
                    <div className="col-4">
                      <label className="form-label fw-bold"><b>Product/Service Title</b></label>
                    </div>
                    <div className="col-8 p-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter product or service title"
                        name="title"
                        value={postDetails.title}
                        onChange={handleInputChange}
                        required
                      />
                      <small className="text-muted d-block text-end">Be specific (e.g. "Honda CB 150F 2022 Model")</small>
                    </div>
                  </div>
                </div>

                {/* Description */}
<div className="mb-3 d-flex align-items-center">
  <div className="row w-100">
    <div className="col-4">
      <label className="form-label fw-bold"><b>Description</b></label>
    </div>
    <div className="col-8 p-0">
      <textarea
        className="form-control"
        rows={5}
        placeholder="Describe the product or service in detail"
        name="description"
        value={postDetails.description}
        onChange={handleInputChange}
        required
      />
      <small className="text-muted d-block text-end">
        Include key features, usage history, and benefits
      </small>
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
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                      <small className="text-muted d-block text-end">Where is this item located?</small>
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
                      <Switch 
                        value={showPhoneNumber}
                        onChange={setShowPhoneNumber} // Fixed the onChange prop
                      />
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
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Provide clear and detailed specifications</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Include high-quality photos</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Mention the condition of the item</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Be transparent about pricing</li>
              <li className="mb-2"><FiCheck className="text-warning me-2" /> Specify delivery/transport options</li>
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

export default BikesPosting;