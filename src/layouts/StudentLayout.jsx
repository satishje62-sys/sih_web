import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, User, ClipboardList, Target, Briefcase, 
  BookOpen, Search, Bell, Menu, ArrowLeft, LogOut
} from 'lucide-react';
import { getCurrentUser, logoutUser } from '../utils/authStorage';
import './StudentLayout.css';

const StudentLayout = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser('student'));

  useEffect(() => {
    const handler = () => setCurrentUser(getCurrentUser('student'));
    window.addEventListener('skillbridge:authChanged', handler);
    return () => window.removeEventListener('skillbridge:authChanged', handler);
  }, []);

  const handleLogout = () => {
    logoutUser('student');
    navigate('/student/login');
  };

  const studentName = currentUser?.fullName || 'Priya Sharma';
  const subtitle = `${currentUser?.tradeBranch || 'Trainee'} • ${currentUser?.instituteName || 'Maharashtra ITI'}`;

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
          <NavLink to="/student/dashboard" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <ClipboardList size={18} /> Skill Assessment
          </NavLink>
          <NavLink to="/student/dashboard/jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Search size={18} /> Job and Internship Opportunity
          </NavLink>
          <NavLink to="/student/dashboard/industry-jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <Briefcase size={18} /> Industry Job Openings
          </NavLink>
          <NavLink to="/student/dashboard/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => window.innerWidth <= 1024 && setIsSidebarCollapsed(true)}>
            <User size={18} /> My Profile
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
          
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search courses, skills, job roles, companies..." />
          </div>

          <div className="header-actions" style={{ position: 'relative' }}>
            <button 
              className="icon-btn"
              onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileMenuOpen(false); setHelpOpen(false); }}
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
                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>Student Alerts</strong>
                  <span style={{ fontSize: '11px', color: '#2563eb', cursor: 'pointer' }}>Mark all read</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>Application Status: CNC Operator</div>
                    <div style={{ color: '#64748b' }}>ABC Industries shortlisted your profile for plant interview.</div>
                  </div>
                  <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>New Recommended Course</div>
                    <div style={{ color: '#64748b' }}>PLC & Industrial Automation module available.</div>
                  </div>
                </div>
              </div>
            )}

            <button 
              className="help-btn"
              onClick={() => { setHelpOpen(!helpOpen); setNotificationsOpen(false); setProfileMenuOpen(false); }}
            >
              <span className="help-icon">?</span> Help
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
                <strong style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: '#1e293b' }}>Student Career Helpline</strong>
                <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '6px', marginBottom: '8px' }}>
                  <div>📞 Student Support: <strong>1800-120-8040</strong></div>
                  <div>✉️ Email: <strong>students.skillbridge@maha.gov.in</strong></div>
                </div>
                <button 
                  className="primary-btn small full-width" 
                  style={{ background: '#2563eb', color: 'white', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                  onClick={() => setHelpOpen(false)}
                >
                  Close
                </button>
              </div>
            )}

            {/* Profile Dropdown */}
            <div 
              className="user-profile"
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationsOpen(false); setHelpOpen(false); }}
            >
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" alt="Student" className="avatar-img" />
              <div className="user-info">
                <span className="user-name" style={{ maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {studentName}
                </span>
                <span className="user-role">Student Portal ▾</span>
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
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{studentName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{subtitle}</div>
                </div>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => navigate('/')}
                >
                  <Home size={15} color="#2563eb" /> Go to Home Page
                </button>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => navigate('/student/dashboard/profile')}
                >
                  <User size={15} color="#16a34a" /> My Student Profile
                </button>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => navigate('/institute/login')}
                >
                  <BookOpen size={15} color="#2563eb" /> Switch to Institute Portal
                </button>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', color: '#334155', cursor: 'pointer', borderRadius: '6px' }}
                  onClick={() => navigate('/employer/login')}
                >
                  <Briefcase size={15} color="#ea580c" /> Switch to Employer Portal
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

export default StudentLayout;
