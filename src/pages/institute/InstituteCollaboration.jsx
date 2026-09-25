import React, { useState, useEffect } from 'react';
import { 
  Handshake, Building2, Users, Briefcase, GraduationCap, ChevronDown, 
  Search, RefreshCw, ChevronRight, X, Send, ArrowRight, CheckCircle2,
  Clock, Sparkles, Building, Check, Award
} from 'lucide-react';
import { getCollaborations, addCollaboration } from '../../utils/collaborationStorage';
import { getCurrentUser } from '../../utils/authStorage';
import './InstituteCollaboration.css';

const InstituteCollaboration = () => {
  const [currentUser] = useState(() => getCurrentUser('institute'));
  const [collaborations, setCollaborations] = useState(() => getCollaborations());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedCollabDetail, setSelectedCollabDetail] = useState(null);

  // Form State
  const [form, setForm] = useState({
    industryName: 'Tata Motors Ltd.',
    sector: 'Automobile',
    trade: 'Mechanical & Fitter',
    skill: 'CNC Machining & Tool Setting',
    type: 'Apprenticeship',
    students: '25',
    duration: '6 Months',
    outcome: 'Industry Certified Dual Training',
    message: ''
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Sync real-time with storage & cross-tab events
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

  const handleSendRequest = (e) => {
    e.preventDefault();
    if (!form.industryName.trim()) {
      alert('Please enter an Industry Name.');
      return;
    }
    if (!form.skill.trim()) {
      alert('Please enter the Required Skill.');
      return;
    }
    if (!form.students || Number(form.students) <= 0) {
      alert('Please specify the number of students.');
      return;
    }

    const newRequest = {
      id: `collab-${Date.now()}`,
      instituteName: currentUser?.name || 'Registered Institute',
      industryName: form.industryName.trim(),
      sector: form.sector,
      trade: form.trade,
      skill: form.skill.trim(),
      type: form.type,
      students: Number(form.students),
      duration: form.duration,
      outcome: form.outcome,
      message: form.message.trim() || `Requesting ${form.type.toLowerCase()} collaboration for ${form.students} trainees in ${form.skill}.`,
      status: 'Pending Review',
      date: 'Just now',
      timestamp: Date.now()
    };

    const updated = addCollaboration(newRequest);
    setCollaborations(updated);
    setForm(prev => ({
      ...prev,
      message: ''
    }));

    showToast(`🎉 Collaboration request sent to "${newRequest.industryName}"! Data forwarded to Industry Dashboard.`);
  };

  const filteredList = collaborations.filter(collab => {
    const matchesSearch = !searchQuery || 
      collab.industryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.trade.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'All' || collab.type === filterType;
    const matchesStatus = filterStatus === 'All' || collab.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  const activeCount = collaborations.filter(c => c.status === 'Active').length;
  const pendingCount = collaborations.filter(c => c.status === 'Pending Review').length;
  const totalStudents = collaborations.reduce((acc, curr) => acc + (Number(curr.students) || 0), 0);

  return (
    <div className="institute-collaboration">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification-banner">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="header-title">
          <div className="title-icon">
            <Handshake size={24} />
          </div>
          <div>
            <h1>Industry Collaboration Portal</h1>
            <p>Build direct partnerships with Maharashtra industries for practical training, apprenticeships, and MoUs.</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="last-updated">
            <span className="icon">⏱</span>
            <div>
              <span className="label">Live Connection</span>
              <span className="time">Industry Portal Synced</span>
            </div>
          </div>
          <button 
            className="primary-btn"
            onClick={() => document.querySelector('.request-form-card')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="icon">+</span> Request Collaboration
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon blue"><Building2 size={20} /></div>
            <span>Industry Partners</span>
          </div>
          <div className="metric-value">{new Set(collaborations.map(c => c.industryName)).size}</div>
          <div className="metric-trend positive">Active industry connections</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon green"><Users size={20} /></div>
            <span>Active Collaborations</span>
          </div>
          <div className="metric-value">{activeCount}</div>
          <div className="metric-trend positive">MoUs in execution</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon orange"><Clock size={20} /></div>
            <span>Pending Review</span>
          </div>
          <div className="metric-value">{pendingCount}</div>
          <div className="metric-trend neutral">Awaiting industry response</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon purple"><GraduationCap size={20} /></div>
            <span>Trainees Benefiting</span>
          </div>
          <div className="metric-value">{totalStudents}</div>
          <div className="metric-trend positive">Students in practical pipeline</div>
        </div>
      </div>

      <div className="main-content-area">
        {/* Left Panel: Collaboration List */}
        <div className="left-panel">
          <div className="list-card">
            <div className="card-header border-bottom">
              <h3>Collaborations & Requests ({filteredList.length})</h3>
              <div className="header-filters">
                <div className="search-box">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search industry, skill..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-group mini">
                  <label>Type</label>
                  <div className="select-wrapper">
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                      <option value="All">All</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                      <option value="Internship">Internship</option>
                      <option value="Joint Training">Joint Training</option>
                      <option value="Industry Visit">Industry Visit</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="filter-group mini">
                  <label>Status</label>
                  <div className="select-wrapper">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="All">All</option>
                      <option value="Active">Active</option>
                      <option value="Pending Review">Pending Review</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <button 
                  className="outline-btn small"
                  onClick={() => { setSearchQuery(''); setFilterType('All'); setFilterStatus('All'); }}
                >
                  <RefreshCw size={14} /> Reset
                </button>
              </div>
            </div>

            <table className="collab-table">
              <thead>
                <tr>
                  <th>Industry Partner</th>
                  <th>Sector</th>
                  <th>Collaboration Type</th>
                  <th>Skill Focus</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((c) => (
                  <tr key={c.id} onClick={() => setSelectedCollabDetail(c)} style={{ cursor: 'pointer' }}>
                    <td className="industry-cell">
                      <div className="company-logo tm">
                        {c.industryName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <strong>{c.industryName}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{c.trade || 'Vocational Trade'}</div>
                      </div>
                    </td>
                    <td>{c.sector}</td>
                    <td>
                      <span className={`type-badge ${c.type === 'Apprenticeship' ? 'blue' : c.type === 'Internship' ? 'purple' : 'cyan'}`}>
                        {c.type}
                      </span>
                    </td>
                    <td><strong>{c.skill}</strong></td>
                    <td>{c.students} Trainees</td>
                    <td>
                      <span className={`status-pill ${c.status === 'Active' ? 'active' : 'pending'}`}>
                        • {c.status}
                      </span>
                    </td>
                    <td className="activity-cell">
                      <span className="date">{c.date || 'Recent'}</span>
                    </td>
                    <td><ChevronRight size={16} className="chevron" /></td>
                  </tr>
                ))}

                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      No collaborations matching criteria. Send a new collaboration request from the right panel!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            <div className="table-footer-note">
              <Sparkles size={14} color="#3b82f6" />
              <span>All requests sent from here immediately reflect on the respective Industry Employer's portal in real-time.</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Working Request Collaboration Form */}
        <div className="right-panel">
          <div className="request-form-card">
            <div className="card-header border-bottom">
              <div className="card-title">
                <div className="icon-wrapper blue"><Handshake size={18} /></div>
                <div>
                  <h3>Request Collaboration</h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Send live proposal to Industry Dashboard</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSendRequest} className="form-body">
              <div className="form-group full-width">
                <label>Industry Name <span className="req">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Tata Motors Ltd., ABC Industries" 
                  value={form.industryName}
                  onChange={(e) => setForm({ ...form, industryName: e.target.value })}
                  list="industry-suggestions"
                  required
                />
                <datalist id="industry-suggestions">
                  <option value="ABC Industries Pvt. Ltd." />
                  <option value="Tata Motors Ltd." />
                  <option value="L&T Construction" />
                  <option value="Bajaj Auto" />
                  <option value="Bharat Forge Ltd." />
                  <option value="Bosch India" />
                  <option value="Mahindra & Mahindra" />
                </datalist>
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label>Sector <span className="req">*</span></label>
                  <div className="select-wrapper form-select">
                    <select 
                      value={form.sector} 
                      onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    >
                      <option value="Automobile">Automobile</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Construction">Construction</option>
                      <option value="Electrical & Electronics">Electrical & Electronics</option>
                      <option value="Automation & IT">Automation & IT</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="form-group half">
                  <label>Trade / Program <span className="req">*</span></label>
                  <div className="select-wrapper form-select">
                    <select 
                      value={form.trade} 
                      onChange={(e) => setForm({ ...form, trade: e.target.value })}
                    >
                      <option value="Mechanical & Fitter">Mechanical & Fitter</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Machinist">Machinist</option>
                      <option value="Welder">Welder</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Required Skill / Subject Focus <span className="req">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. PLC Programming, CNC Machining, EV Battery" 
                  value={form.skill}
                  onChange={(e) => setForm({ ...form, skill: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Collaboration Type <span className="req">*</span></label>
                  <div className="select-wrapper form-select">
                    <select 
                      value={form.type} 
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      <option value="Apprenticeship">Apprenticeship</option>
                      <option value="Internship">Internship</option>
                      <option value="Joint Training">Joint Training</option>
                      <option value="Industry Visit">Industry Visit</option>
                      <option value="Lab Support">Lab Support</option>
                      <option value="Faculty Training">Faculty Training</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="form-group half">
                  <label>Number of Students <span className="req">*</span></label>
                  <input 
                    type="number" 
                    min="1"
                    placeholder="e.g. 25" 
                    value={form.students}
                    onChange={(e) => setForm({ ...form, students: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Duration <span className="req">*</span></label>
                  <div className="select-wrapper form-select">
                    <select 
                      value={form.duration} 
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    >
                      <option value="1 Month">1 Month</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                      <option value="1 Year">1 Year</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="form-group half">
                  <label>Expected Outcome <span className="req">*</span></label>
                  <div className="select-wrapper form-select">
                    <select 
                      value={form.outcome} 
                      onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                    >
                      <option value="Industry Certified Dual Training">Industry Certified Dual Training</option>
                      <option value="Hands-on Workshop Exposure">Hands-on Workshop Exposure</option>
                      <option value="Direct Campus Placement Pipeline">Direct Campus Placement Pipeline</option>
                      <option value="Curriculum Alignment MoU">Curriculum Alignment MoU</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Proposal Message / Details</label>
                <textarea 
                  placeholder="Describe your student profile, lab readiness or specific goals..." 
                  rows="3"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="primary-btn full-width submit-btn">
                <Send size={16} /> Send Request to Industry
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedCollabDetail && (
        <div className="collab-modal-overlay" onClick={() => setSelectedCollabDetail(null)}>
          <div className="collab-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={24} color="#2563eb" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{selectedCollabDetail.industryName}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Proposal Details</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedCollabDetail(null)}><X size={18} /></button>
            </div>
            
            <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '8px' }}>
                <div><strong>Sector:</strong> {selectedCollabDetail.sector}</div>
                <div><strong>Program/Trade:</strong> {selectedCollabDetail.trade}</div>
                <div><strong>Skill Focus:</strong> {selectedCollabDetail.skill}</div>
                <div><strong>Collaboration Type:</strong> {selectedCollabDetail.type}</div>
                <div><strong>Batch Size:</strong> {selectedCollabDetail.students} Trainees</div>
                <div><strong>Duration:</strong> {selectedCollabDetail.duration}</div>
              </div>

              <div>
                <strong>Expected Outcome:</strong>
                <p style={{ margin: '4px 0', fontSize: '13px', color: '#475569' }}>{selectedCollabDetail.outcome}</p>
              </div>

              <div>
                <strong>Message:</strong>
                <p style={{ margin: '4px 0', fontSize: '13px', color: '#475569', background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '6px' }}>
                  {selectedCollabDetail.message}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <span className={`status-pill ${selectedCollabDetail.status === 'Active' ? 'active' : 'pending'}`}>
                  Status: {selectedCollabDetail.status}
                </span>
                <button className="primary-btn small" onClick={() => setSelectedCollabDetail(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteCollaboration;
