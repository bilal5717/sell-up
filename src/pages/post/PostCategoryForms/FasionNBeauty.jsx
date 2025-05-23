"use client";
import React, { useState } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';
import axios from 'axios';
const CreateFashionBeautyPost = ({selectedSubCat,selectedType}) => {
  // State Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Fashion & Beauty');
  const [selectedFashionType, setSelectedFashionType] = useState(selectedSubCat);
  const [selectedSubFashionType, setSelectedSubFashionType] = useState(selectedType);
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [material, setMaterial] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [showPhoneNumber, setShowPhoneNumber] = useState('');
  const [Footcategory, setFootcategory] = useState('');
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
const [uploadProgress, setUploadProgress] = useState({
    video: null
  });
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
  
    // Append general fields
    formData.append('title', postDetails.title);
    formData.append('description', postDetails.description);
    formData.append('contactName', name);
    formData.append('category', selectedCategory);
    formData.append('subCategory', selectedSubCat);
    formData.append('location', location);
    formData.append('price', postDetails.price);
  
    // Fashion & Beauty specific
    formData.append('type', selectedType);
    formData.append('gender', gender);
    formData.append('fabric', fabric);
    formData.append('material', material);
    formData.append('Footcategory', Footcategory);
    formData.append('condition', condition);
    formData.append('language', language);
    formData.append('age', ageRange);
  
    // Optional toggle
    formData.append('showPhoneNumber', true); // or false, based on your state
  
    // Append image URLs as JSON array
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
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
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
          value={Footcategory}
          onChange={(e) => setFootcategory(e.target.value)}
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

               <br />

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
        </div>
      </div>

      {/* Category Selection Modal */}
      {showCategoryModal && renderCategoryModal()}
    </div>
  );
};

export default CreateFashionBeautyPost;