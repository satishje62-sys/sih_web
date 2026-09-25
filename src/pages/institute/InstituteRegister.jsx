import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Building2, BookOpen, Check, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { registerInstitute } from '../../utils/authStorage';
import './InstituteRegister.css';

const MAHARASHTRA_DISTRICTS = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", 
  "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", 
  "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
  "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", 
  "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", 
  "Washim", "Yavatmal"
];

const InstituteRegister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [instituteType, setInstituteType] = useState('ITI'); // 'ITI' or 'Polytechnic'
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    managementType: 'Government',
    regNumber: '',
    district: 'Pune',
    address: '',
    contactNumber: '',
    email: '',
    website: '',
    password: '',
    confirmPassword: '',
    programsOffered: 'both',
    studentCapacity: '450',
    trades: '',
    description: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const handleTypeToggle = (type) => {
    setInstituteType(type);
    // Suggest relevant default trades based on type
    if (type === 'ITI') {
      setFormData(prev => ({
        ...prev,
        trades: prev.trades || 'Fitter, Electrician, Machinist, Welder, COPA',
        regNumber: prev.regNumber || 'ITI-PUN-2024-089'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        trades: prev.trades || 'Mechanical Engineering, Civil Engineering, Electrical Engineering, Computer Engineering',
        regNumber: prev.regNumber || 'DTE-POLY-6125'
      }));
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setErrorMessage('Please enter the Institute Name.');
        return;
      }
      if (!formData.regNumber.trim()) {
        setErrorMessage(`Please enter the ${instituteType === 'ITI' ? 'ITI DGT Code' : 'DTE/MSBTE Institute Code'}.`);
        return;
      }
      if (!formData.district) {
        setErrorMessage('Please select a district in Maharashtra.');
        return;
      }
      if (!formData.contactNumber.trim()) {
        setErrorMessage('Please enter an official contact number.');
        return;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('Please enter a valid official email address.');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setErrorMessage('Please create a password with at least 6 characters.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.studentCapacity || Number(formData.studentCapacity) <= 0) {
        setErrorMessage('Please enter a valid annual student intake capacity.');
        return;
      }
      if (!formData.trades.trim()) {
        setErrorMessage('Please enter the available trades or courses.');
        return;
      }
    }

    setErrorMessage('');
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setErrorMessage('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsAgreed) {
      setErrorMessage('Please accept the Terms & Conditions to proceed.');
      return;
    }

    const regResult = registerInstitute({
      type: instituteType,
      ...formData
    });

    if (!regResult.success) {
      setErrorMessage(regResult.message);
      return;
    }

    setSuccessModal(true);
  };

  return (
    <div className="register-layout">
      <header className="auth-header">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="SkillBridge Logo" style={{ height: '36px' }} />
          <span className="auth-logo-text" style={{ marginLeft: '8px' }}>SkillBridge</span>
        </div>
        <nav className="auth-nav">
          <Link to="/">Home</Link>
          <Link to="/institute/login">Institute Login</Link>
          <Link to="/employer/login">Employer Portal</Link>
        </nav>
      </header>

      <main className="register-main">
        <div className="register-container">
          <Link to="/institute/login" className="back-link">
            <ArrowLeft size={16} /> Back to Login
          </Link>
          
          <div className="register-header">
            <div>
              <h1>Institute Registration</h1>
              <p>Register your ITI or Polytechnic to access industry job postings, skill gap insights, and collaboration MoUs.</p>
            </div>

            {/* WORKING ITI / POLYTECHNIC TOGGLE */}
            <div className="institute-type-toggle">
              <button 
                type="button"
                className={instituteType === 'ITI' ? 'active' : ''}
                onClick={() => handleTypeToggle('ITI')}
              >
                ITI (Industrial Training)
              </button>
              <button 
                type="button"
                className={instituteType === 'Polytechnic' ? 'active' : ''}
                onClick={() => handleTypeToggle('Polytechnic')}
              >
                Polytechnic (Diploma)
              </button>
            </div>
          </div>

          {/* Active selection banner */}
          <div style={{
            background: instituteType === 'ITI' ? '#eff6ff' : '#faf5ff',
            border: `1px solid ${instituteType === 'ITI' ? '#bfdbfe' : '#e9d5ff'}`,
            padding: '10px 16px',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: instituteType === 'ITI' ? '#1e40af' : '#6b21a8'
          }}>
            <Building2 size={18} />
            <span>
              Registering as: <strong>{instituteType === 'ITI' ? 'ITI (Industrial Training Institute - DGT/NCVT affiliated)' : 'Polytechnic (Engineering Diploma College - MSBTE/AICTE affiliated)'}</strong>
            </span>
          </div>

          {errorMessage && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '10px 16px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="register-content">
            {/* Sidebar Steps */}
            <div className="steps-sidebar">
              <div className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-circle">1</div>
                <span>{instituteType} Basic Info</span>
              </div>
              <div className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">2</div>
                <span>Curriculum & Capacity</span>
              </div>
              <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span>Review & Submit</span>
              </div>
            </div>

            {/* Form Area */}
            <div className="form-area">
              <form onSubmit={handleSubmit} className="multi-step-form">
                
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <>
                    <h2 className="step-title">1. {instituteType} Information</h2>
                    <div className="form-grid">
                      <div className="input-group full-width">
                        <label>Institute Name *</label>
                        <input 
                          type="text" 
                          placeholder={instituteType === 'ITI' ? 'e.g. Government ITI Pune, Chakan' : 'e.g. Government Polytechnic Pune'} 
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Management Type *</label>
                        <select 
                          value={formData.managementType} 
                          onChange={(e) => handleChange('managementType', e.target.value)}
                          required
                        >
                          <option value="Government">Government / ITI</option>
                          <option value="Private">Private / Self-Financed</option>
                          <option value="Aided">Government-Aided</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label>{instituteType === 'ITI' ? 'DGT / MIS Code *' : 'DTE / MSBTE Code *'}</label>
                        <input 
                          type="text" 
                          placeholder={instituteType === 'ITI' ? 'e.g. PR27000123' : 'e.g. DTE-6125'} 
                          value={formData.regNumber}
                          onChange={(e) => handleChange('regNumber', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>District *</label>
                        <select 
                          value={formData.district} 
                          onChange={(e) => handleChange('district', e.target.value)}
                          required
                        >
                          {MAHARASHTRA_DISTRICTS.map(district => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>

                      <div className="input-group">
                        <label>Official Contact Number *</label>
                        <input 
                          type="tel" 
                          placeholder="e.g. 020-25678901 / 9876543210" 
                          value={formData.contactNumber}
                          onChange={(e) => handleChange('contactNumber', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Official Email *</label>
                        <input 
                          type="email" 
                          placeholder="principal@itipune.ac.in" 
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Website URL (Optional)</label>
                        <input 
                          type="url" 
                          placeholder="https://gpitpune.ac.in" 
                          value={formData.website}
                          onChange={(e) => handleChange('website', e.target.value)}
                        />
                      </div>

                      <div className="input-group full-width">
                        <label>Campus Address *</label>
                        <input 
                          type="text" 
                          placeholder="Full address with Taluka and Pincode" 
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Create Login Password *</label>
                        <input 
                          type="password" 
                          placeholder="Minimum 6 characters" 
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                        />
                      </div>

                      <div className="input-group">
                        <label>Confirm Password *</label>
                        <input 
                          type="password" 
                          placeholder="Confirm password" 
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <>
                    <h2 className="step-title">2. Curriculum, Trades & Capacity</h2>
                    <div className="form-grid">
                      <div className="input-group">
                        <label>Programs Offered *</label>
                        <select 
                          value={formData.programsOffered}
                          onChange={(e) => handleChange('programsOffered', e.target.value)}
                          required
                        >
                          <option value="both">Both Engineering & Technical Trades</option>
                          <option value="engineering">Core Engineering Trades Only</option>
                          <option value="non-engineering">Service / Non-Engineering Trades</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label>Annual Student Intake Capacity *</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 450" 
                          value={formData.studentCapacity}
                          onChange={(e) => handleChange('studentCapacity', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group full-width">
                        <label>{instituteType === 'ITI' ? 'ITI Trades Available *' : 'Diploma Engineering Programs Available *'}</label>
                        <input 
                          type="text" 
                          placeholder={instituteType === 'ITI' ? 'e.g. Fitter, Electrician, Machinist, Welder, COPA' : 'e.g. Mechanical Engineering, Civil, Computer, Electrical'} 
                          value={formData.trades}
                          onChange={(e) => handleChange('trades', e.target.value)}
                          required 
                        />
                        <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Separate multiple trades with commas.</span>
                      </div>

                      <div className="input-group full-width">
                        <label>Workshop Facilities & Achievements</label>
                        <textarea 
                          placeholder="Mention your CNC machines, computer labs, Dual Training partnerships, or placement records..." 
                          rows="3"
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <>
                    <h2 className="step-title">3. Review & Verification</h2>
                    <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1e293b' }}>Summary of Institute Details</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                        <div><strong>Institute Type:</strong> <span className="status-pill active">{instituteType}</span></div>
                        <div><strong>Affiliation:</strong> {formData.managementType}</div>
                        <div><strong>Name:</strong> {formData.name || 'Not provided'}</div>
                        <div><strong>Code:</strong> {formData.regNumber || 'Not provided'}</div>
                        <div><strong>District:</strong> {formData.district}</div>
                        <div><strong>Contact:</strong> {formData.contactNumber}</div>
                        <div><strong>Official Email:</strong> {formData.email}</div>
                        <div><strong>Intake Capacity:</strong> {formData.studentCapacity} Students</div>
                        <div style={{ gridColumn: 'span 2' }}><strong>Trades:</strong> {formData.trades || 'None'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '24px' }}>
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }} 
                        required 
                      />
                      <label htmlFor="terms" style={{ color: '#475569', fontSize: '13px', lineHeight: '1.5', cursor: 'pointer' }}>
                        I certify that I am an authorized representative of <strong>{formData.name || 'this institute'}</strong>. The provided accreditation details, intake numbers, and trade information are accurate as per Maharashtra Skill Development & Employment Department guidelines.
                      </label>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="form-actions">
                  {currentStep > 1 && (
                    <button type="button" onClick={handlePrev} className="outline-btn">
                      Previous
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button type="button" onClick={handleNext} className="primary-btn next-btn">
                      Next Step <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button type="submit" className="primary-btn">
                      Complete Registration
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {successModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
              Registration Successful!
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#64748b' }}>
              <strong>{formData.name}</strong> ({instituteType}) is now registered on Maharashtra SkillBridge Portal.
            </p>

            <button 
              className="primary-btn full-width"
              style={{ padding: '12px', justifyContent: 'center' }}
              onClick={() => navigate('/institute/dashboard')}
            >
              Go to Institute Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteRegister;
