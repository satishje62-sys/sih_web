import React, { useState, useEffect } from 'react';
import { 
  User, Building, Lock, Users, Bell, Share2, CheckCircle2, Link, FileText, 
  Upload, Key, MoreHorizontal, Clock, Building2, Briefcase, GraduationCap, 
  AlertTriangle, Info, Plus, Trash2, X, Shield, Smartphone, Eye, EyeOff
} from 'lucide-react';
import { getCurrentUser } from '../../utils/authStorage';
import './IndustrySettings.css';

const DEFAULT_PROFILE = {
  fullName: 'Industry User',
  email: 'user@abcmfg.com',
  phone: '+91 98765 43210',
  designation: 'HR & Talent Acquisition Manager',
  avatarInitials: 'IU'
};

const DEFAULT_COMPANY = {
  companyName: 'ABC Manufacturing Pvt. Ltd.',
  industrySector: 'Automotive & Manufacturing',
  registeredAddress: 'Plot C-12, MIDC Industrial Area, Chakan, Pune - 410501, Maharashtra',
  website: 'https://www.abcmfg.com',
  companyCin: 'U29100PN2015PTC154210',
  description: 'We are an automotive component manufacturing company in Maharashtra focused on precision CNC machining, automation, sustainability, and skilled ITI/Polytechnic workforce recruitment.'
};

const DEFAULT_USERS = [
  { id: 1, name: 'Rahul Sharma', role: 'Admin', email: 'rahul@abcmfg.com', status: 'Active' },
  { id: 2, name: 'Priya Deshmukh', role: 'HR Manager', email: 'priya@abcmfg.com', status: 'Active' },
  { id: 3, name: 'Amit Kulkarni', role: 'Skill/Training Manager', email: 'amit@abcmfg.com', status: 'Active' },
  { id: 4, name: 'Neha Patil', role: 'Recruitment Officer', email: 'neha@abcmfg.com', status: 'Active' },
];

