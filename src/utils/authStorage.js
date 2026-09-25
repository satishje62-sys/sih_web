// Central Authentication & User Storage Utility for SkillBridge Platform
// Manages registered accounts and active sessions for Institute, Industry, and Student roles

const STORAGE_KEYS = {
  INSTITUTES: 'skillbridge_registered_institutes',
  EMPLOYERS: 'skillbridge_registered_employers',
  STUDENTS: 'skillbridge_registered_students',
  SESSION_INSTITUTE: 'skillbridge_session_institute',
  SESSION_EMPLOYER: 'skillbridge_session_employer',
  SESSION_STUDENT: 'skillbridge_session_student',
};

// Seed demo accounts so users can test immediately with realistic profiles
export const DEMO_ACCOUNTS = {
  institute: {
    id: 'inst-demo-1',
    name: 'Government ITI Pune',
    regNumber: 'ITI-PUN-2024-089',
    managementType: 'Government',
    district: 'Pune',
    address: 'Aundh Road, Pune - 411007',
    contactNumber: '020-25678901',
    email: 'principal@itipune.ac.in',
    password: 'password123',
    trades: 'Fitter, Electrician, Machinist, Welder, COPA',
    studentCapacity: '450',
    type: 'ITI',
  },
  instituteSecondary: {
    id: 'inst-demo-2',
    name: 'Shree Ganesh ITI Pune',
    regNumber: 'ITI/MH/2020/1245',
    managementType: 'Private',
    district: 'Pune',
    address: 'Chakan Industrial Zone, Pune',
    contactNumber: '+91 98765 43210',
    email: 'principal@sgiti.ac.in',
    password: 'password123',
    trades: 'Mechanical Engineering, Electrical, CNC',
    studentCapacity: '350',
    type: 'ITI',
  },
  employer: {
    id: 'emp-demo-1',
    companyName: 'Tata Motors Limited',
    regNumber: 'U34100MH1945PLC004520',
    sector: 'Automotive & Electric Vehicles (EV)',
    district: 'Pune',
    industrialArea: 'MIDC Bhosari & Chakan',
    officialEmail: 'info@tatamotors.com',
    password: 'password123',
    contactPerson: 'Rajesh Sharma (HR Lead)',
    contactNumber: '+91 20 6618 1234',
    address: 'Pimpri-Chinchwad, Pune, Maharashtra 411018',
    openingsCount: '45',
    hiringRoles: 'CNC Operator, EV Assembly Technician, Tool & Die Maker',
  },
  employerSecondary: {
    id: 'emp-demo-2',
    companyName: 'ABC Industries Pvt. Ltd.',
    regNumber: '27AABCT1234F1Z5',
    sector: 'Manufacturing & Heavy Engineering',
    district: 'Pune',
    industrialArea: 'Talwade MIDC',
    officialEmail: 'hr@abcindustries.com',
    password: 'password123',
    contactPerson: 'Sunil Patil',
    contactNumber: '+91 98220 11223',
    address: 'Talwade Software Park, Pune',
    openingsCount: '25',
    hiringRoles: 'Mechanical Fitter, Quality Inspector',
  },
  student: {
    id: 'stud-demo-1',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    mobile: '9876543210',
    password: 'password123',
    educationLevel: 'ITI',
    instituteName: 'Shree Ganesh ITI Pune',
    tradeBranch: 'Fitter & Electrical Trade',
    yearOfStudy: '2',
    location: 'Pune',
  }
};

// Safe JSON parser
const safeParse = (str, fallback) => {
  try {
    const parsed = JSON.parse(str);
    return parsed || fallback;
  } catch {
    return fallback;
  }
};

/* =========================================================
   INSTITUTE AUTHENTICATION
========================================================= */

export const getRegisteredInstitutes = () => {
  const data = localStorage.getItem(STORAGE_KEYS.INSTITUTES);
  if (!data) {
    const initial = [DEMO_ACCOUNTS.institute, DEMO_ACCOUNTS.instituteSecondary];
    localStorage.setItem(STORAGE_KEYS.INSTITUTES, JSON.stringify(initial));
    return initial;
  }
  const parsed = safeParse(data, []);
  return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEMO_ACCOUNTS.institute, DEMO_ACCOUNTS.instituteSecondary];
};

