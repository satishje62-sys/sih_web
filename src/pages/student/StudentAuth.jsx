import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginStudent, registerStudent, DEMO_ACCOUNTS } from '../../utils/authStorage';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles, User, ArrowRight } from 'lucide-react';
import './StudentAuth.css';
import '../../layouts/AuthLayout.css';

const MAHARASHTRA_DISTRICTS = [
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", 
  "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", 
  "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
  "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", 
  "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", 
  "Washim", "Yavatmal"
];

const StudentAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    educationLevel: 'ITI',
    instituteName: '',
    tradeBranch: '',
    yearOfStudy: '2',
    location: 'Pune',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // If redirected by ProtectedRoute
  const redirectMessage = location.state?.authRequiredMessage;

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your registered Email or Mobile Number.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = loginStudent(loginIdentifier, loginPassword);
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    // Success - navigate to student dashboard
    navigate('/student/dashboard');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!registerData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!registerData.instituteName.trim()) {
      setErrorMessage('Please enter your institute name.');
      return;
    }
    if (!registerData.tradeBranch.trim()) {
      setErrorMessage('Please enter your trade or diploma branch.');
      return;
    }
    if (!registerData.email.trim() || !registerData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!registerData.password || registerData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const res = registerStudent(registerData);
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    setSuccessMessage('Registration successful! Redirecting to student dashboard...');
    setTimeout(() => {
      navigate('/student/dashboard');
    }, 800);
  };

  const handleFillDemo = () => {
    const acc = DEMO_ACCOUNTS.student;
    if (acc) {
      setLoginIdentifier(acc.email);
      setLoginPassword(acc.password);
      setErrorMessage('');
    }
  };

  return (
    <div className="student-auth-layout">
      {/* Top Navigation */}
      <header className="auth-header">
        <div className="auth-logo" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="SkillBridge Logo" className="logo-image" style={{ height: '40px' }} />
        </div>
        <nav className="auth-nav">
          <Link to="/">Home</Link>
          <Link to="/institute/login">Institute Portal</Link>
          <Link to="/employer/login">Employer Portal</Link>
        </nav>
      </header>

      <div className="student-auth-main">
        {/* Left Panel */}
        <div className="student-left-panel">
          <h1 className="student-hero-title">Bridge Your <span>Skills</span><br />to Your <span>Career</span></h1>
          <p className="student-hero-desc">Know what industries need. Identify your skill gap.<br/>Build the right career path.</p>

          <div className="student-journey">
            <div className="journey-step">
              <div className="journey-icon student-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <h4>Student</h4>
              <p>Your Journey Starts Here</p>
            </div>
            <svg className="journey-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <div className="journey-step">
              <div className="journey-icon skills-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></div>
              <h4>Skills</h4>
              <p>Know What You Have</p>
            </div>
            <svg className="journey-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <div className="journey-step">
              <div className="journey-icon industry-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg></div>
              <h4>Industry</h4>
              <p>See What They Need</p>
            </div>
            <svg className="journey-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <div className="journey-step">
              <div className="journey-icon job-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
              <h4>Job</h4>
              <p>Build Your Future</p>
            </div>
          </div>

          <div className="student-illustration-bg">
            <div className="student-features">
              <div className="feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg> Real Industry Data</div>
              <div className="feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Personalized Guidance</div>
              <div className="feature"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg> Better Career Decisions</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="student-right-panel">
          <div className="student-form-container">
            {/* Protected route redirect message */}
            {redirectMessage && (
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#b45309',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{redirectMessage}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </div>
            )}

            {isLogin ? (
              <>
                <div className="form-header-student">
                  <h2>Welcome Back!</h2>
                  <p>Login to your SkillBridge Student Portal</p>
                </div>

                <div className="auth-tabs">
                  <button 
                    type="button" 
                    className="tab active" 
                    onClick={() => { setIsLogin(true); setErrorMessage(''); }}
                  >
                    Login
                  </button>
                  <button 
                    type="button" 
                    className="tab" 
                    onClick={() => { setIsLogin(false); setErrorMessage(''); }}
                  >
                    Register
                  </button>
                </div>

                {/* Demo Helper Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  marginBottom: '1.25rem',
                  fontSize: '12px',
                  color: '#0369a1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <Sparkles size={14} color="#0284c7" />
                    <span>Demo: Priya Sharma</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #0284c7',
                      color: '#0284c7',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Fill Demo Credentials
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="student-form">
                  <div className="input-group">
                    <label>Email or Mobile Number</label>
                    <div className="input-icon-wrapper">
                      <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
                      <input 
                        type="text" 
                        placeholder="e.g. priya.sharma@gmail.com or 9876543210" 
                        value={loginIdentifier}
                        onChange={(e) => { setLoginIdentifier(e.target.value); setErrorMessage(''); }}
                        required 
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <div className="input-icon-wrapper">
                      <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                      <input 
                        type={showLoginPassword ? 'text' : 'password'} 
                        placeholder="Enter your password" 
                        value={loginPassword}
                        onChange={(e) => { setLoginPassword(e.target.value); setErrorMessage(''); }}
                        required 
                      />
                      <span 
                        className="input-icon-right"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        style={{ cursor: 'pointer' }}
                        title={showLoginPassword ? 'Hide password' : 'Show password'}
                      >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </div>

                  <div className="form-options">
                    <label className="remember-me">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      /> 
                      <span>Remember me</span>
                    </label>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo password is "password123"'); }} className="forgot-password">
                      Forgot password?
                    </a>
                  </div>

                  <button type="submit" className="primary-btn submit-btn">Login to Student Dashboard →</button>

                  <p className="switch-auth">Don't have an account? <span onClick={() => { setIsLogin(false); setErrorMessage(''); }}>Create Account →</span></p>
                </form>
              </>
            ) : (
              <>
                <div className="form-header-student">
                  <h2>Create Student Account</h2>
                  <p>Join SkillBridge to bridge your skills with industry demand.</p>
                </div>

                <div className="auth-tabs">
                  <button 
                    type="button" 
                    className="tab" 
                    onClick={() => { setIsLogin(true); setErrorMessage(''); }}
                  >
                    Login
                  </button>
                  <button 
                    type="button" 
                    className="tab active" 
                    onClick={() => { setIsLogin(false); setErrorMessage(''); }}
                  >
                    Register
                  </button>
                </div>

                <form onSubmit={handleRegisterSubmit} className="student-form register">
                  <div className="input-group">
                    <label>Full Name *</label>
                    <div className="input-icon-wrapper">
                      <span className="input-icon"><User size={18} /></span>
                      <input 
                        type="text" 
                        name="fullName" 
                        value={registerData.fullName} 
                        onChange={handleRegisterChange} 
                        placeholder="e.g. Ramesh Deshmukh" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Education Level *</label>
                    <div className="input-icon-wrapper">
                      <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></span>
                      <select name="educationLevel" value={registerData.educationLevel} onChange={handleRegisterChange} required>
                        <option value="ITI">ITI (Industrial Training Institute)</option>
                        <option value="Polytechnic">Polytechnic (Engineering Diploma)</option>
                        <option value="BTech">B.Tech / Degree</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Institute Name *</label>
                    <div className="input-icon-wrapper">
                      <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
                      <input 
                        type="text" 
                        name="instituteName" 
                        value={registerData.instituteName} 
                        onChange={handleRegisterChange} 
                        placeholder="e.g. Government ITI Pune, Chakan" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Trade / Diploma Branch *</label>
                    <div className="input-icon-wrapper">
                      <span className="input-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span>
                      <input 
                        type="text" 
                        name="tradeBranch" 
                        value={registerData.tradeBranch} 
                        onChange={handleRegisterChange} 
                        placeholder="e.g. Fitter, Electrician, CNC Operator" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="input-group">
                      <label>Year of Study</label>
                      <select name="yearOfStudy" value={registerData.yearOfStudy} onChange={handleRegisterChange} required>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="passout">Passout / Graduated</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label>District in Maharashtra</label>
                      <select name="location" value={registerData.location} onChange={handleRegisterChange} required>
                        {MAHARASHTRA_DISTRICTS.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="input-group">
                      <label>Mobile Number *</label>
                      <input 
                        type="tel" 
                        name="mobile" 
                        value={registerData.mobile} 
                        onChange={handleRegisterChange} 
                        placeholder="e.g. 9876543210" 
                        required 
                      />
                    </div>
                    <div className="input-group">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={registerData.email} 
                        onChange={handleRegisterChange} 
                        placeholder="e.g. ramesh@gmail.com" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="input-group">
                      <label>Create Password *</label>
                      <input 
                        type={showRegisterPassword ? 'text' : 'password'} 
                        name="password" 
                        value={registerData.password} 
                        onChange={handleRegisterChange} 
                        placeholder="Min 6 characters" 
                        minLength={6} 
                        required 
                      />
                    </div>
                    <div className="input-group">
                      <label>Confirm Password *</label>
                      <input 
                        type={showRegisterPassword ? 'text' : 'password'} 
                        name="confirmPassword" 
                        value={registerData.confirmPassword} 
                        onChange={handleRegisterChange} 
                        placeholder="Confirm password" 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontSize: '12px', color: '#64748b' }}>
                    <input 
                      type="checkbox" 
                      id="showPassReg" 
                      checked={showRegisterPassword} 
                      onChange={(e) => setShowRegisterPassword(e.target.checked)} 
                    />
                    <label htmlFor="showPassReg" style={{ cursor: 'pointer' }}>Show Passwords</label>
                  </div>

                  <button type="submit" className="primary-btn submit-btn" style={{marginTop: '0.5rem'}}>
                    Complete Registration & Open Dashboard →
                  </button>
                  <p className="switch-auth">Already have an account? <span onClick={() => { setIsLogin(true); setErrorMessage(''); }}>Login →</span></p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAuth;
