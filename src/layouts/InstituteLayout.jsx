import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, Building2, BookOpen, Settings, BarChart2, 
  Target, Users, Lightbulb, Bell, Search, Menu, ArrowLeft, Briefcase, LogOut
} from 'lucide-react';
import { getCurrentUser, logoutUser } from '../utils/authStorage';
import './InstituteLayout.css';

const InstituteLayout = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser('institute'));

  useEffect(() => {
    const handler = () => setCurrentUser(getCurrentUser('institute'));
    window.addEventListener('skillbridge:authChanged', handler);
    return () => window.removeEventListener('skillbridge:authChanged', handler);
  }, []);

  const handleLogout = () => {
    logoutUser('institute');
    navigate('/institute/login');
  };

  const instituteName = currentUser?.name || 'Registered Institute';
  const initials = instituteName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'IN';
  const district = currentUser?.district ? `${currentUser.district}, Maharashtra` : 'Maharashtra';
  const regNumber = currentUser?.regNumber || 'Affiliated ITI/Polytechnic';

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
          <div className="nav-group-title">Institute Dashboard</div>
          <NavLink to="/institute/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Building2 size={18} /> Institute Profile
          </NavLink>
          <NavLink to="/institute/dashboard/industry-jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Briefcase size={18} /> Industry Job Openings
          </NavLink>
          <NavLink to="/institute/dashboard/courses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <BookOpen size={18} /> Courses & Curriculum
          </NavLink>
          <NavLink to="/institute/dashboard/skill-gap" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Target size={18} /> Skill Gap & Alignment
          </NavLink>
          <NavLink to="/institute/dashboard/collaboration" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Users size={18} /> Industry Collaboration
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="gov-seal">
             <img src="/images/mah-gov-logo.svg" alt="Gov Logo" style={{height: '24px', opacity: 0.5, marginBottom: '8px'}} />
            <p style={{fontSize: '11px', color: '#64748b', fontWeight: '500', marginBottom: '2px'}}>Government of Maharashtra</p>
            <p className="gov-dept" style={{fontSize: '10px', color: '#94a3b8'}}>Skill Development & Employment Department</p>
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
          </div>
          
          <div className="search-bar" style={{flex: 1, maxWidth: '500px', marginLeft: '24px'}}>
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search courses, skills, industries..." />
          </div>

          <div className="header-actions" style={{ position: 'relative' }}>
            <button 
              className="icon-btn"
              onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileMenuOpen(false); }}
            >
              <Bell size={20} />
              <span className="notification-badge">2</span>
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
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>Institute Notifications</strong>
                  <span style={{ fontSize: '11px', color: '#2563eb', cursor: 'pointer' }}>Mark all read</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>New Job Posted by ABC Industries</div>
                    <div style={{ color: '#64748b' }}>Urgent requirement for 50 CNC Machine Operators.</div>
                  </div>
                  <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>Collaboration MoU Signed</div>
                    <div style={{ color: '#64748b' }}>Tata Motors approved dual apprenticeship for 25 trainees.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Dropdown */}
            <div 
              className="user-profile"
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationsOpen(false); }}
            >
              <div className="avatar" style={{ backgroundColor: '#2563eb', color: 'white', fontWeight: '700' }}>
                {initials}
              </div>
              <div className="user-info">
                <span className="user-name" style={{ maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {instituteName}
                </span>
                <span className="user-role">Institute Portal ▾</span>
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
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{instituteName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{district} • {regNumber}</div>
                </div>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => navigate('/')}
                >
                  <Home size={15} color="#2563eb" /> Go to Home Page
                </button>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => navigate('/employer/login')}
                >
                  <Building2 size={15} color="#16a34a" /> Switch to Employer Portal
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

export default InstituteLayout;
