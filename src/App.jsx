import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import InstituteLogin from './pages/institute/InstituteLogin';
import InstituteRegister from './pages/institute/InstituteRegister';
import IndustryLogin from './pages/industry/IndustryLogin';
import IndustryRegister from './pages/industry/IndustryRegister';
import StudentAuth from './pages/student/StudentAuth';
import StudentLayout from './layouts/StudentLayout';
import StudentProfile from './pages/student/StudentProfile';
import StudentAssessment from './pages/student/StudentAssessment';
import StudentJobs from './pages/student/StudentJobs';
import StudentIndustryJobs from './pages/student/StudentIndustryJobs';

import IndustryLayout from './layouts/IndustryLayout';
import IndustryProfile from './pages/industry/IndustryProfile';
import IndustryJobs from './pages/industry/IndustryJobs';
import IndustrySkillGap from './pages/industry/IndustrySkillGap';
import IndustryCollaboration from './pages/industry/IndustryCollaboration';
import IndustrySettings from './pages/industry/IndustrySettings';

import InstituteLayout from './layouts/InstituteLayout';

import InstituteProfile from './pages/institute/InstituteProfile';
import InstituteCourses from './pages/institute/InstituteCourses';
import InstituteSkillGap from './pages/institute/InstituteSkillGap';
import InstituteCollaboration from './pages/institute/InstituteCollaboration';
import InstituteIndustryJobs from './pages/institute/InstituteIndustryJobs';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Institute Portal Routes */}
        <Route path="/institute/login" element={<InstituteLogin />} />
        <Route path="/institute/register" element={<InstituteRegister />} />
        
        {/* Institute Dashboard Routes (Protected: Registered Institutes Only) */}
        <Route element={<ProtectedRoute role="institute" />}>
          <Route path="/institute/dashboard" element={<InstituteLayout />}>
            <Route index element={<InstituteProfile />} />
            <Route path="courses" element={<InstituteCourses />} />
            <Route path="industry-jobs" element={<InstituteIndustryJobs />} />
            <Route path="skill-gap" element={<InstituteSkillGap />} />
            <Route path="collaboration" element={<InstituteCollaboration />} />
          </Route>
        </Route>
        
        {/* Industry/Employer Portal Routes */}
        <Route path="/employer/login" element={<IndustryLogin />} />
        <Route path="/employer/register" element={<IndustryRegister />} />
        
        {/* Industry Dashboard Routes (Protected: Registered Employers Only) */}
        <Route element={<ProtectedRoute role="employer" />}>
          <Route path="/employer/dashboard" element={<IndustryLayout />}>
            <Route index element={<IndustryProfile />} />
            <Route path="jobs" element={<IndustryJobs />} />
            <Route path="skill-gap" element={<IndustrySkillGap />} />
            <Route path="skills" element={<IndustrySkillGap />} />
            <Route path="collaboration" element={<IndustryCollaboration />} />
            <Route path="settings" element={<IndustrySettings />} />
          </Route>
        </Route>
        
        {/* Student Portal Routes */}
        <Route path="/student/login" element={<StudentAuth />} />
        
        {/* Student Dashboard Routes (Protected: Registered Students Only) */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/student/dashboard" element={<StudentLayout />}>
            <Route index element={<StudentAssessment />} />
            <Route path="jobs" element={<StudentJobs />} />
            <Route path="industry-jobs" element={<StudentIndustryJobs />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
