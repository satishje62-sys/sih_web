import React, { useState, useEffect } from 'react';
import { Building2, Settings, Tag, Landmark, Edit3, CheckCircle, Users, X, Phone, Mail, Globe, MapPin, Briefcase } from 'lucide-react';
import { getCurrentUser, updateUserProfile, DEMO_ACCOUNTS } from '../../utils/authStorage';
import './IndustryProfile.css';

const IndustryProfile = () => {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser('employer') || DEMO_ACCOUNTS.employer);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const handler = () => {
      const user = getCurrentUser('employer');
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
      companyName: currentUser.companyName || '',
      officialEmail: currentUser.officialEmail || currentUser.email || '',
      regNumber: currentUser.regNumber || '',
      contactNumber: currentUser.contactNumber || '',
      sector: currentUser.sector || 'Automotive & Manufacturing',
      subSector: currentUser.subSector || 'Manufacturing & Engineering',
      website: currentUser.website || '',
      contactPerson: currentUser.contactPerson || '',
      designation: currentUser.designation || 'Head - HR & Talent Development',
      district: currentUser.district || 'Pune',
      industrialArea: currentUser.industrialArea || '',
      address: currentUser.address || '',
      hiringRoles: currentUser.hiringRoles || '',
      openingsCount: currentUser.openingsCount || '25'
    });
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e?.preventDefault();
    const res = updateUserProfile('employer', editForm);
    if (res.success) {
      setCurrentUser(res.user);
      setIsEditing(false);
      showToast('✅ Company profile updated successfully!');
    }
  };

  const companyName = currentUser.companyName || 'Registered Employer';
  const initials = companyName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'EM';
  const officialEmail = currentUser.officialEmail || currentUser.email || 'Not specified';
  const regNumber = currentUser.regNumber || 'Not specified';
  const contactNumber = currentUser.contactNumber || 'Not specified';
  const sector = currentUser.sector || 'Industrial Sector';
  const subSector = currentUser.subSector || currentUser.sector || 'Manufacturing & Engineering';
  const website = currentUser.website || 'www.company.com';
  const contactPerson = currentUser.contactPerson || 'Authorized Representative';
  const designation = currentUser.designation || 'Head - HR & Talent Development';
  const district = currentUser.district || 'Maharashtra';
  const industrialArea = currentUser.industrialArea || 'MIDC Industrial Area';
  const address = currentUser.address || 'Maharashtra, India';

  return (
    <div className="dashboard-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#0369a1',
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
        <div>
          <h1 className="page-title">Company Profile</h1>
          <p className="page-subtitle">Manage company details, recruitment targets & skill-demand profile for Maharashtra Government</p>
        </div>
        <div className="status-banner green-banner">
          <div className="banner-icon"><CheckCircle size={24} /></div>
          <div>
            <strong>Verified Industry Partner</strong>
            <p>Your company profile is registered & verified by Maharashtra Skill Development Dept</p>
          </div>
        </div>
      </div>

      <div className="profile-card main-profile">
        <div className="card-header">
          <div className="card-title-wrap">
            <Building2 size={20} className="text-blue" />
            <h2>Company Information</h2>
          </div>
          <button className="edit-btn" onClick={handleStartEdit}><Edit3 size={14}/> Edit Profile</button>
        </div>
        <div className="card-body">
          <div className="company-branding">
            <div className="company-logo-large" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
              color: 'white', 
              fontWeight: 800, 
              fontSize: '24px',
              borderRadius: '12px',
              width: '64px',
              height: '64px'
            }}>
              {initials}
            </div>
            <div className="company-name-large">
              <h2>{companyName}</h2>
              <p>{sector} • Partner in Skill Development</p>
            </div>
            <div className="company-image">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="Company Office" />
            </div>
          </div>
          
          <div className="info-grid-2col">
            <div className="info-item">
              <span className="label">Company Name</span>
              <span className="colon">:</span>
              <span className="value font-medium">{companyName}</span>
            </div>
            <div className="info-item">
              <span className="label">Official Email</span>
              <span className="colon">:</span>
              <span className="value font-medium primary">{officialEmail}</span>
            </div>
            <div className="info-item">
              <span className="label">Company CIN / Reg Number</span>
              <span className="colon">:</span>
              <span className="value">{regNumber}</span>
            </div>
            <div className="info-item">
              <span className="label">Contact Number (Phone)</span>
              <span className="colon">:</span>
              <span className="value">{contactNumber}</span>
            </div>
            <div className="info-item">
              <span className="label">Industry Sector</span>
              <span className="colon">:</span>
              <span className="value">{sector}</span>
            </div>
            <div className="info-item">
              <span className="label">Website</span>
              <span className="colon">:</span>
              <span className="value text-blue flex-gap">{website}</span>
            </div>
            <div className="info-item">
              <span className="label">Sub-sector / Domain</span>
              <span className="colon">:</span>
              <span className="value">{subSector}</span>
            </div>
            <div className="info-item">
              <span className="label">Contact Person</span>
              <span className="colon">:</span>
              <span className="value">{contactPerson}</span>
            </div>
            <div className="info-item">
              <span className="label">District</span>
              <span className="colon">:</span>
              <span className="value">{district}</span>
            </div>
            <div className="info-item">
              <span className="label">Designation</span>
              <span className="colon">:</span>
              <span className="value">{designation}</span>
            </div>
            <div className="info-item">
              <span className="label">Industrial Area</span>
              <span className="colon">:</span>
              <span className="value">{industrialArea}</span>
            </div>
            <div className="info-item">
              <span className="label">Email (Contact Person)</span>
              <span className="colon">:</span>
              <span className="value">{officialEmail}</span>
            </div>
            <div className="info-item">
              <span className="label">Complete Address</span>
              <span className="colon">:</span>
              <span className="value">{address}</span>
            </div>
            <div className="info-item">
              <span className="label" style={{alignSelf: 'flex-start'}}>Mobile (Contact Person)</span>
              <span className="colon" style={{alignSelf: 'flex-start'}}>:</span>
              <span className="value" style={{alignSelf: 'flex-start'}}>{contactNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-actions-bottom">
        <button className="btn outline-btn" onClick={handleStartEdit}><Edit3 size={16}/> Edit Profile</button>
        <button className="btn primary-btn" onClick={handleStartEdit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.24l5.08 5.08"/></svg> 
          Update Information
        </button>
        <button className="btn green-btn" onClick={() => showToast('✅ Profile credentials verified by Maharashtra Government!')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> 
          Verified Status
        </button>
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
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Edit Company Profile</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Update corporate credentials and recruitment contact details</p>
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Company Legal Name</label>
                  <input 
                    type="text"
                    value={editForm.companyName}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Official Company Email</label>
                  <input 
                    type="email"
                    value={editForm.officialEmail}
                    onChange={(e) => setEditForm({ ...editForm, officialEmail: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>CIN / Registration Number</label>
                  <input 
                    type="text"
                    value={editForm.regNumber}
                    onChange={(e) => setEditForm({ ...editForm, regNumber: e.target.value })}
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Industry Sector</label>
                  <input 
                    type="text"
                    value={editForm.sector}
                    onChange={(e) => setEditForm({ ...editForm, sector: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Contact Person Name</label>
                  <input 
                    type="text"
                    value={editForm.contactPerson}
                    onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Designation</label>
                  <input 
                    type="text"
                    value={editForm.designation}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Industrial Area / MIDC</label>
                  <input 
                    type="text"
                    value={editForm.industrialArea}
                    onChange={(e) => setEditForm({ ...editForm, industrialArea: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Official Website</label>
                  <input 
                    type="text"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Registered Factory / Corporate Address</label>
                  <textarea 
                    rows="2"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
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
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0284c7', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  Save Company Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryProfile;
