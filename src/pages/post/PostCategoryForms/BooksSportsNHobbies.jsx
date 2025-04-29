'use client';
import React, { useState } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';

const CreateBooksSportsHobbiesPost = ({ selectedSubCat, selectedType }) => {
  const [selectedCategory, setSelectedCategory] = useState('Select Category');
  const [selectedKidsType, setSelectedKidsType] = useState(selectedSubCat);
  const [selectedSubKidsType, setSelectedSubKidsType] = useState('Select Sub-Type');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [language, setLanguage] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    price: '',
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

  const showTypeField = ['Musical Instruments', 'Sports Equipment', 'Gym & Fitness'].includes(selectedSubCat) || selectedSubCat === 'Books & Magazines';
  const showConditionField = ['Musical Instruments', 'Sports Equipment', 'Gym & Fitness', 'Others', 'Books & Magazines'].includes(selectedSubCat);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...postDetails,
      category: selectedCategory,
      kidsType: selectedKidsType,
      subKidsType: selectedSubKidsType,
      brand,
      condition,
      language,
      author: brand,
      name,
      location,
    };
    console.log('Post submitted:', submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-8">
          <div className="border rounded bg-white p-4">

            {/* Type Field */}
            {showTypeField && kidsSubTypes[selectedKidsType] && (
              <div className="mb-3">
                <label className="form-label fw-bold">Type</label>
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
            )}

            {/* Condition Field */}
            {showConditionField && (
              <div className="mb-3">
                <label className="form-label fw-bold">Condition</label>
                <div>
                  {conditionOptions.map((opt, i) => (
                    <button
                      type="button"
                      key={i}
                      className={`btn me-2 mb-2 ${condition === opt ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setCondition(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Language Field */}
            {showLanguageField && (
              <div className="mb-3">
                <label className="form-label fw-bold">Language</label>
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
            )}

            {/* Author Field */}
            {showAuthorField && (
              <div className="mb-3">
                <label className="form-label fw-bold">Author</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Author Name"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
            )}

            <hr />

            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-bold">Ad Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={postDetails.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows={4}
                value={postDetails.description}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Location */}
            <div className="mb-3">
              <label className="form-label fw-bold">Location</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label fw-bold">Price</label>
              <div className="input-group">
                <span className="input-group-text">Rs</span>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={postDetails.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-3">
              <label className="form-label fw-bold">Upload Images</label>
              <div className="d-flex flex-wrap gap-2">
                {Array.from({ length: 14 }).map((_, index) => (
                  <div key={index} style={{ width: '60px', height: '60px', backgroundColor: '#f7f7f7' }} className="border rounded position-relative">
                    {postDetails.images[index] ? (
                      <>
                        <img
                          src={URL.createObjectURL(postDetails.images[index])}
                          className="w-100 h-100 object-fit-cover rounded"
                          alt=""
                        />
                        <button
                          type="button"
                          className="btn-close position-absolute top-0 end-0"
                          onClick={() => removeImage(index)}
                          style={{ transform: 'scale(0.6)' }}
                        />
                      </>
                    ) : (
                      <label htmlFor="image-upload" className="d-flex align-items-center justify-content-center w-100 h-100">
                        <FiPlus />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              <input
                type="file"
                id="image-upload"
                className="d-none"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Video Upload */}
            <div className="mb-3">
              <label className="form-label fw-bold">Upload Video</label>
              <div className="border rounded p-2 position-relative">
                {videoFile ? (
                  <>
                    <video src={URL.createObjectURL(videoFile)} controls className="w-100" />
                    <button
                      type="button"
                      className="btn-close position-absolute top-0 end-0"
                      onClick={removeVideo}
                    />
                  </>
                ) : (
                  <label htmlFor="video-upload" className="d-flex justify-content-center align-items-center" style={{ height: '120px', cursor: 'pointer' }}>
                    <FiPlus />
                    <span className="ms-2">Add Video</span>
                  </label>
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

            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-bold">Your Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Phone Number Placeholder */}
            <div className="mb-3">
              <label className="form-label fw-bold">Your Phone Number</label>
              <div className="form-control-plaintext">848764568998</div>
            </div>

            {/* Toggle Show Number */}
            <div className="mb-4">
              <label className="form-label fw-bold">Show My Phone Number In Ads</label>
              <div>
                <Switch />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-warning fw-bold w-100">Post Now</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateBooksSportsHobbiesPost;
