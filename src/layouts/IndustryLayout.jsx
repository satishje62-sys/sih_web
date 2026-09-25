import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, Building2, Briefcase, Target, LineChart, 
  Lightbulb, MessageSquare, Users, Award, 
  FileText, Settings, Bell, HelpCircle, Search, Menu, ArrowLeft, LogOut
} from 'lucide-react';
import { getCurrentUser, logoutUser } from '../utils/authStorage';
import './IndustryLayout.css';

const IndustryLayout = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser('employer'));

  useEffect(() => {
    const handler = () => setCurrentUser(getCurrentUser('employer'));
    window.addEventListener('skillbridge:authChanged', handler);
    return () => window.removeEventListener('skillbridge:authChanged', handler);
  }, []);

  const handleLogout = () => {
    logoutUser('employer');
    navigate('/employer/login');
  };

  const companyName = currentUser?.companyName || 'Registered Employer';
  const initials = companyName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'EM';
  const sector = currentUser?.sector || 'Industrial Sector';
  const regNumber = currentUser?.regNumber || 'Registered Partner';

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header" onClick={() => navigate('/')}>
          <div className="sidebar-logo">
            <img src="/images/logo.png" alt="SkillBridge Logo" className="logo-image" style={{ height: '40px' }} />
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/employer/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Building2 size={18} /> Company Profile
          </NavLink>
          <NavLink to="/employer/dashboard/jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Briefcase size={18} /> Job Openings
          </NavLink>
          <NavLink to="/employer/dashboard/skill-gap" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <MessageSquare size={18} /> Skill Gap Feedback
          </NavLink>
          <NavLink to="/employer/dashboard/collaboration" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Users size={18} /> Institute Collaboration
          </NavLink>
          
          <div className="nav-divider"></div>
          
          <NavLink to="/employer/dashboard/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="gov-seal">
            <div className="building-silhouette-small"></div>
            <p>महाराष्ट्र शासन</p>
            <p className="gov-dept">कौशल्य, रोजगार, उद्योजकता</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-area">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <ArrowLeft 
              size={24} 
              className="back-arrow" 
              onClick={() => navigate(-1)} 
              style={{ cursor: 'pointer', color: '#64748b', marginRight: '16px' }}
            />
            <Menu 
              size={24} 
              className="menu-toggle" 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
            />
            <div className="gov-logo" style={{display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px'}}>
              <img src="/images/mah-gov-logo.svg" alt="Gov Logo" style={{height: '32px'}} />
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#1e293b'}}>Maharashtra Government</span>
                <span style={{fontSize: '11px', color: '#64748b'}}>Skill Development & Employment Department</span>
              </div>
            </div>
          </div>
          
          <div className="search-bar" style={{flex: 1, maxWidth: '500px', marginLeft: '24px'}}>
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search job roles, skills, institutes, or industry needs..." />
          </div>

          <div className="header-actions" style={{ position: 'relative' }}>
            {/* Notification Button */}
            <button 
              className="icon-btn" 
              onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileMenuOpen(false); setHelpOpen(false); }}
            >
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '120px',
                marginTop: '10px',
                width: '320px',
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                padding: '12px',
                zIndex: 100
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>Recent Notifications</strong>
                  <span style={{ fontSize: '11px', color: '#2563eb', cursor: 'pointer' }}>Mark all read</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>New Collaboration Request</div>
                    <div style={{ color: '#64748b' }}>Government ITI Pune requested Apprenticeship partnership.</div>
                  </div>
                  <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>Job Applications</div>
                    <div style={{ color: '#64748b' }}>12 student candidates applied for CNC Machine Operator.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Button */}
            <button 
              className="icon-btn text-btn" 
              onClick={() => { setHelpOpen(!helpOpen); setNotificationsOpen(false); setProfileMenuOpen(false); }}
            >
              <HelpCircle size={20} />
              <span>Help</span>
            </button>

            {helpOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '70px',
                marginTop: '10px',
                width: '280px',
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                padding: '14px',
                zIndex: 100,
                fontSize: '12px'
              }}>
                <strong style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#1e293b' }}>Need Assistance?</strong>
                <p style={{ margin: '0 0 8px 0', color: '#64748b' }}>Maharashtra Skill Development Employer Helpdesk:</p>
                <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '6px', marginBottom: '8px' }}>
                  <div>📞 Toll Free: <strong>1800-120-8040</strong></div>
                  <div>✉️ Email: <strong>employer.support@maha.gov.in</strong></div>
                </div>
                <button className="primary-btn small full-width" onClick={() => setHelpOpen(false)}>Close</button>
              </div>
            )}

            {/* User Profile Dropdown */}
            <div 
              className="user-profile" 
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationsOpen(false); setHelpOpen(false); }}
            >
              <div className="avatar" style={{ backgroundColor: '#0284c7', color: 'white', fontWeight: '700' }}>
                {initials}
              </div>
              <div className="user-info">
                <span className="user-name" style={{ maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {companyName}
                </span>
                <span className="user-role">Employer Portal ▾</span>
              </div>
            </div>

            {profileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '10px',
                width: '260px',
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                padding: '8px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{companyName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>CIN: {regNumber}</div>
                  <div style={{ fontSize: '11px', color: '#0369a1', marginTop: '2px' }}>{sector}</div>
                </div>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => navigate('/')}
                >
                  <Home size={15} color="#2563eb" /> Go to Home Page
                </button>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => navigate('/institute/login')}
                >
                  <Building2 size={15} color="#16a34a" /> Switch to Institute Portal
                </button>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => navigate('/student/login')}
                >
                  <Users size={15} color="#9333ea" /> Switch to Student Portal
                </button>
                <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }}></div>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#dc2626', fontWeight: '600', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={handleLogout}
                >
                  <LogOut size={15} color="#dc2626" /> Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default IndustryLayout;