export const registerInstitute = (instituteData) => {
  const institutes = getRegisteredInstitutes();
  
  const cleanEmail = (instituteData.email || '').trim().toLowerCase();
  const cleanReg = (instituteData.regNumber || '').trim().toLowerCase();

  const existing = institutes.find(inst => 
    (inst.email && inst.email.trim().toLowerCase() === cleanEmail) ||
    (inst.regNumber && inst.regNumber.trim().toLowerCase() === cleanReg)
  );

  if (existing) {
    return {
      success: false,
      message: 'An institute with this Registration Number or Email is already registered. Please log in instead.'
    };
  }

  const newInstitute = {
    id: `inst-${Date.now()}`,
    ...instituteData,
    email: cleanEmail,
    regNumber: (instituteData.regNumber || '').trim(),
    registeredAt: new Date().toLocaleDateString('en-IN'),
  };

  const updated = [newInstitute, ...institutes];
  localStorage.setItem(STORAGE_KEYS.INSTITUTES, JSON.stringify(updated));
  // Set as current active session
  setCurrentUser('institute', newInstitute);
  return { success: true, user: newInstitute };
};

export const loginInstitute = (identifier, password) => {
  const institutes = getRegisteredInstitutes();
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPhoneDigits = (identifier || '').replace(/\D/g, '');
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, message: 'Please provide both Institute ID/Email/Phone and Password.' };
  }

  const user = institutes.find(inst => {
    const emailMatch = inst.email && inst.email.trim().toLowerCase() === cleanId;
    const regMatch = inst.regNumber && inst.regNumber.trim().toLowerCase() === cleanId;
    const instPhoneDigits = (inst.contactNumber || '').replace(/\D/g, '');
    const phoneMatch = cleanPhoneDigits.length >= 7 && instPhoneDigits && (
      instPhoneDigits === cleanPhoneDigits ||
      instPhoneDigits.endsWith(cleanPhoneDigits) ||
      cleanPhoneDigits.endsWith(instPhoneDigits)
    );
    return emailMatch || regMatch || phoneMatch;
  });

  if (!user) {
    return {
      success: false,
      message: 'No registered institute found matching this Registration Number, Email or Phone. Please register first.'
    };
  }

  if (user.password !== cleanPass) {
    return {
      success: false,
      message: 'Incorrect password. Please verify your password and try again.'
    };
  }

  setCurrentUser('institute', user);
  return { success: true, user };
};

/* =========================================================
   INDUSTRY / EMPLOYER AUTHENTICATION
========================================================= */

export const getRegisteredEmployers = () => {
  const data = localStorage.getItem(STORAGE_KEYS.EMPLOYERS);
  if (!data) {
    const initial = [DEMO_ACCOUNTS.employer, DEMO_ACCOUNTS.employerSecondary];
    localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(initial));
    return initial;
  }
  const parsed = safeParse(data, []);
  return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEMO_ACCOUNTS.employer, DEMO_ACCOUNTS.employerSecondary];
};

export const registerEmployer = (employerData) => {
  const employers = getRegisteredEmployers();
  
  const cleanEmail = (employerData.officialEmail || employerData.email || '').trim().toLowerCase();
  const cleanReg = (employerData.regNumber || '').trim().toLowerCase();

  const existing = employers.find(emp => 
    (cleanEmail && emp.officialEmail && emp.officialEmail.trim().toLowerCase() === cleanEmail) ||
    (cleanReg && emp.regNumber && emp.regNumber.trim().toLowerCase() === cleanReg)
  );

  if (existing) {
    return {
      success: false,
      message: 'A company with this Registration/CIN Number or Official Email is already registered.'
    };
  }

  const newEmployer = {
    id: `emp-${Date.now()}`,
    ...employerData,
    officialEmail: cleanEmail,
    regNumber: (employerData.regNumber || '').trim(),
    contactNumber: (employerData.contactNumber || '').trim(),
    registeredAt: new Date().toLocaleDateString('en-IN'),
  };

  const updated = [newEmployer, ...employers];
  localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(updated));
  setCurrentUser('employer', newEmployer);
  return { success: true, user: newEmployer };
};

export const loginEmployer = (identifier, password) => {
  const employers = getRegisteredEmployers();
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPhoneDigits = (identifier || '').replace(/\D/g, '');
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, message: 'Please provide both Company ID/Email/Phone and Password.' };
  }

  const user = employers.find(emp => {
    const emailMatch = (emp.officialEmail && emp.officialEmail.trim().toLowerCase() === cleanId) ||
                       (emp.email && emp.email.trim().toLowerCase() === cleanId);
    const regMatch = emp.regNumber && emp.regNumber.trim().toLowerCase() === cleanId;
    const empPhoneDigits = (emp.contactNumber || '').replace(/\D/g, '');
    const phoneMatch = cleanPhoneDigits.length >= 7 && empPhoneDigits && (
      empPhoneDigits === cleanPhoneDigits ||
      empPhoneDigits.endsWith(cleanPhoneDigits) ||
      cleanPhoneDigits.endsWith(empPhoneDigits)
    );
    return emailMatch || regMatch || phoneMatch;
  });

  if (!user) {
    return {
      success: false,
      message: 'No registered company found with these credentials. Please check your details or register your company.'
    };
  }

  if (user.password !== cleanPass) {
    return {
      success: false,
      message: 'Incorrect password. Please verify and try again.'
    };
  }

  setCurrentUser('employer', user);
  return { success: true, user };
};

