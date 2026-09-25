import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, Info, CheckCircle2, Calendar, Settings, Wrench, Monitor, Users, 
  ArrowLeft, ArrowRight, Lightbulb, Trophy, AlertCircle, BarChart2, Check, Target, 
  AlertTriangle, TrendingUp, Search, PenTool, Cpu, Shield, ArrowUp, Briefcase, 
  PlayCircle, ChevronDown, MapPin, Building2, X, Award, FileText, Download, 
  RotateCcw, ExternalLink, HelpCircle, CheckCheck
} from 'lucide-react';
import { getCurrentUser } from '../../utils/authStorage';
import './StudentAssessment.css';

// Database of Skills & Real Technical Assessment Questions
const SKILL_TESTS = {
  plc: {
    id: 'plc',
    name: 'PLC Programming',
    category: 'Technical Skills',
    level: 'Technical',
    industryReq: 90,
    currentLevel: 'Intermediate',
    score: 65,
    lastTaken: '16 Jun 2025',
    questions: [
      {
        id: 1,
        text: 'Which of the following is the correct output instruction in ladder logic to turn on a motor when the start button is pressed?',
        options: [
          { id: 'A', text: 'X0 — ( ) M0' },
          { id: 'B', text: 'X0 — ( ) Y0' },
          { id: 'C', text: 'M0 — ( ) Y0' },
          { id: 'D', text: 'X0 — ( ) T0' }
        ],
        correct: 'B',
        hint: 'The start button is typically connected to an input (X) and the motor output is an output (Y).'
      },
      {
        id: 2,
        text: 'What is the primary function of a "Timer On-Delay" (TON) instruction in PLC logic?',
        options: [
          { id: 'A', text: 'Delays turning OFF the output after input goes FALSE' },
          { id: 'B', text: 'Delays turning ON the output for a preset time after input goes TRUE' },
          { id: 'C', text: 'Counts the number of input pulses' },
          { id: 'D', text: 'Generates high-frequency PWM pulses' }
        ],
        correct: 'B',
        hint: 'TON waits for the preset time duration before setting its Done (DN) bit to ON.'
      },
      {
        id: 3,
        text: 'In industrial PLC wiring, what is the main purpose of an Optocoupler on input modules?',
        options: [
          { id: 'A', text: 'To convert 230V AC to 440V 3-phase' },
          { id: 'B', text: 'To provide electrical isolation between high-voltage field wiring and the CPU' },
          { id: 'C', text: 'To store PLC user programs during power loss' },
          { id: 'D', text: 'To speed up network communication' }
        ],
        correct: 'B',
        hint: 'Optical isolation prevents shop-floor electrical spikes from damaging the internal microprocessor.'
      },
      {
        id: 4,
        text: 'Which programming language defined by IEC 61131-3 resembles traditional electrical relay control diagrams?',
        options: [
          { id: 'A', text: 'Structured Text (ST)' },
          { id: 'B', text: 'Instruction List (IL)' },
          { id: 'C', text: 'Ladder Diagram (LD)' },
          { id: 'D', text: 'Sequential Function Chart (SFC)' }
        ],
        correct: 'C',
        hint: 'It uses rungs, power rails, contacts, and coils.'
      },
      {
        id: 5,
        text: 'What happens when a Normally Closed (NC) contact receives a logic TRUE signal from the field?',
        options: [
          { id: 'A', text: 'It conducts electricity' },
          { id: 'B', text: 'It opens and breaks continuity' },
          { id: 'C', text: 'It doubles the current' },
          { id: 'D', text: 'It resets the PLC watchdog timer' }
        ],
        correct: 'B',
        hint: 'An NC contact opens (turns 0) when energized by an active input.'
      }
    ],
    strengths: ['Basic PLC Ladder Logic', 'Relay logic mapping', 'Input/Output addressing'],
    improvement: ['Analog signal scaling and PID tuning', 'Troubleshooting communication faults']
  },
  cnc: {
    id: 'cnc',
    name: 'CNC Programming',
    category: 'Technical Skills',
    level: 'Technical',
    industryReq: 80,
    currentLevel: 'Beginner',
    score: 40,
    lastTaken: 'Not attempted recently',
    questions: [
      {
        id: 1,
        text: 'Which G-code command is universally used for non-cutting rapid positioning traverse?',
        options: [
          { id: 'A', text: 'G01 — Linear Feed Interpolation' },
          { id: 'B', text: 'G00 — Rapid Positioning' },
          { id: 'C', text: 'G02 — Circular Clockwise' },
          { id: 'D', text: 'G28 — Return to Machine Zero' }
        ],
        correct: 'B',
        hint: 'G00 moves machine axes at maximum rapid velocity without touching the workpiece.'
      },
      {
        id: 2,
        text: 'What does the M-code command M08 accomplish in standard Fanuc / Siemens CNC systems?',
        options: [
          { id: 'A', text: 'Spindle Clockwise Rotation' },
          { id: 'B', text: 'Flood Coolant ON' },
          { id: 'C', text: 'Automatic Tool Changer Cycle' },
          { id: 'D', text: 'Program Stop' }
        ],
        correct: 'B',
        hint: 'M08 turns on liquid cutting coolant to lubricate and cool the cutter.'
      },
      {
        id: 3,
        text: 'In standard 3-axis CNC vertical milling, which axis is parallel to the machine tool spindle?',
        options: [
          { id: 'A', text: 'X-axis (Longitudinal table travel)' },
          { id: 'B', text: 'Y-axis (Cross table travel)' },
          { id: 'C', text: 'Z-axis (Spindle vertical travel)' },
          { id: 'D', text: 'A-axis (Rotary indexer)' }
        ],
        correct: 'C',
        hint: 'The axis along which tool depth is adjusted into the workpiece is Z.'
      },
      {
        id: 4,
        text: 'What is the purpose of G43 H01 in CNC programming?',
        options: [
          { id: 'A', text: 'Activate Tool Length Compensation for Tool #1' },
          { id: 'B', text: 'Set workpiece coordinate system G54' },
          { id: 'C', text: 'Cancel cutter radius compensation' },
          { id: 'D', text: 'Select inch measurement system' }
        ],
        correct: 'A',
        hint: 'G43 applies positive tool length offset from the tool register table.'
      },
      {
        id: 5,
        text: 'Which G-code initiates circular interpolation in a counter-clockwise (CCW) direction?',
        options: [
          { id: 'A', text: 'G02' },
          { id: 'B', text: 'G03' },
          { id: 'C', text: 'G81' },
          { id: 'D', text: 'G90' }
        ],
        correct: 'B',
        hint: 'G02 is clockwise circular motion; G03 is counter-clockwise.'
      }
    ],
    strengths: ['Basic G-code syntax', 'Axis coordinate identification'],
    improvement: ['Tool nose radius compensation (G41/G42)', 'Canned drilling and tapping cycles']
  },
  safety: {
    id: 'safety',
    name: 'Electrical Safety',
    category: 'Practical Skills',
    level: 'Practical',
    industryReq: 85,
    currentLevel: 'Beginner',
    score: 30,
    lastTaken: 'Not attempted recently',
    questions: [
      {
        id: 1,
        text: 'What is the primary objective of Lockout / Tagout (LOTO) in manufacturing plants?',
        options: [
          { id: 'A', text: 'To record tool usage in workshop store' },
          { id: 'B', text: 'To prevent accidental re-energization during maintenance or inspection' },
          { id: 'C', text: 'To calculate daily electricity consumption' },
          { id: 'D', text: 'To synchronize motor speeds on assembly conveyor' }
        ],
        correct: 'B',
        hint: 'LOTO isolates hazardous kinetic, pneumatic, and electrical power sources with locks.'
      },
      {
        id: 2,
        text: 'According to standard industrial safety norms, what is the maximum AC touch voltage deemed safe under normal dry conditions?',
        options: [
          { id: 'A', text: '50 Volts AC RMS' },
          { id: 'B', text: '230 Volts AC' },
          { id: 'C', text: '110 Volts AC' },
          { id: 'D', text: '440 Volts AC' }
        ],
        correct: 'A',
        hint: 'Voltages under 50V AC RMS are classified as Safety Extra-Low Voltage (SELV).'
      },
      {
        id: 3,
        text: 'Which fire extinguisher type is strictly PROHIBITED on energized electrical switchgear panels?',
        options: [
          { id: 'A', text: 'Carbon Dioxide (CO2)' },
          { id: 'B', text: 'Dry Chemical Powder (DCP)' },
          { id: 'C', text: 'Water / Soda Acid Extinguisher' },
          { id: 'D', text: 'Clean Agent FE-36' }
        ],
        correct: 'C',
        hint: 'Water is conductive and creates severe electrocution hazard for firefighters.'
      },
      {
        id: 4,
        text: 'What does PPE stand for in industrial safety protocols?',
        options: [
          { id: 'A', text: 'Personal Protective Equipment' },
          { id: 'B', text: 'Power Plant Engineering' },
          { id: 'C', text: 'Programmable Power Electronics' },
          { id: 'D', text: 'Production Performance Evaluation' }
        ],
        correct: 'A',
        hint: 'Safety glasses, insulated gloves, ear defenders, and steel-toe boots are examples.'
      },
      {
        id: 5,
        text: 'Before touching disconnected 3-phase busbars for servicing, what mandatory step must be completed?',
        options: [
          { id: 'A', text: 'Wash busbars with damp industrial cloth' },
          { id: 'B', text: 'Test with calibrated voltage detector and apply discharge grounding leads' },
          { id: 'C', text: 'Switch ON the master circuit breaker' },
          { id: 'D', text: 'Remove phase fuses while power is live' }
        ],
        correct: 'B',
        hint: 'Always verify zero energy with a meter and ground capacitors/bars to earth.'
      }
    ],
    strengths: ['Basic PPE compliance', 'Awareness of high voltage hazards'],
    improvement: ['Arc flash boundary calculations', 'Proper Megger insulation resistance testing']
  }
};

