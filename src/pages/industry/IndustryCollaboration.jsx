import React, { useState, useEffect } from 'react';
import { 
  Building2, Handshake, FileText, GraduationCap, Building, Search, 
  Download, ArrowRight, CheckCircle, Clock, Plus, BookOpen, PenTool, 
  Users, Monitor, Award, Heart, Briefcase, CheckCircle2, X, Eye, Check, AlertCircle, Sparkles
} from 'lucide-react';
import { getCollaborations, updateCollaborationStatus, addCollaboration } from '../../utils/collaborationStorage';
import { getCurrentUser } from '../../utils/authStorage';
import './IndustryCollaboration.css';

const CollabKpiCard = ({ title, value, change, changeText, icon: Icon, colorClass }) => (
  <div className={`collab-kpi-card ${colorClass}`}>
    <div className="kpi-icon-header">
      <div className="kpi-icon"><Icon size={24} /></div>
    </div>
    <div className="kpi-content">
      <div className="kpi-value">{value}</div>
      <h3>{title}</h3>
      <div className="kpi-change positive">
        <ArrowRight size={14} style={{ transform: 'rotate(-45deg)' }} />
        <span>{change}</span>
        <span className="vs-text">{changeText}</span>
      </div>
    </div>
  </div>
);

const CollabOption = ({ title, icon: Icon, colorClass }) => (
  <div className="collab-option">
    <div className={`option-icon-box ${colorClass}`}><Icon size={24} /></div>
    <span>{title}</span>
  </div>
);

