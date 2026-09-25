import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Briefcase, Lock } from 'lucide-react';
import { registerEmployer } from '../../utils/authStorage';
import '../institute/InstituteRegister.css'; // Reusing matching layout styles

const MAHARASHTRA_DISTRICTS = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad (Chhatrapati Sambhajinagar)", "Beed", "Bhandara", "Buldhana", 
  "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", 
  "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
  "Nandurbar", "Nashik", "Osmanabad (Dharashiv)", "Palghar", "Parbhani", "Pune", "Raigad", 
  "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", 
  "Washim", "Yavatmal"
];

const SECTORS = [
  "Manufacturing & Heavy Engineering",
  "Automotive & Electric Vehicles (EV)",
  "Information Technology (IT) & Electronics",
  "Construction & Infrastructure",
  "Renewable Energy & Power",
  "Chemicals & Pharmaceuticals",
  "Logistics & Supply Chain",
  "Textiles & Garments"
];

const IndustryRegister = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  // Form State
  const [form, setForm] = useState({
    companyName: '',
    regNumber: '',
    sector: 'Manufacturing & Heavy Engineering',
    district: 'Pune',
    industrialArea: '',
    officialEmail: '',
    password: '',
    confirmPassword: '',
    address: '',
    contactPerson: '',
    contactNumber: '',
    website: '',
    
    // Step 2: Hiring & Requirements
    hiringRoles: '',
    requiredSkills: '',
    qualification: 'ITI / Diploma',
    openingsCount: '25',
    employmentType: 'Full-Time',

    // Step 3: Industry Feedback
    difficultSkills: '',
    curriculumSuggestions: '',
    offerApprenticeship: true
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!form.companyName.trim()) {
        setErrorMessage('Please enter your Company Name.');
        return;
      }
      if (!form.regNumber.trim()) {
        setErrorMessage('Please enter Company Registration / CIN / GSTIN / Udyam Number.');
        return;
      }
      if (!form.industrialArea.trim()) {
        setErrorMessage('Please enter the Industrial Area / MIDC location.');
        return;
      }
      if (!form.officialEmail.trim() || !form.officialEmail.includes('@')) {
        setErrorMessage('Please enter a valid official company email.');
        return;
      }
      if (!form.contactPerson.trim()) {
        setErrorMessage('Please enter the HR or authorized contact person name.');
        return;
      }
      if (!form.contactNumber.trim()) {
        setErrorMessage('Please enter a valid contact phone number.');
        return;
      }
      if (!form.password || form.password.length < 6) {
        setErrorMessage('Please create a password with at least 6 characters.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    } else if (currentStep === 2) {
      if (!form.hiringRoles.trim()) {
        setErrorMessage('Please specify the job roles currently hiring.');
        return;
      }
      if (!form.requiredSkills.trim()) {
        setErrorMessage('Please enter required skills for candidates.');
        return;
      }
      if (!form.openingsCount || Number(form.openingsCount) <= 0) {
        setErrorMessage('Please specify number of vacancies.');
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
      setErrorMessage('Please accept the Terms & Conditions.');
      return;
    }

    const regResult = registerEmployer(form);
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
          <Link to="/employer/login">Employer Login</Link>
          <Link to="/institute/login">Institute Portal</Link>
        </nav>
      </header>

      <main className="register-main">
        <div className="register-container">
          <Link to="/employer/login" className="back-link">
            <ArrowLeft size={16} /> Back to Login
          </Link>
          
          <div className="register-header">
            <h1>Employer & Industry Registration</h1>
            <p>Connect with Maharashtra Government ITIs & Polytechnics, hire pre-assessed talent, and post job vacancies.</p>
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
            {/* Steps Sidebar */}
            <div className="steps-sidebar">
              <div className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-circle">1</div>
                <span>Company Information</span>
              </div>
              <div className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-circle">2</div>
                <span>Hiring Requirements</span>
              </div>
              <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span>Feedback & Submit</span>
              </div>
            </div>

            {/* Form Area */}
            <div className="form-area">
              <form onSubmit={handleSubmit} className="multi-step-form">
                
                {/* STEP 1: COMPANY INFORMATION */}
                {currentStep === 1 && (
                  <>
                    <h2 className="step-title">1. Company & Location Information</h2>
                    <div className="form-grid">
                      <div className="input-group full-width">
                        <label>Company / Enterprise Name *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. ABC Precision Technologies Pvt. Ltd." 
                          value={form.companyName}
                          onChange={(e) => handleChange('companyName', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>CIN / Udyam / GSTIN Number *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 27AABCT1234F1Z5 / UDYAM-MH-26-00123" 
                          value={form.regNumber}
                          onChange={(e) => handleChange('regNumber', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Industry Sector *</label>
                        <select 
                          value={form.sector} 
                          onChange={(e) => handleChange('sector', e.target.value)}
                          required
                        >
                          {SECTORS.map(sec => (
                            <option key={sec} value={sec}>{sec}</option>
                          ))}
                        </select>
                      </div>

                      <div className="input-group">
                        <label>District *</label>
                        <select 
                          value={form.district} 
                          onChange={(e) => handleChange('district', e.target.value)}
                          required
                        >
                          {MAHARASHTRA_DISTRICTS.map(district => (
                            <option key={district} value={district}>{district}</option>
                          ))}
                        </select>
                      </div>

                      <div className="input-group">
                        <label>Industrial Area / MIDC Location *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Chakan MIDC Phase 2, Pune" 
                          value={form.industrialArea}
                          onChange={(e) => handleChange('industrialArea', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Official HR / Company Email *</label>
                        <input 
                          type="email" 
                          placeholder="careers@abcindustries.com" 
                          value={form.officialEmail}
                          onChange={(e) => handleChange('officialEmail', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Contact Person (HR / Plant Head) *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Rahul Deshmukh" 
                          value={form.contactPerson}
                          onChange={(e) => handleChange('contactPerson', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Contact Phone Number *</label>
                        <input 
                          type="tel" 
                          placeholder="e.g. 9823012345" 
                          value={form.contactNumber}
                          onChange={(e) => handleChange('contactNumber', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Company Website (Optional)</label>
                        <input 
                          type="url" 
                          placeholder="https://www.abcindustries.com" 
                          value={form.website}
                          onChange={(e) => handleChange('website', e.target.value)}
                        />
                      </div>

                      <div className="input-group full-width">
                        <label>Complete Plant / Registered Address *</label>
                        <input 
                          type="text" 
                          placeholder="Plot No., Industrial Zone, Taluka, PIN Code" 
                          value={form.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Create Login Password *</label>
                        <input 
                          type="password" 
                          placeholder="Minimum 6 characters" 
                          value={form.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                        />
                      </div>

                      <div className="input-group">
                        <label>Confirm Password *</label>
                        <input 
                          type="password" 
                          placeholder="Confirm password" 
                          value={form.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2: HIRING REQUIREMENTS */}
                {currentStep === 2 && (
                  <>
                    <h2 className="step-title">2. Immediate Hiring & Skill Requirements</h2>
                    <div className="form-grid">
                      <div className="input-group full-width">
                        <label>Job Roles Currently Hiring *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. CNC Operator, PLC Maintenance Technician, Quality Inspector, Welder" 
                          value={form.hiringRoles}
                          onChange={(e) => handleChange('hiringRoles', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group full-width">
                        <label>Key Required Technical Skills *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. CNC Programming, G-Code, Machine Tool Setting, Wiring Diagram Reading" 
                          value={form.requiredSkills}
                          onChange={(e) => handleChange('requiredSkills', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Target Qualification *</label>
                        <select 
                          value={form.qualification} 
                          onChange={(e) => handleChange('qualification', e.target.value)}
                          required
                        >
                          <option value="ITI">ITI Passout</option>
                          <option value="Diploma">Polytechnic Diploma</option>
                          <option value="ITI / Diploma">Both ITI & Diploma</option>
                          <option value="B.E. / B.Tech">Degree Engineers</option>
                        </select>
                      </div>

                      <div className="input-group">
                        <label>Number of Immediate Vacancies *</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 25" 
                          value={form.openingsCount}
                          onChange={(e) => handleChange('openingsCount', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label>Employment Engagement *</label>
                        <select 
                          value={form.employmentType} 
                          onChange={(e) => handleChange('employmentType', e.target.value)}
                        >
                          <option value="Full-Time">Full-Time Permanent</option>
                          <option value="Apprenticeship">Govt Apprenticeship (NAPS)</option>
                          <option value="Internship">Paid Technical Internship</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 3: INDUSTRY FEEDBACK & REVIEW */}
                {currentStep === 3 && (
                  <>
                    <h2 className="step-title">3. Industry Feedback & Verification</h2>
                    <div className="form-grid">
                      <div className="input-group full-width">
                        <label>Skills that are difficult to find in fresh graduates *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Practical shop-floor troubleshooting, 5S, measurement instruments (Micrometer/Vernier)" 
                          value={form.difficultSkills}
                          onChange={(e) => handleChange('difficultSkills', e.target.value)}
                          required 
                        />
                      </div>

                      <div className="input-group full-width">
                        <label>Recommended Training / Curriculum Improvements</label>
                        <textarea 
                          placeholder="What training modules should ITIs/Polytechnics add to make trainees job-ready?" 
                          rows="3"
                          value={form.curriculumSuggestions}
                          onChange={(e) => handleChange('curriculumSuggestions', e.target.value)}
                        ></textarea>
                      </div>

                      <div className="input-group full-width" style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="checkbox" 
                            id="offerAppr"
                            checked={form.offerApprenticeship}
                            onChange={(e) => handleChange('offerApprenticeship', e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <label htmlFor="offerAppr" style={{ margin: 0, fontSize: '13px', cursor: 'pointer' }}>
                            We are interested in signing Industry-Institute MoUs for Apprenticeships or Guest Lectures.
                          </label>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', margin: '20px 0' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1e293b' }}>Summary of Company Registration</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                        <div><strong>Company:</strong> {form.companyName || 'N/A'}</div>
                        <div><strong>Sector:</strong> {form.sector}</div>
                        <div><strong>District:</strong> {form.district} ({form.industrialArea})</div>
                        <div><strong>Email:</strong> {form.officialEmail}</div>
                        <div><strong>Contact Person:</strong> {form.contactPerson} ({form.contactNumber})</div>
                        <div><strong>Hiring Vacancies:</strong> {form.openingsCount} Openings ({form.qualification})</div>
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
                        I certify that I am an authorized representative of <strong>{form.companyName || 'the registered enterprise'}</strong>. All registration and vacancy details are legitimate for hiring candidates from Maharashtra institutes.
                      </label>
                    </div>
                  </>
                )}

                {/* Form Navigation Buttons */}
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
                      Complete Employer Registration
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
            maxWidth: '500px',
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
              Employer Registered Successfully!
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#64748b' }}>
              Welcome, <strong>{form.companyName}</strong>. Your enterprise account is now active. You can now post jobs and connect directly with Maharashtra ITIs & Polytechnics.
            </p>

            <button 
              className="primary-btn full-width"
              style={{ padding: '12px', justifyContent: 'center' }}
              onClick={() => navigate('/employer/dashboard')}
            >
              Go to Employer Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryRegister;
