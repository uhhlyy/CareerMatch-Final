import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Index from './pages/index'
import Roleselection from './pages/roleselection'
import LoginSeeker from './pages/LoginSeeker';
import RegisterSeeker from './pages/RegisterSeeker'
import LoginCompany from './pages/LoginCompany'
import RegisterCompany from './pages/RegisterCompany'
import SeekerMainPage from './pages/SeekerMainPage'
import ResumeBuilder from './pages/ResumeBuilder'
import CompanyMainPage from './pages/CompanyMainPage'
import JobPosting from './pages/JobPosting'
import Seeker_ApplicationTracker from './pages/Seeker_ApplicationTracker'
import EmployerReview from './pages/EmployerReview'
import AdminDashboard from './pages/AdminDashboard' 
import AdminUsers from './pages/AdminUsers'


import Navbar from './components/Navbar'
import NavbarSeeker from './components/NavbarSeeker'
import NavbarCompany from './components/NavbarCompany'
import SeekerProfile from './pages/SeekerProfile'
import AboutPage from './pages/about'

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/roleselection', '/SeekerMainPage', '/ResumeBuilder', '/CompanyMainPage', '/JobPosting', '/Seeker_ApplicationTracker', '/EmployerReview','/SeekerProfile', '/AdminDashboard', '/AdminUsers'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/roleselection" element={<Roleselection />} />
        <Route path="/LoginSeeker" element={<LoginSeeker />} />
        <Route path="/RegisterSeeker" element={<RegisterSeeker />} />
        <Route path="/LoginCompany" element={<LoginCompany />} />
        <Route path="/RegisterCompany" element={<RegisterCompany />} />
        <Route path="/SeekerMainPage" element={<SeekerMainPage />} />
        <Route path="/ResumeBuilder" element={<ResumeBuilder />} />
        <Route path="/CompanyMainPage" element={<CompanyMainPage />} />
        <Route path="/JobPosting" element={<JobPosting />} />
        <Route path="/EmployerReview" element={<EmployerReview />} />
        <Route path="/SeekerProfile" element={<SeekerProfile />} />
        <Route path="/AdminUsers" element={<AdminUsers />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Seeker_ApplicationTracker" element={<Seeker_ApplicationTracker />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App