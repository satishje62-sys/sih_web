import React, { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle2, Edit, Save, MapPin, Mail, Phone, Globe,
  Users, BookOpen, GraduationCap, Handshake, Wrench, FlaskConical,
  MonitorPlay, Cpu, Activity, ArrowRight, FileText, PlusCircle, PenTool, X
} from 'lucide-react';
import { getCurrentUser, updateUserProfile, DEMO_ACCOUNTS } from '../../utils/authStorage';
import './InstituteProfile.css';

const InstituteProfile = () => {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser('institute') || DEMO_ACCOUNTS.instituteSecondary);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const handler = () => {
      const user = getCurrentUser('institute');
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
      name: currentUser.name || '',
      type: currentUser.type || 'ITI',
      email: currentUser.email || '',
      regNumber: currentUser.regNumber || '',
      contactNumber: currentUser.contactNumber || '',
      district: currentUser.district || '',
      taluka: currentUser.taluka || '',
      address: currentUser.address || '',
      website: currentUser.website || '',
      managementType: currentUser.managementType || 'Government',
      studentCapacity: currentUser.studentCapacity || '350',
      trades: currentUser.trades || '',
      contactPerson: currentUser.contactPerson || '',
      designation: currentUser.designation || 'Principal'
    });
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e?.preventDefault();
    const res = updateUserProfile('institute', editForm);
    if (res.success) {
      setCurrentUser(res.user);
      setIsEditing(false);
      showToast('✅ Institute profile updated successfully!');
    }
  };

  const instName = currentUser.name || 'Registered Institute';
  const instType = currentUser.type || 'ITI';
  const instEmail = currentUser.email || 'Not specified';
  const instReg = currentUser.regNumber || 'Not specified';
  const instPhone = currentUser.contactNumber || 'Not specified';
  const instDistrict = currentUser.district || 'Maharashtra';
  const instTaluka = currentUser.taluka || 'District Headquarter';
  const instAddress = currentUser.address || 'Maharashtra, India';
  const instWebsite = currentUser.website || 'www.skillbridge.maha.gov.in';
  const instCapacity = currentUser.studentCapacity || '350';
  const instTrades = currentUser.trades || 'Electrician, Fitter, Welder, Machinist';

  return (
    <div className="institute-profile">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#065f46',
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

      <div className="page-header">
        <div className="header-title">
          <div className="title-icon">
            <Building2 size={24} />
          </div>
          <div>
            <h1>Institute Profile</h1>
            <p>Official registration credentials and academic profile verified by Maharashtra Government</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="verification-status verified">
            <CheckCircle2 size={16} /> Verified {instType}
          </div>
          <div className="last-updated">
            <span className="icon">⏱</span>
            <div>
              <span className="label">Registered On</span>
              <span className="time">{currentUser.registeredAt || 'Active Session'}</span>
            </div>
          </div>
          <button className="outline-btn" onClick={handleStartEdit}>
            <Edit size={16} /> Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-grid">
        <div className="card main-info-card">
          <div className="institute-name-section">
            <div className="institute-logo">
              <Building2 size={32} color="#3b82f6" />
            </div>
            <div>
              <h2>{instName}</h2>
              <span className="verified-badge"><CheckCircle2 size={14} /> DGT / MSBTE Affiliated {instType}</span>
            </div>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label"><Building2 size={14} /> Institute Type</span>
              <span className="info-value">{instType}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Mail size={14} /> Official Email</span>
              <span className="info-value primary">{instEmail}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><FileText size={14} /> Registration Number</span>
              <span className="info-value">{instReg}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Phone size={14} /> Contact Number</span>
              <span className="info-value">{instPhone}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><MapPin size={14} /> District</span>
              <span className="info-value">{instDistrict}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Globe size={14} /> Website</span>
              <span className="info-value primary">{instWebsite}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><MapPin size={14} /> Taluka</span>
              <span className="info-value">{instTaluka}</span>
            </div>
            <div className="info-item">
              <span className="info-label"><Users size={14} /> Annual Student Intake</span>
              <span className="info-value">{instCapacity} Trainees</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label"><MapPin size={14} /> Address</span>
              <span className="info-value">{instAddress}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label"><BookOpen size={14} /> Offered Trades & Programs</span>
              <span className="info-value">{instTrades}</span>
            </div>
          </div>
        </div>

        <div className="card recent-activity-card">
          <div className="card-header">
            <div className="card-title">
              <Activity size={18} color="#3b82f6" />
              <h3>Recent Platform Activity</h3>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Live System Log</span>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon"><FileText size={16} /></div>
              <div className="activity-content">
                <div className="activity-title">Institute Account Verified</div>
                <div className="activity-desc">{instName} verified on Maharashtra SkillBridge Portal</div>
              </div>
              <div className="activity-meta">
                <span className="activity-time">Active</span>
                <span className="status-badge completed">Verified</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon"><BookOpen size={16} /></div>
              <div className="activity-content">
                <div className="activity-title">Curriculum Trade Alignment</div>
                <div className="activity-desc">Aligned curriculum with Industry NSQF standards</div>
              </div>
              <div className="activity-meta">
                <span className="activity-time">Active</span>
                <span className="status-badge completed">Synced</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon"><Handshake size={16} /></div>
              <div className="activity-content">
                <div className="activity-title">Dual Apprenticeship Collaboration</div>
                <div className="activity-desc">Industry partnership active for technical trainees</div>
              </div>
              <div className="activity-meta">
                <span className="activity-time">Recent</span>
                <span className="status-badge completed">Connected</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon"><Wrench size={16} /></div>
              <div className="activity-content">
                <div className="activity-title">Workshop Diagnostics</div>
                <div className="activity-desc">Lab infrastructure & machinery status updated</div>
              </div>
              <div className="activity-meta">
                <span className="activity-time">Verified</span>
                <span className="status-badge completed">Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card quick-actions-card">
          <div className="card-header">
            <div className="card-title">
              <ZapIcon size={18} color="#3b82f6" />
              <h3>Quick Profile Actions</h3>
            </div>
          </div>
          <div className="actions-list">
            <div className="action-button" onClick={handleStartEdit} style={{ cursor: 'pointer' }}>
              <div className="action-icon"><Edit size={20} /></div>
              <div className="action-text">
                <h4>Edit Profile Details</h4>
                <p>Update institute name, official contact number, email, address, and intake</p>
              </div>
              <ArrowRight size={20} className="arrow-icon" />
            </div>
            <div className="action-button" onClick={handleStartEdit} style={{ cursor: 'pointer' }}>
              <div className="action-icon"><PenTool size={20} /></div>
              <div className="action-text">
                <h4>Update Offered Trades</h4>
                <p>Add or modify vocational courses, trades, and syllabus streams</p>
              </div>
              <ArrowRight size={20} className="arrow-icon" />
            </div>
            <div className="action-button" onClick={() => showToast('✅ Institute profile credentials are fully verified and up to date!')} style={{ cursor: 'pointer' }}>
              <div className="action-icon"><Save size={20} /></div>
              <div className="action-text">
                <h4>Check Sync Status</h4>
                <p>Verify active portal synchronization with Maharashtra SkillBridge</p>
              </div>
              <ArrowRight size={20} className="arrow-icon" />
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
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Edit Institute Profile</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Update your official institution details</p>
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Institute Name</label>
                  <input 
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Institute Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="ITI">ITI (Industrial Training Institute)</option>
                    <option value="Polytechnic">Polytechnic (Diploma)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Registration / Affiliation No.</label>
                  <input 
                    type="text"
                    value={editForm.regNumber}
                    onChange={(e) => setEditForm({ ...editForm, regNumber: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Official Email</label>
                  <input 
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Contact Number (Phone)</label>
                  <input 
                    type="text"
                    value={editForm.contactNumber}
                    onChange={(e) => setEditForm({ ...editForm, contactNumber: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>District</label>
                  <input 
                    type="text"
                    value={editForm.district}
                    onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Taluka</label>
                  <input 
                    type="text"
                    value={editForm.taluka}
                    onChange={(e) => setEditForm({ ...editForm, taluka: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Website</label>
                  <input 
                    type="text"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Annual Student Intake Capacity</label>
                  <input 
                    type="number"
                    value={editForm.studentCapacity}
                    onChange={(e) => setEditForm({ ...editForm, studentCapacity: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Full Institute Address</label>
                  <textarea 
                    rows="2"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Offered Trades / Branches</label>
                  <input 
                    type="text"
                    value={editForm.trades}
                    onChange={(e) => setEditForm({ ...editForm, trades: e.target.value })}
                    placeholder="e.g. Electrician, Fitter, CNC Operator, Welder"
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

const ZapIcon = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

export default InstituteProfile;
