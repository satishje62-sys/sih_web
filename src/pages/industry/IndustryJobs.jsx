import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Users, Wrench, GraduationCap, BookOpen, Plus, Search, 
  Filter, MoreHorizontal, X, ArrowUp, CheckCircle, AlertCircle, Building2, MapPin
} from 'lucide-react';
import { getPublishedJobs, addPublishedJob } from '../../utils/jobStorage';
import { getCurrentUser } from '../../utils/authStorage';
import './IndustryJobs.css';

const JobKpiCard = ({ title, value, change, icon: Icon, colorClass }) => (
  <div className={`job-kpi-card ${colorClass}`}>
    <div className="kpi-icon-header">
      <div className="kpi-icon"><Icon size={20} /></div>
    </div>
    <div className="kpi-content">
      <h3>{title}</h3>
      <div className="kpi-value">{value}</div>
      <div className="kpi-change positive">
        <ArrowUp size={14} />
        <span>{change}</span>
        <span className="vs-text">vs last month</span>
      </div>
    </div>
  </div>
);

const initialFormState = {
  role: '',
  department: 'Manufacturing',
  vacancies: '',
  loc: 'Pune, Maharashtra',
  empType: 'Full Time',
  hiringTimeline: '',
  qualifications: ['ITI', 'Diploma'],
  experience: '1 - 2 Years',
  skills: [
    { name: 'CNC Operating', proficiency: 'intermediate', type: 'mandatory' },
    { name: 'Safety Standards', proficiency: 'beginner', type: 'preferred' }
  ],
  salaryMin: '20000',
  salaryMax: '30000',
  shift: 'General Shift (9 AM - 5 PM)',
  description: '',
  deadline: ''
};

