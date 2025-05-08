"use client";
import React, { useState } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';

const BusinessIndustrialForm = ({selectedSubCat,selectedType}) => {
  console.log(selectedSubCat,selectedType);
  // State Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Business, Industrial & Agriculture');
  const [businessType, setBusinessType] = useState(selectedType);
  const [sellerType, setSellerType] = useState('business');
  const [companyName, setCompanyName] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [operationScale, setOperationScale] = useState('');
  const [showBusinessTypeDropdown, setShowBusinessTypeDropdown] = useState(false);
  const [businessTypeSearchTerm, setBusinessTypeSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [specialField, setSpecialField] = useState(selectedType);
  const [subCategory, setSubCategory] = useState('');
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    contactName: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Data Constants
  const categories = [
    { id: 1, name: 'Vehicles', icon: '🚗' },
    { id: 2, name: 'Property', icon: '🏠' },
    { id: 3, name: 'Electronics', icon: '📱' },
    { id: 4, name: 'Furniture', icon: '🛋️' },
    { id: 5, name: 'Jobs', icon: '💼' },
    { id: 6, name: 'Kids', icon: '👶' },
    { id: 7, name: 'Services', icon: '🔧' },
    { id: 8, name: 'Business, Industrial & Agriculture', icon: '🏭' },
  ];

  const businessTypes = [
    'Business For Sale',
    'Food & Restaurant',
    'Construction & Heavy Machinery',
    'Agriculture',
    'Medical & Pharma',
    'Trade & Industrial Machinery',
    'Farming Supplies',
    'Commercial Kitchen Equipment',
    'Packaging Machinery',
    'Other Business & Industry'
  ];

  // Special fields for specific business types
  const specialFields = {
    'Business For Sale': ['Mobile Shops', 'Water Plants', 'Beauty Salons', 'Grocery Store', 'Hotel & Resturant', 'Pharmacies','Snooker Clubs','Cosmetic & jewellery Shop','Gyms','Clinics','Franchises','Gift and Toy Shops','Petrol Pump','Auto parts shop','Other Bussiness'],
    'Construction & Heavy Machinery': ['Construction Material','Concrete Grinders','Drill Machines','Road Roller','Cranes','Construction Lifters','Pavers','Excavators','Concrete Cutters','Compactors','Water Pumps','Air Compressors','Domp Truck','Motor Granders','Other Heavy Equipment'],
    'Medical & Pharma': ['Ultrasound Machines','Surgical Masks','patient Beds','Wheelchairs','Oxygen Cylinders','Pulse Oximeters','Hearing aid','Blood pressure Monitors','Themometers','Walkers','Nebulizer','Breast Pump','Surgical instrument','Microscopes','Other Medical Supplies'],
    'Trade & Industrial Machinery': ['Woodworking Machines','Currency counting machine','Plastic & Rubber processing machine','Molding Machine','Packing Machine','Welding equipemnt','paper machine','Air compressors','Sealing Machine','Lathe Machines','Liquid Filling Machine','Marking Machine','Textile Machinery','Sewing Machine','Knithing Machine','Embroidery Machine','Printing Machine','Other bussiness & Industrial Machines'],
    'Food & Restaurant': ['Baking equipment','Food display counters','Ovens & Tandoor','Fryers','Tables & Platform','Fruit & Vegetable Machine','Chillers','Food Stall','Delivery Bags','Crockery & Cutlery','Ic-Cream Machines','Other resturant equipment'],
    'Agriculture': ['Farm Machinery and equipment','Seads','Crops','Pesticides & Fertilizer','Plant & Tree','Other agriculture Silage']
  };

  // Sub-categories for special fields
  const subCategories = {
    // Food & Restaurant sub-categories
    'Baking equipment': ['Dough Mixer', 'Waffle Makers', 'Breading Tables', 'Bakery Counters', 'Others'],
    'Food display counters': ['Fries', 'Shawarma', 'Biryani', 'Bakery', 'Fast Food','Others'],
    'Ovens & Tandoor': ['Baking Ovens', 'Pizza Ovens', 'Rotary Ovens', 'Tandoor Ovens', 'Microwave Ovens', 'Combi Ovens', 'Other Ovens'],
    
    // Agriculture sub-categories
    'Farm Machinery and equipment': ['Milking Machine', 'Agricultural Sprayers', 'Missing System', 'Seeders']
  };

  const conditions = [
    'New',
    'Used',
    'Refurbished'
  ];

  const operationScales = [
    'Small',
    'Medium',
    'Large'
  ];

  // Derived Values
  const filteredBusinessTypes = businessTypes.filter(option => 
    option.toLowerCase().includes(businessTypeSearchTerm.toLowerCase())
  );

  // Check if current business type has special fields
  const hasSpecialField = Object.keys(specialFields).includes(businessType);
  
  // Check if we need to show sub-category dropdown
  const showSubCategory = hasSpecialField && Object.keys(subCategories).includes(specialField);

  // Event Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    
    // Append all form data
    formData.append('title', postDetails.title);
    formData.append('description', postDetails.description);
    formData.append('contactName', postDetails.contactName);
    formData.append('category', selectedCategory);
    formData.append('subCategory', businessType);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('condition', condition);
    formData.append('operationScale', operationScale);
    formData.append('specifications', specifications);
    formData.append('businessType', businessType);
    formData.append('specialField', specialField);
    formData.append('subCategoryType', subCategory);
    formData.append('companyName', companyName);
    formData.append('sellerType', sellerType);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      alert('Post created successfully:', data);
      // Redirect or show success message
    } catch (err) {
      setError(err.message);
      console.error('Error submitting form:', err);
    } finally {
      setIsLoading(false);
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

  const renderBusinessTypeDropdown = () => (
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
              placeholder="Search business types..."
              value={businessTypeSearchTerm}
              onChange={(e) => setBusinessTypeSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        {filteredBusinessTypes.map((type, index) => (
          <div
            key={index}
            className={`p-2 cursor-pointer ${businessType === type ? 'bg-light' : ''}`}
            onClick={() => {
              setBusinessType(type);
              setShowBusinessTypeDropdown(false);
              setBusinessTypeSearchTerm('');
              setSpecialField(''); // Reset special field when business type changes
              setSubCategory(''); // Reset sub-category when business type changes
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
                    {categories.find(c => c.name === selectedCategory)?.icon || '🏭'}
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
                
                

                {/* Sub-Category Dropdown (Conditional) */}
                { (selectedType === 'Baking equipment' || selectedType === 'Food display counters' || selectedType === 'Ovens & Tandoor' || selectedType === 'Farm Machinery and equipment') &&(
                  <div className="mb-3 d-flex align-items-center">
                    <div className="row w-100">
                      <div className="col-4">
                        <label className="form-label"><b>Type of {selectedType}</b></label>
                      </div>
                      <div className="col-8 p-0">
                        <select
                          className="form-select"
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select {specialField} Type</option>
                          {subCategories[specialField].map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                

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
                      <small className="text-muted d-block text-end">Be specific (e.g. "John Deere Tractor 2022 Model")</small>
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
                      <small className="text-muted d-block text-end">Include key features, usage history, and benefits</small>
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

export default BusinessIndustrialForm;