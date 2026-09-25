import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, MapPin, Phone, Mail, User, Calendar, Users, 
  GraduationCap, Briefcase, Award, PenTool, Edit, Save, Info,
  ChevronRight, BarChart2, Target, Settings, X
} from 'lucide-react';
import { getCurrentUser, updateUserProfile, DEMO_ACCOUNTS } from '../../utils/authStorage';
import './StudentProfile.css';

const StudentProfile = () => {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser('student') || DEMO_ACCOUNTS.student);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const handler = () => {
      const user = getCurrentUser('student');
      if (user) setCurrentUser(user);
    };
    window.addEventListener('skillbridge:authChanged', handler);
    return () => window.removeEventListener('skillbridge:authChanged', handler);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartEdit = () => {
    setEditForm({
      fullName: currentUser.fullName || '',
      email: currentUser.email || '',
      mobile: currentUser.mobile || currentUser.phone || '',
      educationLevel: currentUser.educationLevel || 'ITI',
      instituteName: currentUser.instituteName || '',
      tradeBranch: currentUser.tradeBranch || '',
      yearOfStudy: currentUser.yearOfStudy || '2',
      location: currentUser.location || 'Pune',
      dob: currentUser.dob || '15 Mar 2005',
      gender: currentUser.gender || 'Not specified'
    });
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e?.preventDefault();
    const res = updateUserProfile('student', editForm);
    if (res.success) {
      setCurrentUser(res.user);
      setIsEditing(false);
      showToast('✅ Student profile updated successfully!');
    }
  };

  const fullName = currentUser.fullName || 'Registered Student';
  const initials = fullName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'ST';
  const educationLevel = currentUser.educationLevel || 'ITI';
  const tradeBranch = currentUser.tradeBranch || 'Vocational Trade';
  const instituteName = currentUser.instituteName || 'Maharashtra Technical Institute';
  const location = currentUser.location || 'Maharashtra';
  const mobile = currentUser.mobile || currentUser.phone || 'Not specified';
  const email = currentUser.email || 'Not specified';
  const yearOfStudy = currentUser.yearOfStudy ? `${currentUser.yearOfStudy}${currentUser.yearOfStudy === '1' ? 'st' : currentUser.yearOfStudy === '2' ? 'nd' : 'rd'} Year` : '2nd Year';
  const dob = currentUser.dob || '15 Mar 2005';
  const gender = currentUser.gender || 'Female';
  const gradYear = currentUser.yearOfStudy === '1' ? '2026' : '2025';

  return (
    <div className="student-profile">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#1d4ed8',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {toastMessage}
        </div>
      )}
      
      {/* Top Profile Banner */}
      <div className="profile-banner">
        <div className="banner-left">
          <div className="profile-avatar-large" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
            color: 'white',
            fontWeight: 800,
            fontSize: '32px',
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            {initials}
          </div>
          <div className="profile-titles">
            <div className="name-row">
              <h1>{fullName}</h1>
              <span className="verified-badge"><CheckCircle2 size={14} /> Verified Student Profile</span>
            </div>
            <p className="student-type">{educationLevel} Student | {tradeBranch}</p>
            <div className="contact-row">
              <span className="contact-item"><MapPin size={14} /> {location}, Maharashtra</span>
              <span className="contact-item"><Phone size={14} /> {mobile}</span>
              <span className="contact-item"><Mail size={14} /> {email}</span>
            </div>
          </div>
        </div>

        <div className="banner-right">
          <div className="completion-box">
            <div className="completion-header">
              <span>Profile Completion</span>
              <span className="pct">90%</span>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar"><div className="progress blue" style={{width: '90%'}}></div></div>
            </div>
            <p className="completion-msg">Your verified profile is active for Maharashtra industrial recruitment.</p>
          </div>
          <button className="outline-btn with-icon" onClick={handleStartEdit}><Edit size={16} /> Edit Profile</button>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="left-column">
          
          <div className="info-card">
            <div className="card-header border-bottom">
              <div className="card-title">
                <User size={18} className="icon-blue" />
                <h3>Personal Information</h3>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label"><User size={14} /> Full Name</span>
                <span className="info-value">{fullName}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><MapPin size={14} /> District / City</span>
                <span className="info-value">{location}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><Calendar size={14} /> Date of Birth</span>
                <span className="info-value">{dob}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><Phone size={14} /> Contact Number</span>
                <span className="info-value">{mobile}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><Users size={14} /> Gender</span>
                <span className="info-value">{gender}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><Mail size={14} /> Official Email</span>
                <span className="info-value">{email}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header border-bottom">
              <div className="card-title">
                <GraduationCap size={18} className="icon-blue" />
                <h3>Education Information</h3>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label"><GraduationCap size={14} /> Education Level</span>
                <span className="info-value">{educationLevel}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><GraduationCap size={14} /> Trade / Diploma / Course</span>
                <span className="info-value">{tradeBranch}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><GraduationCap size={14} /> Institution Category</span>
                <span className="info-value">{educationLevel}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><Calendar size={14} /> Current Year of Study</span>
                <span className="info-value">{yearOfStudy}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label"><User size={14} /> Institute Name</span>
                <span className="info-value">{instituteName}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><Calendar size={14} /> Graduation Year</span>
                <span className="info-value">{gradYear}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><CheckCircle2 size={14} /> State Verification</span>
                <span className="info-value" style={{ color: '#059669', fontWeight: 600 }}>Active Trainee</span>
              </div>
            </div>
          </div>

          <div className="split-cards">
            <div className="info-card flex-1">
              <div className="card-header border-bottom">
                <div className="card-title">
                  <Target size={18} className="icon-blue" />
                  <h3>Career Preferences</h3>
                </div>
              </div>
              <div className="info-list">
                <div className="info-item stacked">
                  <span className="info-label"><Briefcase size={14} /> Preferred Job Role</span>
                  <span className="info-value">{tradeBranch} Technician / Operator</span>
                </div>
                <div className="info-item stacked">
                  <span className="info-label"><Briefcase size={14} /> Preferred Industry Sector</span>
                  <span className="info-value">Manufacturing & Automation</span>
                </div>
                <div className="info-item stacked">
                  <span className="info-label"><MapPin size={14} /> Preferred Location</span>
                  <span className="info-value">{location}, Maharashtra</span>
                </div>
              </div>
            </div>

            <div className="right-split">
              <div className="info-card mb-4">
                <div className="card-header border-bottom">
                  <div className="card-title">
                    <Award size={18} className="icon-blue" />
                    <h3>Certifications</h3>
                  </div>
                  <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>Verified</span>
                </div>
                <div className="certification-list">
                  <div className="cert-item">
                    <div className="cert-icon"><Award size={20} color="#3b82f6" /></div>
                    <div className="cert-details">
                      <span className="cert-name">{tradeBranch} (NCVT/MSBTE)</span>
                      <span className="cert-date">Maharashtra Skill Council • 2025</span>
                    </div>
                    <span className="cert-status verified"><CheckCircle2 size={12} /> Verified</span>
                  </div>
                  <div className="cert-item">
                    <div className="cert-icon"><Award size={20} color="#3b82f6" /></div>
                    <div className="cert-details">
                      <span className="cert-name">Industrial Safety & 5S Standard</span>
                      <span className="cert-date">National Safety Council • 2024</span>
                    </div>
                    <span className="cert-status verified"><CheckCircle2 size={12} /> Verified</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <div className="card-header border-bottom">
                  <div className="card-title">
                    <PenTool size={18} className="icon-blue" />
                    <h3>Practical Experience</h3>
                  </div>
                </div>
                <div className="experience-list">
                  <div className="exp-item">
                    <div className="exp-icon"><Calendar size={16} /></div>
                    <div className="exp-details">
                      <span className="exp-label">Duration</span>
                      <span className="exp-value">6 Months</span>
                    </div>
                  </div>
                  <div className="exp-item">
                    <div className="exp-icon"><PenTool size={16} /></div>
                    <div className="exp-details">
                      <span className="exp-label">Type</span>
                      <span className="exp-value">Workshop & Machine Training</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <div className="right-column">
          
          <div className="info-card">
            <div className="card-header border-bottom">
              <div className="card-title">
                <PenTool size={18} className="icon-blue" />
                <h3>Trade Skills</h3>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Curriculum Matched</span>
            </div>
            
            <div className="skills-tags-container">
              <span className="skill-tag green-border">{tradeBranch} Basics</span>
              <span className="skill-tag blue-border">Workshop Safety</span>
              <span className="skill-tag blue-border">Precision Measurement</span>
              <span className="skill-tag cyan-border">Machine Tools</span>
              <span className="skill-tag green-border">Quality Inspection</span>
            </div>

            <div className="card-header border-bottom mt-4">
              <div className="card-title">
                <BarChart2 size={18} className="icon-blue" />
                <h3>Evaluated Skill Level</h3>
              </div>
            </div>
            
            <div className="skill-bars-list">
              <div className="skill-bar-item">
                <span className="skill-name">{tradeBranch} Practical</span>
                <div className="bar-row">
                  <div className="progress-bar"><div className="progress blue" style={{width: '75%'}}></div></div>
                  <span className="skill-level intermediate">Proficient</span>
                  <span className="skill-pct">75%</span>
                </div>
              </div>
              <div className="skill-bar-item">
                <span className="skill-name">Workshop Safety & 5S</span>
                <div className="bar-row">
                  <div className="progress-bar"><div className="progress blue" style={{width: '85%'}}></div></div>
                  <span className="skill-level intermediate">Advanced</span>
                  <span className="skill-pct">85%</span>
                </div>
              </div>
              <div className="skill-bar-item">
                <span className="skill-name">Engineering Blueprint Reading</span>
                <div className="bar-row">
                  <div className="progress-bar"><div className="progress blue" style={{width: '65%'}}></div></div>
                  <span className="skill-level intermediate">Intermediate</span>
                  <span className="skill-pct">65%</span>
                </div>
              </div>
              <div className="skill-bar-item">
                <span className="skill-name">Digital Tools & Quality Audit</span>
                <div className="bar-row">
                  <div className="progress-bar"><div className="progress blue" style={{width: '55%'}}></div></div>
                  <span className="skill-level beginner">Beginner</span>
                  <span className="skill-pct">55%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header border-bottom">
              <div className="card-title">
                <Settings size={18} className="icon-blue" />
                <h3>Quick Actions</h3>
              </div>
            </div>
            <div className="quick-actions-container">
              <button className="primary-btn full-width mb-3" onClick={handleStartEdit}>
                <Edit size={16} /> Edit Profile
              </button>
              <button className="outline-btn full-width" onClick={() => showToast('✅ Student profile is saved and synchronized with Maharashtra State portal!')}>
                <Save size={16} /> Verify Sync
              </button>
              
              <div className="info-box mt-4">
                <Info size={16} className="info-icon" />
                <p>Keep your profile updated with your registered trade and phone number to receive direct interview invites from Maharashtra industries.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Edit Student Profile</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Update personal and academic credentials</p>
              </div>
              <button 
                onClick={() => setIsEditing(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Name</label>
                  <input 
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Registered Email</label>
                  <input 
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Mobile Number (Phone)</label>
                  <input 
                    type="text"
                    value={editForm.mobile}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Education Level</label>
                  <select
                    value={editForm.educationLevel}
                    onChange={(e) => setEditForm({ ...editForm, educationLevel: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="ITI">ITI (Industrial Training Institute)</option>
                    <option value="Polytechnic">Polytechnic (Diploma)</option>
                    <option value="Vocational / Other">Vocational / Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Year of Study</label>
                  <select
                    value={editForm.yearOfStudy}
                    onChange={(e) => setEditForm({ ...editForm, yearOfStudy: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year (Final)</option>
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Trade / Branch / Course</label>
                  <input 
                    type="text"
                    value={editForm.tradeBranch}
                    onChange={(e) => setEditForm({ ...editForm, tradeBranch: e.target.value })}
                    required
                    placeholder="e.g. Electrician, Fitter, CNC Operator, Mechanical"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Institute Name</label>
                  <input 
                    type="text"
                    value={editForm.instituteName}
                    onChange={(e) => setEditForm({ ...editForm, instituteName: e.target.value })}
                    required
                    placeholder="e.g. Government ITI Pune, Chakan"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>District / Location</label>
                  <input 
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Date of Birth</label>
                  <input 
                    type="text"
                    value={editForm.dob}
                    onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                    placeholder="e.g. 15 Mar 2005"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
