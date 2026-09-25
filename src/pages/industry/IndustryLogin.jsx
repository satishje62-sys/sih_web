import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { loginEmployer, DEMO_ACCOUNTS } from '../../utils/authStorage';
import { AlertCircle, Eye, EyeOff, Sparkles, Building2 } from 'lucide-react';
import '../institute/InstituteLogin.css';

const LeftPanel = () => (
  <div className="institute-left-panel">
    <p className="gov-text">MAHARASHTRA GOVERNMENT</p>
    <h1 className="auth-title">Skill Development Platform</h1>
    <p className="auth-subtitle">Bridging industry demand with skilled talent for a stronger Maharashtra.</p>
    
    <div className="auth-desc" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#2b5ee8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" style={{marginBottom: '0.5rem'}}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <p style={{fontSize: '0.875rem'}}>Real-time industry insights</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#2b5ee8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" style={{marginBottom: '0.5rem'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <p style={{fontSize: '0.875rem'}}>Skill gap analysis</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#2b5ee8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32" style={{marginBottom: '0.5rem'}}><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
        <p style={{fontSize: '0.875rem'}}>Better workforce for tomorrow</p>
      </div>
    </div>
    
    <div className="auth-illustration">
      <div className="building-silhouette"></div>
    </div>
  </div>
);

const IndustryLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // If redirected by ProtectedRoute
  const redirectMessage = location.state?.authRequiredMessage;

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Company CIN, Official Email, or Registered Phone Number.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = loginEmployer(identifier, password);
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    // Success - navigate to employer dashboard
    navigate('/employer/dashboard');
  };

  const handleFillDemo = (accountKey = 'employer') => {
    const acc = DEMO_ACCOUNTS[accountKey];
    if (acc) {
      setIdentifier(acc.officialEmail);
      setPassword(acc.password);
      setErrorMessage('');
    }
  };

  return (
    <AuthLayout leftPanelContent={<LeftPanel />}>
      <div className="login-form-wrapper">
        <div className="form-header">
          <div className="form-icon-circle">
            <Building2 size={24} />
          </div>
          <h2>Industry / Employer Login</h2>
          <p>Share skill demands, recruit ITI & Polytechnic talent, and post jobs</p>
        </div>

        {/* Protected route warning */}
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

        {/* Error message alert */}
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
            gap: '8px',
            lineHeight: '1.4'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Demo Fill Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '1.25rem',
          fontSize: '12px',
          color: '#0369a1',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
            <Sparkles size={14} color="#0284c7" />
            <span>Registered Demo Employer Accounts:</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('employer')}
              style={{
                background: '#ffffff',
                border: '1px solid #0284c7',
                color: '#0284c7',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Demo: Tata Motors (info@tatamotors.com)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('employerSecondary')}
              style={{
                background: '#ffffff',
                border: '1px solid #0284c7',
                color: '#0284c7',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Demo: ABC Industries (hr@abcindustries.com)
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Company CIN / Registration No. / Official Email / Phone" 
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setErrorMessage(''); }}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                required 
              />
              <span 
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
              <span>Remember Me</span>
            </label>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('For demo: Use password "password123" for registered accounts.'); }} className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="submit-btn primary-btn">Login to Employer Portal</button>
        </form>

        <div className="form-footer">
          <p>New Industry Partner?</p>
          <Link to="/employer/register" className="outline-btn">Register Your Company</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default IndustryLogin;
