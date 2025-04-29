"use client";
import React, { useState } from 'react';
import { FiEdit, FiX, FiChevronDown, FiCheck, FiPlus, FiSearch } from 'react-icons/fi';
import Switch from '@/components/common/Tooglebtn';

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
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);
  const [jobTypeSearchTerm, setJobTypeSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
    contactName: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...postDetails,
      category: selectedCategory,
      jobType,
      hiringType,
      companyName,
      salaryFrom,
      salaryTo,
      careerLevel,
      salaryPeriod,
      positionType,
      location
    };
    console.log('Job posted:', submissionData);
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