// Database of Historical Verified Test Results for "View Details"
const TEST_DETAILS_DATA = {
  cad: {
    skill: 'CAD (Computer Aided Design)',
    testTitle: 'CAD 2D Drafting & 3D Parametric Modeling Assessment',
    category: 'Tools & Equipment',
    score: 88,
    grade: 'Proficient / Industry Ready',
    passed: true,
    dateTaken: '14 May 2025',
    duration: '22 mins (Allotted: 30 mins)',
    totalQuestions: 20,
    correctCount: 18,
    assessor: 'Directorate of Vocational Education and Training (DVET), Maharashtra',
    credentialId: 'MH-SKB-2025-CAD-9241',
    modules: [
      { name: '2D Sketching, Constraints & Dimensions', score: 100 },
      { name: 'Orthographic & Isometric Projections', score: 90 },
      { name: 'GD&T (Geometric Dimensioning & Tolerancing)', score: 80 },
      { name: '3D Solid Modeling & Feature Tree', score: 85 }
    ],
    strengths: [
      'Accurate parametric constraint application in drafting',
      'Flawless reading of sectional views and drawing tolerances',
      'Fast execution of 3D revolve, chamfer, and extrusion features'
    ],
    recommendations: [
      'Practice advanced sheet metal bend deduction parameters',
      'Explore surface modeling for complex aerodynamic curvature'
    ]
  },
  drawing: {
    skill: 'Mechanical Drawing',
    testTitle: 'Engineering Blueprint & Workshop Drawing Evaluation',
    category: 'Technical Skills',
    score: 82,
    grade: 'Competent & Verified',
    passed: true,
    dateTaken: '28 May 2025',
    duration: '18 mins (Allotted: 25 mins)',
    totalQuestions: 15,
    correctCount: 13,
    assessor: 'Maharashtra Skill Development Board Technical Panel',
    credentialId: 'MH-SKB-2025-MDR-6310',
    modules: [
      { name: 'First Angle & Third Angle Projections', score: 95 },
      { name: 'Limits, Fits & ISO Tolerance Classes', score: 80 },
      { name: 'Welding & Surface Finish Symbols', score: 85 },
      { name: 'Assembly Drawing Bill of Materials (BOM)', score: 75 }
    ],
    strengths: [
      'Proficient differentiation between 1st and 3rd angle projection symbols',
      'Strong understanding of hole/shaft basis limit systems',
      'Clear interpretation of runout and flatness tolerancing'
    ],
    recommendations: [
      'Review complex multi-part pneumatic assembly exploded views'
    ]
  },
  electronics: {
    skill: 'Basic Electronics',
    testTitle: 'Industrial Electronics & Semiconductor Circuits Assessment',
    category: 'Technical Skills',
    score: 78,
    grade: 'Skill Matched',
    passed: true,
    dateTaken: '05 Jun 2025',
    duration: '19 mins (Allotted: 30 mins)',
    totalQuestions: 20,
    correctCount: 16,
    assessor: 'SkillBridge Technical Assessment Directorate',
    credentialId: 'MH-SKB-2025-ELE-1082',
    modules: [
      { name: 'Semiconductor Diodes & Bridge Rectifiers', score: 85 },
      { name: 'BJT & MOSFET Switching in Power Supplies', score: 75 },
      { name: 'Digital Multimeter & Oscilloscope Diagnostics', score: 80 },
      { name: 'Passive Filters & Surge Suppression', score: 72 }
    ],
    strengths: [
      'Accurate forward and reverse diode bias troubleshooting',
      'Competent measurement of ripple voltage and DC power supplies'
    ],
    recommendations: [
      'Enhance familiarity with operational amplifier (Op-Amp) comparator circuits'
    ]
  }
};

