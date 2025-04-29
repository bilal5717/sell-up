"use client";
import React, { useState, useRef } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch, FiCalendar } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';

const BikesPosting = ({selectedSubCat,selectedType}) => {
  // State Management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Vehicles');
  const [subCategory, setSubCategory] = useState(selectedSubCat);
  const [showSubCategoryDropdown, setShowSubCategoryDropdown] = useState(false);
  const [kind, setKind] = useState(selectedType);
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
  });
  const [images, setImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [name, setName] = useState('');
  
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

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
    'Kawasaki': ['Ninja', 'Z', 'Versys', 'Other'],
    'Harley-Davidson': ['Sportster', 'Softail', 'Touring', 'Other'],
    'Royal Enfield': ['Classic', 'Bullet', 'Himalayan', 'Other']
    // Add more models as needed
  };

  const registrationCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar',
    'Quetta', 'Multan', 'Faisalabad', 'Hyderabad', 'Other'
  ];

  const years = Array.from({length: 30}, (_, i) => new Date().getFullYear() - i);

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
      subCategory,
      kind,
      make,
      model,
      year,
      engineType,
      engineCapacity,
      kmsDriven,
      ignitionType,
      origin,
      condition,
      registrationCity,
      location,
      price
    };
    console.log('Bike post created:', submissionData);
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
               
                  {subCategory !== 'Spare Parts'&& subCategory !== 'Bike Accessories'&&(
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
                {make  && subCategory !== 'Bicycle' &&(
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
                {subCategory !== 'Spare Parts' && kind !== 'Electric Bikes'&& kind !== 'Electric' && subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle' &&(
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
                {subCategory !== 'Spare Parts' && kind !== 'Electric Bikes' && kind !== 'Electric'&& subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle'&&(
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
{(kind === 'Electric Bikes' || kind === 'Electric' )   && (
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
                {subCategory !== 'Spare Parts' && subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle'  &&(
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
                
                  {selectedType !== 'Electric Bikes' && kind !== 'Electric' && subCategory !== 'Spare Parts' && subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle' && subCategory !== 'ATV & Quads' &&(
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
                
                 { subCategory !== 'Bicycle' && subCategory !== 'ATV & Quads' &&  (
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
               
                  {subCategory !== 'Spare Parts' && subCategory !== 'Bike Accessories' && subCategory !== 'Bicycle' &&(
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

export default BikesPosting;