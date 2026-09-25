import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { loginInstitute, DEMO_ACCOUNTS } from '../../utils/authStorage';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles, Building2 } from 'lucide-react';
import './InstituteLogin.css';

const LeftPanel = () => (
  <div className="institute-left-panel">
    <p className="gov-text">MAHARASHTRA GOVERNMENT</p>
    <h1 className="auth-title">SkillConnect</h1>
    <p className="auth-subtitle">Connecting Students | Training Institutes | Industries</p>
    <p className="auth-desc">Building a skilled Maharashtra for a stronger tomorrow.</p>
    
    <div className="auth-illustration">
      <div className="building-silhouette"></div>
    </div>
  </div>
);

const InstituteLogin = () => {
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
      setErrorMessage('Please enter your Institute ID, Code, or Email.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = loginInstitute(identifier, password);
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    // Success - navigate to institute dashboard
    navigate('/institute/dashboard');
  };

  const handleFillDemo = (accountKey = 'institute') => {
    const acc = DEMO_ACCOUNTS[accountKey];
    if (acc) {
      setIdentifier(acc.email);
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
          <h2>Institute Dashboard Login</h2>
          <p>Sign in to manage institute courses, trade capacity & skill data</p>
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
            <span>Registered Demo Institute Accounts:</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('institute')}
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
              Demo: Govt ITI Pune (principal@itipune.ac.in)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('instituteSecondary')}
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
              Demo: Shree Ganesh ITI (principal@sgiti.ac.in)
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <input 
                type="text" 
                placeholder="Institute ID / DGT Code / Official Email" 
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

          <button type="submit" className="submit-btn primary-btn">Login to Institute Portal</button>
        </form>

        <div className="form-footer">
          <p>New Institute?</p>
          <Link to="/institute/register" className="outline-btn">Register Your Institute</Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default InstituteLogin;