const StudentAssessment = () => {
  const navigate = useNavigate();
  const [currentUser] = useState(() => getCurrentUser('student'));
  const [activeTab, setActiveTab] = useState('assessment');
  const [activeCategory, setActiveCategory] = useState('Technical Skills');
  const [currentSkillKey, setCurrentSkillKey] = useState('plc');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [viewDetailsModalSkill, setViewDetailsModalSkill] = useState(null);
  
  // Table search & filter states
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategoryFilter, setTableCategoryFilter] = useState('All');

  // Completed skills tracker
  const [completedSkills, setCompletedSkills] = useState(['cad', 'drawing', 'electronics', 'plc']);
  const [skillsScores, setSkillsScores] = useState({
    cad: 88,
    drawing: 82,
    electronics: 78,
    plc: 65,
    cnc: 40,
    safety: 30
  });

  const currentSkill = SKILL_TESTS[currentSkillKey] || SKILL_TESTS.plc;
  const currentQuestions = currentSkill.questions;
  const currentQuestion = currentQuestions[currentQuestionIndex] || currentQuestions[0];
  const selectedOption = userAnswers[currentQuestion.id] || null;

  // Handler: Select an option for current question
  const handleSelectOption = (optId) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optId
    }));
  };

  // Handler: Switch Question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowHint(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowHint(false);
    }
  };

  // Handler: Submit Assessment
  const handleSubmitAssessment = () => {
    let correctCount = 0;
    currentQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / currentQuestions.length) * 100);
    const passed = scorePct >= 60;
    const skillLevel = scorePct >= 80 ? 'Advanced' : scorePct >= 60 ? 'Intermediate' : 'Beginner';

    const result = {
      score: scorePct,
      correctCount,
      totalQuestions: currentQuestions.length,
      passed,
      skillLevel,
      strengths: scorePct >= 60 ? currentSkill.strengths : ['Completed all technical questions in test'],
      improvement: scorePct >= 80 ? ['Consistent workshop practice recommended'] : currentSkill.improvement
    };

    setTestResult(result);
    setIsSubmitted(true);
    setSkillsScores(prev => ({ ...prev, [currentSkillKey]: scorePct }));
    if (!completedSkills.includes(currentSkillKey)) {
      setCompletedSkills(prev => [...prev, currentSkillKey]);
    }

    setToastMessage(`🎉 Assessment Submitted! You scored ${scorePct}% in ${currentSkill.name}.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Handler: Retake Assessment
  const handleRetakeAssessment = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowHint(false);
    setTestResult(null);
  };

  // Handler: Start a new Skill Test from Skill Gap Action (Improve Skill / Take Assessment)
  const handleStartSkillTest = (skillKey) => {
    const key = SKILL_TESTS[skillKey] ? skillKey : 'plc';
    setCurrentSkillKey(key);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setShowHint(false);
    setTestResult(null);
    setActiveTab('assessment');
    
    const skill = SKILL_TESTS[key];
    if (skill) {
      setActiveCategory(skill.category);
    }
    
    setToastMessage(`📝 Starting new assessment test for "${skill?.name || key}"!`);
    setTimeout(() => setToastMessage(null), 4000);

    setTimeout(() => {
      const el = document.getElementById('quiz-main-card');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  // Handler: View Test Details Modal from Skill Gap Table
  const handleViewTestDetails = (skillKey) => {
    const details = TEST_DETAILS_DATA[skillKey] || {
      skill: SKILL_TESTS[skillKey]?.name || 'Technical Trade Skill',
      testTitle: `${SKILL_TESTS[skillKey]?.name || 'Skill'} Assessment Evaluation Record`,
      category: SKILL_TESTS[skillKey]?.category || 'Technical Skills',
      score: skillsScores[skillKey] || 75,
      grade: (skillsScores[skillKey] || 75) >= 80 ? 'Proficient / Industry Ready' : (skillsScores[skillKey] || 75) >= 60 ? 'Competent' : 'Developing',
      passed: (skillsScores[skillKey] || 75) >= 50,
      dateTaken: 'Recent Assessment',
      duration: '18 mins (Allotted: 25 mins)',
      totalQuestions: 15,
      correctCount: Math.round(((skillsScores[skillKey] || 75) / 100) * 15),
      assessor: 'SkillBridge Technical Assessment Directorate, Maharashtra',
      credentialId: `MH-SKB-2025-${skillKey.toUpperCase()}-7420`,
      modules: [
        { name: 'Core Working Principles & Blueprint Interpretation', score: Math.min(100, (skillsScores[skillKey] || 75) + 8) },
        { name: 'Industrial Machine Operation & Safety Compliance', score: skillsScores[skillKey] || 75 },
        { name: 'Troubleshooting, Fault Diagnosis & Quality Control', score: Math.max(45, (skillsScores[skillKey] || 75) - 10) }
      ],
      strengths: SKILL_TESTS[skillKey]?.strengths || ['Hands-on machine familiarity', 'Basic safety compliance'],
      recommendations: SKILL_TESTS[skillKey]?.improvement || ['Practice advanced parameter configuration']
    };
    setViewDetailsModalSkill(details);
  };

  // Skill Gap Table Rows Configuration
  const GAP_TABLE_ROWS = [
    {
      id: 'plc',
      name: 'PLC Programming',
      category: 'Technical Skills',
      icon: Settings,
      reqLevel: 'Advanced',
      curLevel: 'Intermediate',
      curPct: skillsScores.plc || 65,
      curColor: 'orange',
      gapPct: '35%',
      priority: 'High',
      priorityColor: 'red',
      actionType: 'improve',
      actionText: 'Improve Skill'
    },
    {
      id: 'cnc',
      name: 'CNC Programming',
      category: 'Technical Skills',
      icon: Settings,
      reqLevel: 'Advanced',
      curLevel: 'Beginner',
      curPct: skillsScores.cnc || 40,
      curColor: 'blue',
      gapPct: '40%',
      priority: 'High',
      priorityColor: 'red',
      actionType: 'improve',
      actionText: 'Improve Skill'
    },
    {
      id: 'cad',
      name: 'CAD',
      category: 'Tools & Equipment',
      icon: PenTool,
      reqLevel: 'Advanced',
      curLevel: 'Advanced',
      curPct: skillsScores.cad || 88,
      curColor: 'blue',
      gapPct: '5%',
      priority: 'Low',
      priorityColor: 'green',
      actionType: 'view',
      actionText: 'View Details'
    },
    {
      id: 'safety',
      name: 'Electrical Safety',
      category: 'Practical Skills',
      icon: Shield,
      reqLevel: 'Intermediate',
      curLevel: 'Beginner',
      curPct: skillsScores.safety || 30,
      curColor: 'blue',
      gapPct: '35%',
      priority: 'High',
      priorityColor: 'red',
      actionType: 'take',
      actionText: 'Take Assessment'
    },
    {
      id: 'drawing',
      name: 'Mechanical Drawing',
      category: 'Technical Skills',
      icon: Settings,
      reqLevel: 'Intermediate',
      curLevel: 'Intermediate',
      curPct: skillsScores.drawing || 82,
      curColor: 'orange',
      gapPct: '0%',
      priority: 'Matched',
      priorityColor: 'green',
      actionType: 'view',
      actionText: 'View Details'
    },
    {
      id: 'electronics',
      name: 'Basic Electronics',
      category: 'Technical Skills',
      icon: Cpu,
      reqLevel: 'Beginner',
      curLevel: 'Beginner',
      curPct: skillsScores.electronics || 78,
      curColor: 'blue',
      gapPct: '0%',
      priority: 'Matched',
      priorityColor: 'green',
      actionType: 'view',
      actionText: 'View Details'
    }
  ];

  const filteredGapRows = GAP_TABLE_ROWS.filter(row => {
    const matchesSearch = !tableSearch || 
      row.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      row.category.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesCat = tableCategoryFilter === 'All' || row.category === tableCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate dynamic summary stats
  const totalSkillsCount = 5;
  const completedCount = completedSkills.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalSkillsCount) * 100));

  return (
    <div className="student-assessment">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-floating">
          <CheckCheck size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="header-title">
          <div className="title-icon">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1>Skill Assessment & Gap Analysis</h1>
            <p>Assess your technical capabilities, verify credentials, and bridge your skills for Maharashtra industrial jobs.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="quiz-active-badge">
            <Award size={14} /> Maharashtra State Skill Certified
          </span>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="view-toggle-tabs" style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('assessment')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'assessment' ? '2px solid #3b82f6' : '2px solid transparent', 
            color: activeTab === 'assessment' ? '#3b82f6' : '#64748b', 
            fontWeight: 600, 
            cursor: 'pointer', 
            fontSize: '14px' 
          }}
        >
          📋 Take Assessment
        </button>
        <button 
          onClick={() => setActiveTab('skill-gap')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'skill-gap' ? '2px solid #3b82f6' : '2px solid transparent', 
            color: activeTab === 'skill-gap' ? '#3b82f6' : '#64748b', 
            fontWeight: 600, 
            cursor: 'pointer', 
            fontSize: '14px' 
          }}
        >
          🎯 My Skill Gap ({GAP_TABLE_ROWS.length} Skills Tracked)
        </button>
      </div>

      {/* ================= TAB 1: TAKE ASSESSMENT ================= */}
      {activeTab === 'assessment' && (
        <>
          {/* Top Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="progress-circle-large">
                <svg viewBox="0 0 36 36" className="circular-chart green">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray={`${progressPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="21.5" className="percentage">{progressPercent}%</text>
                </svg>
              </div>
              <div className="metric-details">
                <span className="metric-label">Assessment Progress</span>
                <span className="metric-sub">{completedCount} of {totalSkillsCount} skills verified</span>
                <div className="mini-progress"><div className="progress green" style={{width: `${progressPercent}%`}}></div></div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box blue"><ClipboardList size={20} /></div>
              <div className="metric-details">
                <span className="metric-label">Skills to Assess</span>
                <span className="metric-value">{Math.max(0, totalSkillsCount - completedCount)}</span>
                <span className="metric-sub">pending tests</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box green"><CheckCircle2 size={20} /></div>
              <div className="metric-details">
                <span className="metric-label">Completed Assessments</span>
                <span className="metric-value">{completedCount}</span>
                <span className="metric-sub">verified skills</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box blue"><Calendar size={20} /></div>
              <div className="metric-details">
                <span className="metric-label">Current Active Test</span>
                <span className="metric-value date" style={{ fontSize: '15px' }}>{currentSkill.name}</span>
                <span className="metric-sub">{currentSkill.category}</span>
              </div>
            </div>
          </div>

          {/* Categories / Skills Selector Strip */}
          <div className="categories-section">
            <h3 className="section-title">Select Assessment Category</h3>
            <p className="section-subtitle">Choose a skill category to switch the assessment module:</p>
            
            <div className="category-tabs">
              <button 
                className={`category-tab ${currentSkillKey === 'plc' ? 'active' : ''}`}
                onClick={() => handleStartSkillTest('plc')}
              >
                <Settings size={20} className="cat-icon" />
                <div className="cat-text">
                  <span className="cat-name">PLC Programming</span>
                  <span className="cat-count">Technical • 5 Questions</span>
                </div>
              </button>
              
              <button 
                className={`category-tab ${currentSkillKey === 'cnc' ? 'active' : ''}`}
                onClick={() => handleStartSkillTest('cnc')}
              >
                <Settings size={20} className="cat-icon" />
                <div className="cat-text">
                  <span className="cat-name">CNC Programming</span>
                  <span className="cat-count">Technical • 5 Questions</span>
                </div>
              </button>

              <button 
                className={`category-tab ${currentSkillKey === 'safety' ? 'active' : ''}`}
                onClick={() => handleStartSkillTest('safety')}
              >
                <Shield size={20} className="cat-icon" />
                <div className="cat-text">
                  <span className="cat-name">Electrical Safety</span>
                  <span className="cat-count">Practical • 5 Questions</span>
                </div>
              </button>

              <button 
                className="category-tab"
                onClick={() => handleViewTestDetails('cad')}
                title="View completed CAD test record"
              >
                <PenTool size={20} className="cat-icon" />
                <div className="cat-text">
                  <span className="cat-name">CAD (Passed ✓)</span>
                  <span className="cat-count">Score: 88% • View Details</span>
                </div>
              </button>

              <button 
                className="category-tab"
                onClick={() => handleViewTestDetails('drawing')}
                title="View completed Mechanical Drawing test record"
              >
                <Wrench size={20} className="cat-icon" />
                <div className="cat-text">
                  <span className="cat-name">Mechanical Drawing (Passed ✓)</span>
                  <span className="cat-count">Score: 82% • View Details</span>
                </div>
              </button>
            </div>
          </div>

          {/* Assessment Main Quiz Area */}
          <div className="assessment-main" id="quiz-main-card">
            <div className="left-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  className="back-link" 
                  onClick={() => setActiveTab('skill-gap')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <ArrowLeft size={14} /> View Skill Gap Analysis
                </button>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Trade: <strong>ITI Machinist / Fitter / Electrician</strong>
                </span>
              </div>
              
              <div className="quiz-card">
                <div className="quiz-header">
                  <div className="quiz-title">
                    <div className="icon-wrapper blue">
                      {currentSkillKey === 'safety' ? <Shield size={18} /> : <Settings size={18} />}
                    </div>
                    <div>
                      <h2>{currentSkill.name}</h2>
                      <span className="badge-light blue">{currentSkill.category}</span>
                    </div>
                  </div>
                  <div className="question-progress">
                    <span className="q-count">
                      Question {currentQuestionIndex + 1} of {currentQuestions.length}
                    </span>
                    <div className="q-bar">
                      <div 
                        className="progress blue" 
                        style={{ width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="quiz-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="q-label">Question {currentQuestionIndex + 1} / {currentQuestions.length}</span>
                    {isSubmitted && (
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        color: userAnswers[currentQuestion.id] === currentQuestion.correct ? '#16a34a' : '#dc2626' 
                      }}>
                        {userAnswers[currentQuestion.id] === currentQuestion.correct ? '✓ Correct Answer' : '✗ Incorrect Answer'}
                      </span>
                    )}
                  </div>

                  <p className="question-text">
                    {currentQuestion.text}
                  </p>

                  {/* Options List */}
                  <div className="options-list">
                    {currentQuestion.options.map((opt) => {
                      const isChosen = selectedOption === opt.id;
                      let optionClass = '';

                      if (isSubmitted) {
                        if (opt.id === currentQuestion.correct) {
                          optionClass = 'correct-answer';
                        } else if (isChosen && opt.id !== currentQuestion.correct) {
                          optionClass = 'wrong-answer';
                        }
                      } else if (isChosen) {
                        optionClass = 'selected';
                      }

                      return (
                        <div 
                          key={opt.id} 
                          className={`option-item ${optionClass}`} 
                          onClick={() => handleSelectOption(opt.id)}
                          style={{ cursor: isSubmitted ? 'default' : 'pointer' }}
                        >
                          <div className="radio-circle">
                            {isChosen && <div className="inner-dot"></div>}
                          </div>
                          <span className="opt-letter">{opt.id}.</span>
                          <span className="opt-text">{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Answer Feedback when submitted */}
                  {isSubmitted && (
                    <div className={`quiz-answer-expl ${userAnswers[currentQuestion.id] === currentQuestion.correct ? 'correct' : 'wrong'}`}>
                      <strong>{userAnswers[currentQuestion.id] === currentQuestion.correct ? 'Well Done!' : 'Correction:'}</strong>{' '}
                      Correct Answer is <strong>Option {currentQuestion.correct}</strong>. {currentQuestion.hint}
                    </div>
                  )}

                  {/* Toggle Hint */}
                  {!isSubmitted && (
                    <div style={{ marginTop: '14px' }}>
                      <button 
                        onClick={() => setShowHint(!showHint)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                      >
                        <Lightbulb size={14} /> {showHint ? 'Hide Hint' : 'Show Practical Hint'}
                      </button>

                      {showHint && (
                        <div className="hint-box" style={{ marginTop: '8px' }}>
                          <Lightbulb size={18} className="hint-icon" />
                          <div className="hint-content">
                            <span className="hint-title">Workshop Practical Tip:</span>
                            <p>{currentQuestion.hint}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="quiz-footer">
                  <button 
                    className="outline-btn"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft size={16} /> Previous
                  </button>

                  <div className="right-actions">
                    {currentQuestionIndex < currentQuestions.length - 1 ? (
                      <button 
                        className="primary-btn"
                        onClick={handleNextQuestion}
                      >
                        Next <ArrowRight size={16} />
                      </button>
                    ) : null}

                    {!isSubmitted ? (
                      <button 
                        className="text-btn submit"
                        onClick={handleSubmitAssessment}
                        style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px' }}
                      >
                        <Check size={16} /> Submit Assessment
                      </button>
                    ) : (
                      <button 
                        className="text-btn submit"
                        onClick={handleRetakeAssessment}
                        style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '6px' }}
                      >
                        <RotateCcw size={16} /> Retake Test
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Dynamic Assessment Result Card */}
            <div className="right-panel">
              <div className="result-card">
                <div className="card-header border-bottom">
                  <div className="card-title">
                    <Trophy size={18} className="icon-blue" />
                    <h3>{isSubmitted ? 'Assessment Result' : 'Current Skill Evaluation'}</h3>
                  </div>
                </div>

                <div className="result-body">
                  <div className="score-section">
                    <div className="result-donut">
                      <svg viewBox="0 0 36 36" className="circular-chart green">
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path 
                          className="circle" 
                          strokeDasharray={`${testResult ? testResult.score : skillsScores[currentSkillKey] || 65}, 100`} 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        />
                      </svg>
                      <div className="donut-text">
                        <span className="val">{testResult ? `${testResult.score}%` : `${skillsScores[currentSkillKey] || 65}%`}</span>
                        <span className="lbl">Score</span>
                      </div>
                    </div>
                    
                    <div className="result-details">
                      <h4>{currentSkill.name}</h4>
                      <div className="bar-wrapper">
                        <div className="progress-bar">
                          <div 
                            className="progress blue" 
                            style={{ width: `${testResult ? testResult.score : skillsScores[currentSkillKey] || 65}%` }}
                          ></div>
                        </div>
                        <span>{testResult ? `${testResult.score}%` : `${skillsScores[currentSkillKey] || 65}%`}</span>
                      </div>
                      <div className="level-info">
                        <span className="lvl-label">Skill Level</span>
                        <span className={`level-badge ${testResult ? testResult.skillLevel.toLowerCase() : currentSkill.currentLevel.toLowerCase()}`}>
                          {testResult ? testResult.skillLevel : currentSkill.currentLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="feedback-section">
                    <div className="feedback-box strengths">
                      <div className="box-title">
                        <CheckCircle2 size={16} /> Key Strengths
                      </div>
                      <ul>
                        {(testResult?.strengths || currentSkill.strengths).map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="feedback-box improvement">
                      <div className="box-title">
                        <AlertCircle size={16} /> Recommended Focus Area
                      </div>
                      <ul>
                        {(testResult?.improvement || currentSkill.improvement).map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="result-actions">
                    <button 
                      className="outline-btn full-width"
                      onClick={() => setActiveTab('skill-gap')}
                    >
                      <BarChart2 size={16} /> View Skill Gap Analysis
                    </button>
                    <button 
                      className="primary-btn full-width"
                      onClick={handleRetakeAssessment}
                    >
                      <RotateCcw size={16} /> Retake This Assessment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= TAB 2: MY SKILL GAP ================= */}
      {activeTab === 'skill-gap' && (
        <>
          {/* Top Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card score-card">
              <div className="score-donut-wrap">
                <svg viewBox="0 0 36 36" className="circular-chart green">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray="68, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="21.5" className="percentage">68%</text>
                </svg>
              </div>
              <div className="score-info">
                <span className="metric-label">Overall Skill Score</span>
                <span className="trend positive"><ArrowUp size={12} /> +5% <span className="dim">from last assessment cycle</span></span>
              </div>
            </div>

            <div className="metric-card progress-card">
              <div className="metric-header">
                <div className="metric-icon green"><CheckCircle2 size={16} /></div>
                <div className="metric-text">
                  <span className="metric-label">Skills Matched</span>
                  <div className="metric-val">
                    <span className="val">{completedSkills.length}</span> <span className="sub">/ {GAP_TABLE_ROWS.length}</span>
                  </div>
                </div>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar">
                  <div className="progress green" style={{ width: `${Math.round((completedSkills.length / GAP_TABLE_ROWS.length) * 100)}%` }}></div>
                </div>
                <span className="pct">{Math.round((completedSkills.length / GAP_TABLE_ROWS.length) * 100)}%</span>
              </div>
            </div>

            <div className="metric-card progress-card">
              <div className="metric-header">
                <div className="metric-icon red"><AlertTriangle size={16} /></div>
                <div className="metric-text">
                  <span className="metric-label">Critical Gaps</span>
                  <div className="metric-val">
                    <span className="val">2</span> <span className="sub">/ {GAP_TABLE_ROWS.length}</span>
                  </div>
                </div>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar"><div className="progress red" style={{ width: '33%' }}></div></div>
                <span className="pct">33%</span>
              </div>
            </div>

            <div className="metric-card progress-card">
              <div className="metric-header">
                <div className="metric-icon blue"><TrendingUp size={16} /></div>
                <div className="metric-text">
                  <span className="metric-label">Skills to Improve</span>
                  <div className="metric-val">
                    <span className="val">{GAP_TABLE_ROWS.filter(r => r.actionType === 'improve' || r.actionType === 'take').length}</span> <span className="sub">/ {GAP_TABLE_ROWS.length}</span>
                  </div>
                </div>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar"><div className="progress blue" style={{ width: '50%' }}></div></div>
                <span className="pct">50%</span>
              </div>
            </div>
          </div>

          <div className="main-content">
            <div className="left-column">
              
              {/* Required vs Current Bar Chart */}
              <div className="content-card">
                <div className="card-header border-bottom">
                  <h3>Required Skill vs Current Skill</h3>
                  <div className="card-actions">
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Benchmark: Maharashtra Industrial Clusters</span>
                  </div>
                </div>
                
                <div className="comparison-chart-container">
                  <div className="legend-row">
                    <span className="legend-item"><span className="dot blue-dark"></span> Industry Requirement</span>
                    <span className="legend-item"><span className="dot blue-light"></span> My Verified Skill</span>
                  </div>

                  <div className="bar-charts-list">
                    <div className="bar-chart-item">
                      <div className="skill-icon-name">
                        <div className="s-icon blue"><Settings size={18} /></div>
                        <span className="s-name">PLC Programming</span>
                      </div>
                      <div className="bars-area">
                        <div className="bar-row">
                          <div className="bar blue-dark" style={{ width: '90%' }}></div>
                          <span className="bar-val">90%</span>
                        </div>
                        <div className="bar-row mt">
                          <div className="bar blue-light" style={{ width: `${skillsScores.plc || 65}%` }}></div>
                          <span className="bar-val">{skillsScores.plc || 65}%</span>
                        </div>
                      </div>
                      <div className="gap-badge red">Gap: {90 - (skillsScores.plc || 65)}%</div>
                    </div>

                    <div className="bar-chart-item">
                      <div className="skill-icon-name">
                        <div className="s-icon blue"><Settings size={18} /></div>
                        <span className="s-name">CNC Programming</span>
                      </div>
                      <div className="bars-area">
                        <div className="bar-row">
                          <div className="bar blue-dark" style={{ width: '80%' }}></div>
                          <span className="bar-val">80%</span>
                        </div>
                        <div className="bar-row mt">
                          <div className="bar blue-light" style={{ width: `${skillsScores.cnc || 40}%` }}></div>
                          <span className="bar-val">{skillsScores.cnc || 40}%</span>
                        </div>
                      </div>
                      <div className="gap-badge red">Gap: {80 - (skillsScores.cnc || 40)}%</div>
                    </div>

                    <div className="bar-chart-item">
                      <div className="skill-icon-name">
                        <div className="s-icon blue"><PenTool size={18} /></div>
                        <span className="s-name">CAD</span>
                      </div>
                      <div className="bars-area">
                        <div className="bar-row">
                          <div className="bar blue-dark" style={{ width: '70%' }}></div>
                          <span className="bar-val">70%</span>
                        </div>
                        <div className="bar-row mt">
                          <div className="bar blue-light" style={{ width: `${skillsScores.cad || 88}%` }}></div>
                          <span className="bar-val">{skillsScores.cad || 88}%</span>
                        </div>
                      </div>
                      <div className="gap-badge green">Matched ✓</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Skill Gap Analysis Table */}
              <div className="content-card">
                <div className="card-header border-bottom">
                  <div>
                    <h3>Skill Gap Analysis</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                      Click <strong>Improve Skill</strong> or <strong>Take Assessment</strong> to start a new test. Click <strong>View Details</strong> to view verified evaluation records.
                    </p>
                  </div>
                  <div className="card-actions">
                    <select 
                      className="simple-select mr"
                      value={tableCategoryFilter}
                      onChange={(e) => setTableCategoryFilter(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      <option value="Technical Skills">Technical Skills</option>
                      <option value="Tools & Equipment">Tools & Equipment</option>
                      <option value="Practical Skills">Practical Skills</option>
                    </select>
                    <div className="search-box">
                      <Search size={14} />
                      <input 
                        type="text" 
                        placeholder="Search skill..." 
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <table className="gap-table">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Required Level</th>
                      <th>Current Level</th>
                      <th>Gap</th>
                      <th>Priority</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGapRows.map((row) => {
                      const IconComp = row.icon;
                      return (
                        <tr key={row.id}>
                          <td className="skill-col">
                            <IconComp size={16} className="t-icon" /> {row.name}
                          </td>
                          <td><span className="lvl-text blue">{row.reqLevel}</span></td>
                          <td>
                            <span className={`lvl-text ${row.curColor}`}>{row.curLevel}</span>
                            <div className="mini-bar">
                              <div className={`fill ${row.curColor}`} style={{ width: `${row.curPct}%` }}></div>
                            </div>
                          </td>
                          <td><span className={`gap-pct ${row.priorityColor}`}>{row.gapPct}</span></td>
                          <td><span className={`priority ${row.priorityColor}`}>{row.priority}</span></td>
                          <td>
                            {row.actionType === 'improve' && (
                              <button 
                                className="primary-btn sm"
                                onClick={() => handleStartSkillTest(row.id)}
                                title={`Start new assessment test for ${row.name}`}
                              >
                                {row.actionText} <ArrowRight size={12}/>
                              </button>
                            )}

                            {row.actionType === 'take' && (
                              <button 
                                className="outline-btn sm"
                                onClick={() => handleStartSkillTest(row.id)}
                                title={`Start assessment test for ${row.name}`}
                                style={{ borderColor: '#2563eb', color: '#2563eb' }}
                              >
                                {row.actionText} <ArrowRight size={12}/>
                              </button>
                            )}

                            {row.actionType === 'view' && (
                              <button 
                                className="outline-btn sm"
                                onClick={() => handleViewTestDetails(row.id)}
                                title={`View completed test evaluation details for ${row.name}`}
                              >
                                {row.actionText} <ArrowRight size={12}/>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="right-column">
              {/* Skill Importance Card */}
              <div className="content-card">
                <div className="card-header pb-0">
                  <h3 className="section-title">Why is this skill important?</h3>
                </div>
                <div className="info-body">
                  <div className="skill-focus-header">
                    <Settings size={20} className="icon-blue" />
                    <h4>PLC & Automation Control</h4>
                  </div>
                  <p className="desc-text">
                    Programmable Logic Controllers (PLC) and robotic automation run over 85% of manufacturing and automotive shop floors in Maharashtra (Pune, Chakan, Aurangabad). Mastery guarantees higher salary tiers.
                  </p>
                  
                  <div className="demand-section">
                    <h5 className="demand-title"><Briefcase size={14} /> Industry / Job Demand</h5>
                    <div className="demand-item">
                      <div className="d-icon"><Building2 size={14} /></div>
                      <span className="d-name">Automotive & Manufacturing Line</span>
                      <span className="d-badge orange">High Demand</span>
                    </div>
                    <div className="demand-item">
                      <div className="d-icon"><Target size={14} /></div>
                      <span className="d-name">Automation Maintenance Technician</span>
                      <span className="d-badge red">Very High Demand</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/student/dashboard/industry-jobs')}
                    className="link-action"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    View Related Industry Jobs <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Action Banner */}
              <div className="content-card bg-light">
                <div className="card-header bg-transparent border-bottom">
                  <div className="title-row">
                    <Lightbulb size={18} className="icon-blue" />
                    <h3>Career Action Recommendation</h3>
                  </div>
                </div>
                
                <div className="learning-path-list">
                  <div className="path-item">
                    <div className="p-icon"><Settings size={16} /></div>
                    <div className="p-info">
                      <h4>Take CNC Programming Test</h4>
                      <span className="p-meta">Close 40% gap • 5 Questions</span>
                    </div>
                    <button 
                      className="primary-btn sm"
                      onClick={() => handleStartSkillTest('cnc')}
                    >
                      Start Test
                    </button>
                  </div>

                  <div className="path-item">
                    <div className="p-icon"><Shield size={16} /></div>
                    <div className="p-info">
                      <h4>Take Electrical Safety Test</h4>
                      <span className="p-meta">Close 35% gap • 5 Questions</span>
                    </div>
                    <button 
                      className="primary-btn sm"
                      onClick={() => handleStartSkillTest('safety')}
                    >
                      Start Test
                    </button>
                  </div>

                  <div className="path-item">
                    <div className="p-icon"><Briefcase size={16} /></div>
                    <div className="p-info">
                      <h4>View Open Industry Vacancies</h4>
                      <span className="p-meta">Tata Motors, Adani Solar, Cummins</span>
                    </div>
                    <button 
                      className="outline-btn sm"
                      onClick={() => navigate('/student/dashboard/industry-jobs')}
                    >
                      Explore Jobs
                    </button>
                  </div>
                </div>

                <div className="keep-improving-banner">
                  <div className="banner-icon"><TrendingUp size={20} /></div>
                  <div className="banner-text">
                    <h4>Keep Improving!</h4>
                    <p>Close your skill gaps through assessments to get shortlisted faster by top recruiters.</p>
                    <button 
                      className="primary-btn full-width mt-2"
                      onClick={() => navigate('/student/dashboard/jobs')}
                    >
                      Explore Job Opportunities for My Skills <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* ================= TEST DETAILS MODAL ================= */}
      {viewDetailsModalSkill && (
        <div className="assessment-modal-overlay" onClick={() => setViewDetailsModalSkill(null)}>
          <div className="assessment-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="assessment-modal-header">
              <div>
                <span className="quiz-active-badge">
                  <CheckCircle2 size={13} /> Verified Assessment Record
                </span>
                <h2>{viewDetailsModalSkill.testTitle}</h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Category: {viewDetailsModalSkill.category} • Student: {currentUser?.fullName || 'Student Trainee'} ({currentUser?.educationLevel || 'ITI'} Trainee)
                </span>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setViewDetailsModalSkill(null)}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="assessment-modal-body">
              {/* Score KPIs */}
              <div className="modal-kpi-grid">
                <div className="modal-kpi-card">
                  <div className="modal-kpi-val">{viewDetailsModalSkill.score}%</div>
                  <div className="modal-kpi-lbl">Overall Score Achieved</div>
                </div>
                <div className="modal-kpi-card">
                  <div className="modal-kpi-val" style={{ color: '#16a34a' }}>
                    {viewDetailsModalSkill.correctCount} / {viewDetailsModalSkill.totalQuestions}
                  </div>
                  <div className="modal-kpi-lbl">Correct Answers</div>
                </div>
                <div className="modal-kpi-card">
                  <div className="modal-kpi-val" style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                    {viewDetailsModalSkill.grade}
                  </div>
                  <div className="modal-kpi-lbl">Proficiency Rating</div>
                </div>
              </div>

              {/* Module Competencies Breakdown */}
              <div>
                <div className="modal-section-title">Topic-Level Competency Breakdown</div>
                <div className="modal-modules-list">
                  {viewDetailsModalSkill.modules.map((mod, idx) => (
                    <div key={idx} className="modal-module-item">
                      <div className="module-info-row">
                        <span>{mod.name}</span>
                        <span>{mod.score}%</span>
                      </div>
                      <div className="module-progress-bar">
                        <div 
                          className="module-progress-fill" 
                          style={{ 
                            width: `${mod.score}%`,
                            backgroundColor: mod.score >= 80 ? '#16a34a' : mod.score >= 60 ? '#2563eb' : '#f59e0b'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observed Strengths & Feedback */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <CheckCircle2 size={16} /> Demonstrated Strengths
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#14532d' }}>
                    {viewDetailsModalSkill.strengths.map((str, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Lightbulb size={16} /> Recommendations for Further Practice
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#1e3a8a' }}>
                    {viewDetailsModalSkill.recommendations.map((rec, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Government / SkillBridge Verification Seal */}
              <div className="modal-verified-seal">
                <div className="seal-icon">
                  <Award size={20} />
                </div>
                <div className="seal-text">
                  <strong>{viewDetailsModalSkill.assessor}</strong>
                  <span>Assessment Certificate Credential: <code>{viewDetailsModalSkill.credentialId}</code> • Completed on: {viewDetailsModalSkill.dateTaken}</span>
                </div>
              </div>
            </div>

            <div className="assessment-modal-footer">
              <button 
                className="outline-btn"
                onClick={() => window.print()}
              >
                <Download size={14} /> Download / Print Record
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="primary-btn"
                  onClick={() => {
                    const skillId = viewDetailsModalSkill.skill.toLowerCase().includes('cad') ? 'plc' : 'safety';
                    setViewDetailsModalSkill(null);
                    handleStartSkillTest(skillId);
                  }}
                >
                  <RotateCcw size={14} /> Retake Test
                </button>
                <button 
                  className="outline-btn" 
                  onClick={() => setViewDetailsModalSkill(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentAssessment;