const IndustrySettings = () => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'company', 'users', 'security', 'notifications'
  const [toastMessage, setToastMessage] = useState(null);
  const currentUser = getCurrentUser('employer');

  // Profile Form State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('skillbridge_employer_profile');
    if (saved) return JSON.parse(saved);
    if (currentUser) {
      return {
        fullName: currentUser.contactPerson || currentUser.companyName || DEFAULT_PROFILE.fullName,
        email: currentUser.officialEmail || currentUser.email || DEFAULT_PROFILE.email,
        phone: currentUser.contactNumber || DEFAULT_PROFILE.phone,
        designation: currentUser.designation || DEFAULT_PROFILE.designation,
        avatarInitials: (currentUser.contactPerson || currentUser.companyName || 'IU').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
      };
    }
    return DEFAULT_PROFILE;
  });

  // Company Form State
  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem('skillbridge_employer_company');
    if (saved) return JSON.parse(saved);
    if (currentUser) {
      return {
        companyName: currentUser.companyName || DEFAULT_COMPANY.companyName,
        industrySector: currentUser.sector || DEFAULT_COMPANY.industrySector,
        registeredAddress: currentUser.address || DEFAULT_COMPANY.registeredAddress,
        website: currentUser.website || DEFAULT_COMPANY.website,
        companyCin: currentUser.regNumber || DEFAULT_COMPANY.companyCin,
        description: `We are a registered industry partner in Maharashtra focused on ${currentUser.sector || 'manufacturing'} and recruitment of skilled ITI & Polytechnic trainees.`
      };
    }
    return DEFAULT_COMPANY;
  });

  // Users State
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('skillbridge_employer_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'Recruitment Officer'
  });

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailApplications: true,
    smsCollabRequests: true,
    weeklyDigest: false,
    skillGapAlerts: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Save Profile Handler
  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('skillbridge_employer_profile', JSON.stringify(profile));
    showToast('✓ Personal profile settings saved successfully!');
  };

  // Save Company Information Handler
  const handleSaveCompany = (e) => {
    e.preventDefault();
    localStorage.setItem('skillbridge_employer_company', JSON.stringify(company));
    showToast('✓ Company information updated successfully!');
  };

  // Add New Team Member Handler
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) {
      alert('Please fill out Name and Email.');
      return;
    }

    const createdUser = {
      id: Date.now(),
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      role: newUserForm.role,
      status: 'Active'
    };

    const updated = [...users, createdUser];
    setUsers(updated);
    localStorage.setItem('skillbridge_employer_users', JSON.stringify(updated));
    setIsAddUserModalOpen(false);
    setNewUserForm({ name: '', email: '', role: 'Recruitment Officer' });
    showToast(`✓ Added ${createdUser.name} (${createdUser.role}) to team members.`);
  };

  // Delete User Handler
  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from your team?`)) {
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      localStorage.setItem('skillbridge_employer_users', JSON.stringify(updated));
      showToast(`Removed ${name} from organization team.`);
    }
  };

  // Password Update Handler
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      alert('Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('✓ Security password updated successfully!');
  };

  // Toggle Notification Setting
  const toggleNotification = (key) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast('✓ Notification preferences updated.');
      return updated;
    });
  };

  return (
    <div className="dashboard-page settings-page">
      {/* Toast */}
      {toastMessage && (
        <div className="settings-toast">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings & Preferences</h1>
          <p className="page-subtitle">
            Manage your personal profile, company information, user roles, security, and alerts.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="settings-nav-bar">
        <button 
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} /> Profile Settings
        </button>
        <button 
          className={`settings-tab ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          <Building size={16} /> Company Information
        </button>
        <button 
          className={`settings-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={16} /> User Management ({users.length})
        </button>
        <button 
          className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={16} /> Security & Password
        </button>
        <button 
          className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={16} /> Notifications
        </button>
      </div>

      {/* TAB 1: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="settings-grid">
          <div className="settings-card col-span-2">
            <div className="card-header border-b">
              <h3 className="flex items-center gap-2 text-dark font-semibold">
                <User size={18} className="text-blue" /> Personal Profile Details
              </h3>
              <p className="text-sm text-gray mt-1 ml-6">
                Update your account contact information and designation within the organization.
              </p>
            </div>
            <form onSubmit={handleSaveProfile}>
              <div className="card-body">
                <div className="flex gap-6" style={{ flexWrap: 'wrap' }}>
                  <div className="avatar-upload">
                    <div className="avatar-circle large">
                      <span>{profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}</span>
                    </div>
                    <button 
                      type="button" 
                      className="btn outline-btn btn-sm mt-2"
                      onClick={() => showToast('Avatar updated!')}
                    >
                      Change Photo
                    </button>
                  </div>
                  <div className="flex-1 form-grid-2col" style={{ gridTemplateColumns: '1fr 1fr', minWidth: '280px' }}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        value={profile.fullName} 
                        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Official Email Address</label>
                      <input 
                        type="email" 
                        value={profile.email} 
                        disabled 
                        className="bg-slate-50 text-gray" 
                      />
                    </div>
                    <div className="form-group">
                      <label>Direct Phone Number *</label>
                      <input 
                        type="text" 
                        value={profile.phone} 
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Designation / Job Title *</label>
                      <input 
                        type="text" 
                        value={profile.designation} 
                        onChange={(e) => setProfile({...profile, designation: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn primary-btn">
                    Save Profile Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: COMPANY INFORMATION */}
      {activeTab === 'company' && (
        <div className="settings-grid">
          <div className="settings-card col-span-2">
            <div className="card-header border-b">
              <h3 className="flex items-center gap-2 text-dark font-semibold">
                <Building size={18} className="text-blue" /> Corporate & Manufacturing Entity Details
              </h3>
              <p className="text-sm text-gray mt-1 ml-6">
                These details are displayed on job postings and collaboration proposals sent to Maharashtra ITIs.
              </p>
            </div>
            <form onSubmit={handleSaveCompany}>
              <div className="card-body">
                <div className="form-grid-2col">
                  <div className="form-group">
                    <label>Registered Company Name *</label>
                    <input 
                      type="text" 
                      value={company.companyName}
                      onChange={(e) => setCompany({...company, companyName: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Industry Sector *</label>
                    <select 
                      value={company.industrySector}
                      onChange={(e) => setCompany({...company, industrySector: e.target.value})}
                    >
                      <option value="Automotive & Manufacturing">Automotive & Manufacturing</option>
                      <option value="Renewable Energy & Solar">Renewable Energy & Solar</option>
                      <option value="Industrial Automation & Robotics">Industrial Automation & Robotics</option>
                      <option value="Electrical & Electronics">Electrical & Electronics</option>
                      <option value="Precision Tooling & CNC">Precision Tooling & CNC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Company Identification Number (CIN / GSTIN) *</label>
                    <input 
                      type="text" 
                      value={company.companyCin}
                      onChange={(e) => setCompany({...company, companyCin: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Official Corporate Website</label>
                    <input 
                      type="url" 
                      value={company.website}
                      onChange={(e) => setCompany({...company, website: e.target.value})}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Plant & Office Address (Maharashtra) *</label>
                    <input 
                      type="text" 
                      value={company.registeredAddress}
                      onChange={(e) => setCompany({...company, registeredAddress: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Company Description (For Candidates & Placement Cells)</label>
                    <textarea 
                      rows="3" 
                      value={company.description}
                      onChange={(e) => setCompany({...company, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button type="submit" className="btn primary-btn">
                    Save Company Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="settings-grid">
          <div className="settings-card col-span-2">
            <div className="card-header border-b flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="flex items-center gap-2 text-dark font-semibold">
                  <Users size={18} className="text-blue" /> Authorized Team Members & Access
                </h3>
                <p className="text-sm text-gray mt-1 ml-6">
                  Manage colleagues who can publish job openings, review student applicants, and sign institute agreements.
                </p>
              </div>
              <button 
                className="btn primary-btn btn-sm"
                onClick={() => setIsAddUserModalOpen(true)}
              >
                + Add Team User
              </button>
            </div>
            <div className="card-body p-0">
              <table className="settings-table w-full text-left text-sm">
                <thead className="bg-slate-50 text-gray">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Role & Permissions</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="py-3 px-4 font-medium text-dark">{u.name}</td>
                      <td className="py-3 px-4">
                        <span className={`status-pill ${u.role === 'Admin' ? 'purple-outline' : u.role === 'HR Manager' ? 'blue-outline' : 'orange-outline'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray text-xs">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="text-green font-medium">✓ {u.status}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          className="action-icon text-red"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          title="Remove user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & PASSWORD */}
      {activeTab === 'security' && (
        <div className="settings-grid">
          {/* Password Change */}
          <div className="settings-card col-span-1">
            <div className="card-header border-b">
              <h3 className="flex items-center gap-2 text-dark font-semibold">
                <Lock size={18} className="text-blue" /> Change Password
              </h3>
              <p className="text-sm text-gray mt-1 ml-6">Ensure your account uses a secure password.</p>
            </div>
            <form onSubmit={handleUpdatePassword}>
              <div className="card-body">
                <div className="form-group full-width mb-3">
                  <label>Current Password *</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width mb-3">
                  <label>New Password (Min 6 chars) *</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width mb-4">
                  <label>Confirm New Password *</label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 mb-4" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} color="#64748b" /> : <Eye size={15} color="#64748b" />}
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn primary-btn">
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication & Active Sessions */}
          <div className="settings-card col-span-1">
            <div className="card-header border-b">
              <h3 className="flex items-center gap-2 text-dark font-semibold">
                <Shield size={18} className="text-green" /> Authentication & Active Sessions
              </h3>
              <p className="text-sm text-gray mt-1 ml-6">Two-factor security and login device logs.</p>
            </div>
            <div className="card-body">
              <div className="pref-row">
                <div className="pref-info">
                  <strong>Two-Factor OTP Authentication</strong>
                  <p>Send mobile OTP verification when logging in from unknown devices.</p>
                </div>
                <div 
                  className={`toggle-switch ${twoFactorEnabled ? 'active' : ''}`}
                  onClick={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    showToast(twoFactorEnabled ? 'Two-Factor Authentication disabled' : 'Two-Factor Authentication enabled');
                  }}
                ></div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  Current Active Sessions
                </strong>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>Chrome on Windows 11 (This Device)</div>
                  <div style={{ color: '#64748b' }}>Pune, Maharashtra • Active now</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>Mobile Safari on iPhone 15</div>
                  <div style={{ color: '#64748b' }}>Chakan Plant • Last active 2 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="settings-grid">
          <div className="settings-card col-span-2">
            <div className="card-header border-b">
              <h3 className="flex items-center gap-2 text-dark font-semibold">
                <Bell size={18} className="text-blue" /> Notification & Hiring Alerts
              </h3>
              <p className="text-sm text-gray mt-1 ml-6">
                Choose what notifications and email summaries your recruiting team receives.
              </p>
            </div>
            <div className="card-body">
              <div className="pref-row">
                <div className="pref-info">
                  <strong>New Student Job Applications</strong>
                  <p>Receive immediate email notification when an ITI or Diploma student applies for your vacancies.</p>
                </div>
                <div 
                  className={`toggle-switch ${notifications.emailApplications ? 'active' : ''}`}
                  onClick={() => toggleNotification('emailApplications')}
                ></div>
              </div>

              <div className="pref-row">
                <div className="pref-info">
                  <strong>Institute Collaboration Requests</strong>
                  <p>Get alerted when Maharashtra Polytechnics and ITIs request dual-training or campus hiring MoUs.</p>
                </div>
                <div 
                  className={`toggle-switch ${notifications.smsCollabRequests ? 'active' : ''}`}
                  onClick={() => toggleNotification('smsCollabRequests')}
                ></div>
              </div>

              <div className="pref-row">
                <div className="pref-info">
                  <strong>Curriculum Skill Gap Alerts</strong>
                  <p>Receive updates when government skill training institutes update curriculum matching your trade needs.</p>
                </div>
                <div 
                  className={`toggle-switch ${notifications.skillGapAlerts ? 'active' : ''}`}
                  onClick={() => toggleNotification('skillGapAlerts')}
                ></div>
              </div>

              <div className="pref-row">
                <div className="pref-info">
                  <strong>Weekly Candidate Match Digest</strong>
                  <p>A weekly summary of top certified candidates available in Pune, Chakan, and Nashik clusters.</p>
                </div>
                <div 
                  className={`toggle-switch ${notifications.weeklyDigest ? 'active' : ''}`}
                  onClick={() => toggleNotification('weeklyDigest')}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {isAddUserModalOpen && (
        <div className="settings-modal-overlay" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="settings-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h3>Add Organization Team Member</h3>
              <button className="close-btn" onClick={() => setIsAddUserModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="settings-modal-body">
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Anand Kadam" 
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Corporate Email *</label>
                  <input 
                    type="email" 
                    placeholder="e.g. anand@abcmfg.com" 
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Role & Access Level *</label>
                  <select 
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                  >
                    <option value="Admin">Admin (Full Access)</option>
                    <option value="HR Manager">HR Manager (Job Postings & Applicants)</option>
                    <option value="Skill/Training Manager">Skill/Training Manager (Skill Gaps & MoUs)</option>
                    <option value="Recruitment Officer">Recruitment Officer (Candidate Screening)</option>
                  </select>
                </div>
              </div>
              <div className="settings-modal-footer">
                <button 
                  type="button" 
                  className="btn outline-btn"
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary-btn">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default IndustrySettings;