/* =========================================================
   STUDENT AUTHENTICATION
========================================================= */

export const getRegisteredStudents = () => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  if (!data) {
    const initial = [DEMO_ACCOUNTS.student];
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initial));
    return initial;
  }
  const parsed = safeParse(data, []);
  return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEMO_ACCOUNTS.student];
};

export const registerStudent = (studentData) => {
  const students = getRegisteredStudents();
  
  const cleanEmail = (studentData.email || '').trim().toLowerCase();
  const cleanMobile = (studentData.mobile || studentData.phone || '').trim();

  const existing = students.find(s => 
    (cleanEmail && s.email && s.email.trim().toLowerCase() === cleanEmail) ||
    (cleanMobile && s.mobile && s.mobile.trim() === cleanMobile)
  );

  if (existing) {
    return {
      success: false,
      message: 'An account with this Email or Mobile number is already registered. Please login.'
    };
  }

  const newStudent = {
    id: `stud-${Date.now()}`,
    ...studentData,
    email: cleanEmail,
    mobile: cleanMobile,
    registeredAt: new Date().toLocaleDateString('en-IN'),
  };

  const updated = [newStudent, ...students];
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(updated));
  setCurrentUser('student', newStudent);
  return { success: true, user: newStudent };
};

export const loginStudent = (identifier, password) => {
  const students = getRegisteredStudents();
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPhoneDigits = (identifier || '').replace(/\D/g, '');
  const cleanPass = (password || '').trim();

  if (!cleanId || !cleanPass) {
    return { success: false, message: 'Please enter your Email/Mobile and Password.' };
  }

  const user = students.find(s => {
    const emailMatch = s.email && s.email.trim().toLowerCase() === cleanId;
    const sPhoneDigits = (s.mobile || s.phone || '').replace(/\D/g, '');
    const phoneMatch = cleanPhoneDigits.length >= 7 && sPhoneDigits && (
      sPhoneDigits === cleanPhoneDigits ||
      sPhoneDigits.endsWith(cleanPhoneDigits) ||
      cleanPhoneDigits.endsWith(sPhoneDigits)
    );
    return emailMatch || phoneMatch;
  });

  if (!user) {
    return {
      success: false,
      message: 'No registered student account found for this Email / Mobile. Please create an account first.'
    };
  }

  if (user.password !== cleanPass) {
    return {
      success: false,
      message: 'Incorrect password. Please verify and try again.'
    };
  }

  setCurrentUser('student', user);
  return { success: true, user };
};

/* =========================================================
   SESSION & ACTIVE USER HELPERS
========================================================= */

const getSessionKey = (role) => {
  if (role === 'institute') return STORAGE_KEYS.SESSION_INSTITUTE;
  if (role === 'employer' || role === 'industry') return STORAGE_KEYS.SESSION_EMPLOYER;
  return STORAGE_KEYS.SESSION_STUDENT;
};

export const setCurrentUser = (role, user) => {
  const key = getSessionKey(role);
  if (user) {
    localStorage.setItem(key, JSON.stringify(user));
  } else {
    localStorage.removeItem(key);
  }
  window.dispatchEvent(new CustomEvent('skillbridge:authChanged', { detail: { role, user } }));
};

export const getCurrentUser = (role) => {
  const key = getSessionKey(role);
  const data = localStorage.getItem(key);
  if (!data) return null;
  return safeParse(data, null);
};

export const isAuthenticated = (role) => {
  return getCurrentUser(role) !== null;
};

export const logoutUser = (role) => {
  setCurrentUser(role, null);
};

export const updateUserProfile = (role, updatedData) => {
  const current = getCurrentUser(role);
  if (!current) return { success: false, message: 'No active user session' };

  const merged = { ...current, ...updatedData };
  setCurrentUser(role, merged);

  // Update in registered accounts list
  if (role === 'institute') {
    const list = getRegisteredInstitutes().map(inst => inst.id === merged.id ? merged : inst);
    localStorage.setItem(STORAGE_KEYS.INSTITUTES, JSON.stringify(list));
  } else if (role === 'employer' || role === 'industry') {
    const list = getRegisteredEmployers().map(emp => emp.id === merged.id ? merged : emp);
    localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(list));
  } else {
    const list = getRegisteredStudents().map(stud => stud.id === merged.id ? merged : stud);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
  }

  return { success: true, user: merged };
};

