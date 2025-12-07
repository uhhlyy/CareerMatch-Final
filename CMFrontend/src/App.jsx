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


import Navbar from './components/Navbar'
import NavbarSeeker from './components/NavbarSeeker'
import NavbarCompany from './components/NavbarCompany'

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/roleselection', '/SeekerMainPage', '/ResumeBuilder', '/CompanyMainPage', '/JobPosting'];

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