const IndustryJobs = () => {
  const [currentUser] = useState(() => getCurrentUser('employer'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [jobsData, setJobsData] = useState(() => getPublishedJobs());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [qualFilter, setQualFilter] = useState('All Qualification');
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    const handleUpdate = () => {
      setJobsData(getPublishedJobs());
    };
    window.addEventListener('skillbridge:jobPublished', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('skillbridge:jobPublished', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleQualificationToggle = (val) => {
    setForm(prev => {
      const exists = prev.qualifications.includes(val);
      return {
        ...prev,
        qualifications: exists 
          ? prev.qualifications.filter(q => q !== val)
          : [...prev.qualifications, val]
      };
    });
  };

  const handleSkillChange = (index, field, value) => {
    setForm(prev => {
      const updated = [...prev.skills];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, skills: updated };
    });
  };

  const handleAddSkill = () => {
    setForm(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', proficiency: 'intermediate', type: 'mandatory' }]
    }));
  };

  const handleRemoveSkill = (index) => {
    if (form.skills.length <= 1) return;
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handlePublishJob = (e) => {
    e?.preventDefault();
    if (!form.role.trim()) {
      setErrorMessage('Please enter a Job Title.');
      return;
    }
    if (!form.vacancies || Number(form.vacancies) <= 0) {
      setErrorMessage('Please enter valid number of vacancies.');
      return;
    }
    if (!form.loc.trim()) {
      setErrorMessage('Please select job location.');
      return;
    }

    setErrorMessage('');

    const formattedQual = form.qualifications.length > 0 
      ? form.qualifications.join(' / ') 
      : 'ITI / Diploma';

    const validSkills = form.skills
      .filter(s => s.name.trim().length > 0);

    const skillsSummary = validSkills.length > 0 
      ? validSkills.map(s => s.name).join(', ') 
      : 'Industrial Skills';

    const newJob = {
      id: `job-${Date.now()}`,
      role: form.role.trim(),
      company: currentUser?.companyName || 'Registered Employer',
      department: form.department,
      vacancies: Number(form.vacancies),
      loc: form.loc,
      qual: form.qualifications.length > 0 ? form.qualifications : ['ITI'],
      qualText: formattedQual,
      skills: validSkills.length > 0 ? validSkills : [{ name: form.role, proficiency: 'intermediate', type: 'mandatory' }],
      skillsText: skillsSummary,
      exp: form.experience || '1-3 Years',
      salary: form.salaryMin && form.salaryMax 
        ? `₹${Number(form.salaryMin).toLocaleString('en-IN')} - ₹${Number(form.salaryMax).toLocaleString('en-IN')}`
        : '₹20,000 - ₹30,000',
      salaryMin: Number(form.salaryMin) || 20000,
      salaryMax: Number(form.salaryMax) || 30000,
      empType: form.empType,
      shift: form.shift,
      time: form.hiringTimeline || 'Immediate',
      deadline: form.deadline || 'Within 30 Days',
      description: form.description.trim() || `Urgent requirement for ${form.role} at ABC Industries Pvt. Ltd. Candidates should be diligent, safety-conscious, and trained in relevant technical trade skills.`,
      status: 'Active',
      postedAt: 'Just now',
      timestamp: Date.now()
    };

    // Save to shared job store
    const updatedJobs = addPublishedJob(newJob);
    setJobsData(updatedJobs);
    setIsSidebarOpen(false);
    setForm(initialFormState);
    showToast(`🎉 "${newJob.role}" published successfully! Live on Institute & Student Portals.`);
  };

  // Filtered jobs
  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = !searchQuery || 
      (job.role && job.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.loc && job.loc.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.skillsText && job.skillsText.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All Status' || job.status === statusFilter;
    const matchesQual = qualFilter === 'All Qualification' || 
      (Array.isArray(job.qual) ? job.qual.some(q => q.toLowerCase().includes(qualFilter.toLowerCase())) : (job.qualText || '').includes(qualFilter));

    return matchesSearch && matchesStatus && matchesQual;
  });

  const totalVacancies = jobsData.reduce((acc, curr) => acc + (Number(curr.vacancies) || 0), 0);
  const activeJobsCount = jobsData.filter(j => j.status === 'Active').length;

  return (
    <div className="dashboard-page jobs-page relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#065f46',
          color: 'white',
          padding: '16px 22px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          fontSize: '15px',
          fontWeight: '500',
          border: '1px solid #10b981',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <CheckCircle size={22} className="text-green-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Job Openings</h1>
          <p className="page-subtitle">Post your current hiring requirements and help build a skilled workforce for Maharashtra.</p>
        </div>
        <button className="btn primary-btn" onClick={() => { setIsSidebarOpen(true); setErrorMessage(''); }}>
          <Plus size={16} /> Post New Job
        </button>
      </div>

      <div className="jobs-kpi-grid">
        <JobKpiCard title="Active Jobs" value={activeJobsCount.toString()} change="+3" icon={Briefcase} colorClass="green" />
        <JobKpiCard title="Total Vacancies" value={totalVacancies.toString()} change="+50" icon={Users} colorClass="blue" />
        <JobKpiCard title="ITI-Level Jobs" value="86" change="+12" icon={Wrench} colorClass="purple" />
        <JobKpiCard title="Diploma-Level Jobs" value="102" change="+20" icon={GraduationCap} colorClass="orange" />
        <JobKpiCard title="Higher-Education Jobs" value="60" change="+16" icon={BookOpen} colorClass="red" />
      </div>

      <div className="table-card">
        <div className="table-header-bar">
          <div className="table-title">
            <h3>All Job Openings ({filteredJobs.length})</h3>
          </div>
          <div className="table-filters">
            <div className="search-input">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search by job role, location or skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Closed</option>
            </select>
            <select 
              className="filter-select"
              value={qualFilter}
              onChange={(e) => setQualFilter(e.target.value)}
            >
              <option>All Qualification</option>
              <option>ITI</option>
              <option>Diploma</option>
              <option>B.E. / B.Tech</option>
            </select>
          </div>
        </div>
        
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Role</th>
                <th>Vacancies</th>
                <th>Location</th>
                <th>Qualification</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Hiring Timeline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No job openings found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => (
                  <tr key={job.id}>
                    <td className="font-medium text-dark">
                      <div style={{fontWeight: 600}}>{job.role}</div>
                      {job.postedAt === 'Just now' && (
                        <span style={{fontSize: '11px', color: '#16a34a', fontWeight: 600}}>● Just Published</span>
                      )}
                    </td>
                    <td><span style={{fontWeight: 600, color: '#2563eb'}}>{job.vacancies}</span></td>
                    <td>{job.loc}</td>
                    <td>{Array.isArray(job.qual) ? job.qual.join(' / ') : job.qualText || job.qual}</td>
                    <td>{job.skillsText || (Array.isArray(job.skills) ? job.skills.map(s => s.name).join(', ') : '')}</td>
                    <td>{job.exp}</td>
                    <td>{job.time}</td>
                    <td>
                      <span className={`status-badge ${(job.status || 'active').toLowerCase()}`}>{job.status || 'Active'}</span>
                    </td>
                    <td><button className="action-dots"><MoreHorizontal size={16}/></button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="showing-text">Showing {filteredJobs.length} of {jobsData.length} jobs</div>
          <div className="pagination">
            <button className="page-btn"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg></button>
            <button className="page-btn active">1</button>
            <button className="page-btn"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg></button>
          </div>
        </div>
      </div>

      <div className="promo-banner mt-4">
        <div className="promo-icon"><Users size={32} className="text-blue" /></div>
        <div className="promo-content">
          <strong>Hire Skilled Talent. Build a Stronger Maharashtra.</strong>
          <p>Your hiring needs help shape future training programs for a skilled and productive workforce.</p>
        </div>
      </div>

      {/* Slide-out Panel */}
      {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <div className={`slide-panel ${isSidebarOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>Post New Job</h2>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>
        
        <form onSubmit={handlePublishJob} className="panel-content">
          {errorMessage && (
            <div style={{
              backgroundColor: '#fef2f2', 
              color: '#dc2626', 
              padding: '12px 16px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '1rem',
              fontSize: '14px',
              border: '1px solid #fca5a5'
            }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-section">
            <h3 className="section-title"><span className="circle-num">1</span> Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Job Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. CNC Machine Operator" 
                  value={form.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select 
                  value={form.department} 
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Automotive & EV">Automotive & EV</option>
                </select>
              </div>
              <div className="form-group">
                <label>Number of Vacancies *</label>
                <input 
                  type="number" 
                  min="1"
                  placeholder="e.g. 10" 
                  value={form.vacancies}
                  onChange={(e) => handleInputChange('vacancies', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Job Location *</label>
                <select 
                  value={form.loc} 
                  onChange={(e) => handleInputChange('loc', e.target.value)}
                  required
                >
                  <option value="Pune, Maharashtra">Pune, Maharashtra</option>
                  <option value="Chakan, Pune">Chakan, Pune</option>
                  <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                  <option value="Nashik, Maharashtra">Nashik, Maharashtra</option>
                  <option value="Aurangabad, Maharashtra">Aurangabad, Maharashtra</option>
                  <option value="Nagpur, Maharashtra">Nagpur, Maharashtra</option>
                </select>
              </div>
              <div className="form-group">
                <label>Employment Type *</label>
                <select 
                  value={form.empType} 
                  onChange={(e) => handleInputChange('empType', e.target.value)}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                </select>
              </div>
              <div className="form-group">
                <label>Hiring Timeline *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Immediate / Nov 2025" 
                  value={form.hiringTimeline}
                  onChange={(e) => handleInputChange('hiringTimeline', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><span className="circle-num">2</span> Qualification (Select all applicable)</h3>
            <div className="checkbox-grid">
              {['ITI', 'Diploma', 'B.E. / B.Tech', 'Other Higher Education'].map((q) => (
                <label key={q} className="checkbox-label" style={{ cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    checked={form.qualifications.includes(q)}
                    onChange={() => handleQualificationToggle(q)}
                  /> {q}
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><span className="circle-num">3</span> Experience (Select preferred experience level)</h3>
            <div className="checkbox-grid">
              {['Fresher', '1 - 2 Years', '3 - 5 Years', '5+ Years'].map((expOption) => (
                <label key={expOption} className="checkbox-label" style={{ cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="experienceGroup"
                    checked={form.experience === expOption}
                    onChange={() => handleInputChange('experience', expOption)}
                  /> {expOption}
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><span className="circle-num">4</span> Required Skills</h3>
            <div className="skills-row-header">
              <div style={{flex: 2}}>Skill</div>
              <div style={{flex: 1}}>Required Proficiency</div>
              <div style={{flex: 1}}>Type</div>
              <div style={{width: '32px'}}></div>
            </div>

            {form.skills.map((skillItem, idx) => (
              <div className="skills-row" key={idx}>
                <div style={{flex: 2}}>
                  <input 
                    type="text" 
                    placeholder="e.g. CNC Operating, PLC, Wiring..." 
                    value={skillItem.name}
                    onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                  />
                </div>
                <div style={{flex: 1}}>
                  <select 
                    value={skillItem.proficiency}
                    onChange={(e) => handleSkillChange(idx, 'proficiency', e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div style={{flex: 1}}>
                  <select 
                    value={skillItem.type}
                    onChange={(e) => handleSkillChange(idx, 'type', e.target.value)}
                  >
                    <option value="mandatory">Mandatory</option>
                    <option value="preferred">Preferred</option>
                  </select>
                </div>
                <button 
                  type="button"
                  className="del-btn" 
                  onClick={() => handleRemoveSkill(idx)}
                  title="Remove Skill"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            ))}

            <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
              <Plus size={14}/> Add Another Skill
            </button>
          </div>

          <div className="form-section">
            <h3 className="section-title"><span className="circle-num">5</span> Additional Information</h3>
            <div className="form-grid">
              <div className="form-group salary-group">
                <label>Salary Range (₹ per month)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={form.salaryMin}
                    onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                  />
                  <span className="self-center">to</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={form.salaryMax}
                    onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Shift</label>
                <select 
                  value={form.shift}
                  onChange={(e) => handleInputChange('shift', e.target.value)}
                >
                  <option value="General Shift (9 AM - 5 PM)">General Shift (9 AM - 5 PM)</option>
                  <option value="1st Shift (6 AM - 2 PM)">1st Shift (6 AM - 2 PM)</option>
                  <option value="2nd Shift (2 PM - 10 PM)">2nd Shift (2 PM - 10 PM)</option>
                  <option value="3rd Shift (10 PM - 6 AM)">3rd Shift (10 PM - 6 AM)</option>
                  <option value="Rotational Shifts">Rotational Shifts</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Job Description *</label>
                <textarea 
                  placeholder="Describe the role, responsibilities, technical expectations, and other details..." 
                  rows="4"
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                ></textarea>
                <div className="char-count">{form.description.length}/1000</div>
              </div>
              <div className="form-group">
                <label>Application Deadline *</label>
                <input 
                  type="date" 
                  value={form.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="panel-footer" style={{marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0'}}>
            <button type="button" className="btn outline-btn" onClick={() => setIsSidebarOpen(false)}>Cancel</button>
            <div className="flex gap-2">
              <button 
                type="button" 
                className="btn outline-btn text-blue border-blue"
                onClick={() => {
                  showToast('Draft saved successfully!');
                  setIsSidebarOpen(false);
                }}
              >
                Save Draft
              </button>
              <button 
                type="submit" 
                className="btn primary-btn"
                style={{ backgroundColor: '#2563eb', color: '#fff', fontWeight: 600, padding: '0.65rem 1.4rem' }}
              >
                Publish Job
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};

export default IndustryJobs;