const IndustryCollaboration = () => {
  const [currentUser] = useState(() => getCurrentUser('employer'));
  const [collaborations, setCollaborations] = useState(() => getCollaborations());
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'all'
  const [searchIncoming, setSearchIncoming] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New Collaboration Form State
  const [newCollabForm, setNewCollabForm] = useState({
    institute: 'Government ITI Pune',
    district: 'Pune',
    program: 'Mechanical Engineering',
    skill: '',
    type: 'Apprenticeship',
    duration: '6 Months',
    students: '20',
    mentor: '',
    description: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  useEffect(() => {
    const handleUpdate = () => {
      setCollaborations(getCollaborations());
    };
    window.addEventListener('skillbridge:collaborationUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('skillbridge:collaborationUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleAcceptCollaboration = (id, instName) => {
    const updated = updateCollaborationStatus(id, 'Active');
    setCollaborations(updated);
    showToast(`✅ Collaboration proposal from "${instName}" accepted! Status updated to Active.`);
  };

  const handleDeclineCollaboration = (id, instName) => {
    const updated = updateCollaborationStatus(id, 'Declined');
    setCollaborations(updated);
    showToast(`Collaboration proposal from "${instName}" marked as Declined.`);
  };

  const handleCreateCollabSubmit = (e) => {
    e.preventDefault();
    if (!newCollabForm.skill.trim()) {
      alert('Please enter the required skill.');
      return;
    }

    const newCollab = {
      id: `collab-${Date.now()}`,
      instituteName: newCollabForm.institute,
      industryName: currentUser?.companyName || 'Registered Employer',
      sector: currentUser?.sector || 'Manufacturing',
      trade: newCollabForm.program,
      skill: newCollabForm.skill.trim(),
      type: newCollabForm.type,
      students: Number(newCollabForm.students) || 15,
      duration: newCollabForm.duration,
      outcome: 'Industry Sponsored Training & Apprenticeship',
      message: newCollabForm.description || `Industry partnership initiated by ${currentUser?.companyName || 'our company'} for ${newCollabForm.program}.`,
      status: 'Active',
      date: 'Just now',
      timestamp: Date.now()
    };

    const updated = addCollaboration(newCollab);
    setCollaborations(updated);
    setNewCollabForm({
      institute: 'Government ITI Pune',
      district: 'Pune',
      program: 'Mechanical Engineering',
      skill: '',
      type: 'Apprenticeship',
      duration: '6 Months',
      students: '20',
      mentor: '',
      description: ''
    });

    showToast(`🎉 Collaboration with "${newCollab.instituteName}" started successfully! Live across portals.`);
  };

  const pendingRequests = collaborations.filter(c => c.status === 'Pending Review');
  const activeCollaborations = collaborations.filter(c => c.status === 'Active');
  const totalStudents = collaborations.reduce((acc, c) => acc + (Number(c.students) || 0), 0);

  const filteredIncoming = collaborations.filter(c => {
    if (!searchIncoming) return true;
    return c.instituteName.toLowerCase().includes(searchIncoming.toLowerCase()) ||
           c.skill.toLowerCase().includes(searchIncoming.toLowerCase()) ||
           c.trade.toLowerCase().includes(searchIncoming.toLowerCase()) ||
           c.type.toLowerCase().includes(searchIncoming.toLowerCase());
  });

  return (
    <div className="dashboard-page collab-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification-banner" style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '500',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
          marginBottom: '1.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Industry-Institute Collaboration Hub</h1>
          <p className="page-subtitle">Manage live proposals from ITIs & Polytechnics, deploy apprenticeships, and build industry-aligned talent pipelines.</p>
        </div>
        <div className="partnership-badge">
          Industry-Academia Partnership<br/>for a Skilled Maharashtra
        </div>
      </div>

      {/* KPI Cards */}
      <div className="collab-kpi-grid">
        <CollabKpiCard 
          title="Incoming Institute Proposals" 
          value={pendingRequests.length} 
          change={`${pendingRequests.length} new`} 
          changeText="awaiting response" 
          icon={Handshake} 
          colorClass="orange-bg" 
        />
        <CollabKpiCard 
          title="Active Partnerships" 
          value={activeCollaborations.length} 
          change="+4 this quarter" 
          changeText="vs last quarter" 
          icon={CheckCircle} 
          colorClass="green-bg" 
        />
        <CollabKpiCard 
          title="Trainees in Pipeline" 
          value={totalStudents} 
          change="+35%" 
          changeText="intake growth" 
          icon={Users} 
          colorClass="blue-bg" 
        />
        <CollabKpiCard 
          title="Apprenticeship Slots" 
          value="45" 
          change="85%" 
          changeText="utilization rate" 
          icon={Award} 
          colorClass="purple-bg" 
        />
        <CollabKpiCard 
          title="Partner Institutes" 
          value={new Set(collaborations.map(c => c.instituteName)).size} 
          change="Across Maharashtra" 
          changeText="Pune & Nashik" 
          icon={Building2} 
          colorClass="blue-bg" 
        />
      </div>

      {/* INCOMING COLLABORATION REQUESTS SECTION (From Institute Dashboard) */}
      <div className="table-card mb-6" style={{ border: '2px solid #3b82f6', borderRadius: '12px' }}>
        <div className="table-header-bar flex-between" style={{ background: '#f8fafc', padding: '1rem 1.5rem' }}>
          <div className="table-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#2563eb" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>
                Incoming Institute Collaboration Requests
              </h3>
              {pendingRequests.length > 0 && (
                <span style={{
                  backgroundColor: '#ea580c',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: '700'
                }}>
                  {pendingRequests.length} Action Needed
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Real-time collaboration proposals submitted by Government ITIs & Polytechnics.
            </p>
          </div>
          
          <div className="search-input" style={{ width: '280px', backgroundColor: 'white' }}>
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search proposals, trade, skill..." 
              value={searchIncoming}
              onChange={(e) => setSearchIncoming(e.target.value)}
            />
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Institute Proposal</th>
                <th>Sector & Trade</th>
                <th>Skill Focus</th>
                <th>Type</th>
                <th>Students</th>
                <th>Duration</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncoming.map(item => (
                <tr key={item.id} style={{ backgroundColor: item.status === 'Pending Review' ? '#fffdfa' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '13px'
                      }}>
                        {item.instituteName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong style={{ color: '#1e293b', fontSize: '13px' }}>{item.instituteName}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Requested: {item.date || 'Recent'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '500' }}>{item.trade}</span>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{item.sector}</div>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{item.skill}</strong>
                  </td>
                  <td>
                    <span className="status-pill blue-outline">
                      {item.type}
                    </span>
                  </td>
                  <td>
                    <strong>{item.students}</strong> Trainees
                  </td>
                  <td>{item.duration}</td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: item.status === 'Active' ? '#f0fdf4' : item.status === 'Pending Review' ? '#fff7ed' : '#fef2f2',
                      color: item.status === 'Active' ? '#16a34a' : item.status === 'Pending Review' ? '#ea580c' : '#dc2626',
                      border: `1px solid ${item.status === 'Active' ? '#bbf7d0' : item.status === 'Pending Review' ? '#fed7aa' : '#fecaca'}`
                    }}>
                      {item.status === 'Active' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        className="btn outline-btn" 
                        style={{ padding: '4px 10px', fontSize: '12px', height: '30px' }}
                        onClick={() => setSelectedProposal(item)}
                      >
                        <Eye size={13} /> View Proposal
                      </button>

                      {item.status === 'Pending Review' && (
                        <>
                          <button 
                            className="btn primary-btn"
                            style={{ padding: '4px 12px', fontSize: '12px', height: '30px', backgroundColor: '#16a34a' }}
                            onClick={() => handleAcceptCollaboration(item.id, item.instituteName)}
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button 
                            className="btn outline-btn"
                            style={{ padding: '4px 8px', fontSize: '12px', height: '30px', color: '#dc2626' }}
                            onClick={() => handleDeclineCollaboration(item.id, item.instituteName)}
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {item.status === 'Active' && (
                        <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> MoU Partner
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredIncoming.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    No incoming requests found. When an Institute submits a request from their dashboard, it will appear here immediately!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collaboration Options */}
      <div className="options-card">
        <div className="chart-header">
          <h3><Handshake size={18} className="text-blue inline-block mr-2" style={{ verticalAlign: 'middle' }}/> Collaboration Options for Employers</h3>
          <p>Standard Maharashtra government framework for industry-academia engagement.</p>
        </div>
        <div className="options-row">
          <CollabOption title="Industry Visit" icon={Building2} colorClass="blue" />
          <CollabOption title="Guest Lecture" icon={Users} colorClass="purple" />
          <CollabOption title="Apprenticeship" icon={Award} colorClass="orange" />
          <CollabOption title="Internship" icon={Briefcase} colorClass="green" />
          <CollabOption title="Joint Training" icon={Handshake} colorClass="blue" />
          <CollabOption title="Lab Support" icon={Monitor} colorClass="red" />
          <CollabOption title="Equipment Support" icon={PenTool} colorClass="purple" />
          <CollabOption title="Faculty Training" icon={GraduationCap} colorClass="green" />
          <CollabOption title="Curriculum Feedback" icon={BookOpen} colorClass="orange" />
        </div>
      </div>

      {/* Start a New Collaboration Form */}
      <div className="bottom-grid-6-4 mt-6">
        <div className="form-card h-full">
          <div className="form-card-header">
            <div className="panel-icon-circle blue"><Plus size={16}/></div>
            <div>
              <h3>Initiate Employer Collaboration Offer</h3>
              <p>Propose apprenticeship slots or lab sponsorship to a Maharashtra institute.</p>
            </div>
          </div>
          <form onSubmit={handleCreateCollabSubmit} className="form-card-body">
            <div className="form-grid-2col">
              <div className="form-group">
                <label>Target Institute *</label>
                <select 
                  value={newCollabForm.institute}
                  onChange={(e) => setNewCollabForm({ ...newCollabForm, institute: e.target.value })}
                >
                  <option value="Government ITI Pune">Government ITI Pune</option>
                  <option value="Government Polytechnic Pune">Government Polytechnic Pune</option>
                  <option value="Shree Ganesh ITI Pune">Shree Ganesh ITI Pune</option>
                  <option value="Government ITI Nashik">Government ITI Nashik</option>
                  <option value="Government Polytechnic Nagpur">Government Polytechnic Nagpur</option>
                </select>
              </div>
              <div className="form-group">
                <label>District *</label>
                <select 
                  value={newCollabForm.district}
                  onChange={(e) => setNewCollabForm({ ...newCollabForm, district: e.target.value })}
                >
                  <option value="Pune">Pune</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                </select>
              </div>
              <div className="form-group">
                <label>Program / Trade *</label>
                <select 
                  value={newCollabForm.program}
                  onChange={(e) => setNewCollabForm({ ...newCollabForm, program: e.target.value })}
                >
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Fitter & Machinist">Fitter & Machinist</option>
                  <option value="Automobile / EV">Automobile / EV</option>
                </select>
              </div>
            </div>
            
            <div className="form-grid-2col mt-4">
              <div className="form-group">
                <label>Required Skill *</label>
                <input 
                  type="text" 
                  placeholder="e.g. CNC Programming, PLC Automation" 
                  value={newCollabForm.skill}
                  onChange={(e) => setNewCollabForm({ ...newCollabForm, skill: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Collaboration Type *</label>
                <select 
                  value={newCollabForm.type}
                  onChange={(e) => setNewCollabForm({ ...newCollabForm, type: e.target.value })}
                >
                  <option value="Apprenticeship">Apprenticeship</option>
                  <option value="Internship">Internship</option>
                  <option value="Joint Training">Joint Training</option>
                  <option value="Lab Support">Lab Support</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration *</label>
                <select 
                  value={newCollabForm.duration}
                  onChange={(e) => setNewCollabForm({ ...newCollabForm, duration: e.target.value })}
                >
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                </select>
              </div>
            </div>
            
            <div className="form-grid-2col mt-4">
              <div className="form-group">
                <label>Number of Students *</label>
                <input 
                  type="number" 
                  placeholder="e.g. 20" 
                  value={newCollabForm.students}
                  onChange={(e) => setNewCollabForm({ ...newCollabForm, students: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Industry Mentor Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rajesh Patil (Plant Head)" 
                  value={newCollabForm.mentor}
                  onChange={(e) => setNewCollabForm({ ...newCollabForm, mentor: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group full-width mt-4">
              <label>Description & Scope</label>
              <textarea 
                placeholder="Share details about shop-floor facilities, stipends, or training goals..." 
                rows="3"
                value={newCollabForm.description}
                onChange={(e) => setNewCollabForm({ ...newCollabForm, description: e.target.value })}
              ></textarea>
            </div>

            <div className="form-actions-right mt-6">
              <button type="submit" className="btn primary-btn">
                Publish Collaboration Offer
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Proposal Detail Modal */}
      {selectedProposal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setSelectedProposal(null)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={24} color="#2563eb" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{selectedProposal.instituteName}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Collaboration Proposal</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProposal(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                background: '#f8fafc',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '13px'
              }}>
                <div><strong>Sector:</strong> {selectedProposal.sector}</div>
                <div><strong>Trade/Program:</strong> {selectedProposal.trade}</div>
                <div><strong>Skill Focus:</strong> {selectedProposal.skill}</div>
                <div><strong>Type:</strong> {selectedProposal.type}</div>
                <div><strong>Candidate Batch:</strong> {selectedProposal.students} Students</div>
                <div><strong>Duration:</strong> {selectedProposal.duration}</div>
              </div>

              <div>
                <strong style={{ fontSize: '13px' }}>Expected Outcome:</strong>
                <p style={{ margin: '4px 0', fontSize: '13px', color: '#475569' }}>{selectedProposal.outcome}</p>
              </div>

              <div>
                <strong style={{ fontSize: '13px' }}>Proposal Note from Institute:</strong>
                <p style={{
                  margin: '4px 0',
                  fontSize: '13px',
                  color: '#475569',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  padding: '10px',
                  borderRadius: '6px'
                }}>
                  {selectedProposal.message}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: selectedProposal.status === 'Active' ? '#f0fdf4' : '#fff7ed',
                  color: selectedProposal.status === 'Active' ? '#16a34a' : '#ea580c'
                }}>
                  Status: {selectedProposal.status}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedProposal.status === 'Pending Review' && (
                    <button 
                      className="btn primary-btn"
                      style={{ backgroundColor: '#16a34a', padding: '6px 14px', fontSize: '12px' }}
                      onClick={() => {
                        handleAcceptCollaboration(selectedProposal.id, selectedProposal.instituteName);
                        setSelectedProposal(null);
                      }}
                    >
                      <Check size={14} /> Accept Proposal
                    </button>
                  )}
                  <button 
                    className="btn outline-btn" 
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                    onClick={() => setSelectedProposal(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryCollaboration;
