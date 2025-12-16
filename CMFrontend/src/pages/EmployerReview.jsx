import React, { useState, useEffect } from "react";
import CompanyLayout from "../components/CompanyLayout";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  Briefcase,
  Award,
  User,
  Clock,
  Filter,
  RefreshCw,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function EmployerReview() {
  // Ensure Inter font is loaded globally for this page
  useEffect(() => {
    const existingLinks = Array.from(document.head.querySelectorAll('link[href*="fonts.googleapis.com/css2?family=Inter"]'));
    existingLinks.forEach(link => document.head.removeChild(link));
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Pending"); 
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [confirmation, setConfirmation] = useState({ isOpen: false, type: "", data: null });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchApplications = async () => {
    const storedId = localStorage.getItem('employer_id') || localStorage.getItem('employerID') || localStorage.getItem('user_id');
    if (!storedId) { setLoading(false); return; }
    try {
      const response = await fetch(`http://localhost/CareerMatch-Final/CMBackend/get_pending_applications.php?employer_id=${storedId}`);
      const data = await response.json();
      if (Array.isArray(data)) setAllApplications(data);
    } catch (error) { console.error("Fetch error:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchApplications();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const initiateStatusChange = (applicantObj, decision) => {
    setConfirmation({ isOpen: true, type: decision, data: applicantObj });
  };

  const confirmDecision = async () => {
    const { data, type } = confirmation;
    const employerId = localStorage.getItem('employer_id') || localStorage.getItem('employerID') || localStorage.getItem('user_id');
    
    try {
      const response = await fetch('http://localhost/CareerMatch-Final/CMBackend/update_applicant_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: data.application_id, employer_id: employerId, decision: type })
      });
      const result = await response.json();
      if (result.success) {
        if (type === 'Accepted') {
          await sendAcceptanceEmail(data);
        }
        
        fetchApplications();
        setSelectedApplicant(null);
        setConfirmation({ isOpen: false, type: "", data: null });
      }
    } catch (error) { console.error(error); }
  };

  const sendAcceptanceEmail = async (applicantData) => {
    try {
      const employerName = localStorage.getItem('employer_name') || "Our Company";
      
      const emailSubject = `Interview Invitation - ${applicantData.job_title} Position`;
      const emailBody = `Dear ${applicantData.fullname},

We are pleased to inform you that your application for the position of ${applicantData.job_title} has been reviewed and we would like to invite you for an initial interview.

Your qualifications and experience have impressed us, and we believe you could be a great fit for our team.

We will be in touch shortly with details regarding the interview schedule. Please keep an eye on your email for further communication.

If you have any questions in the meantime, please don't hesitate to reach out.

Best regards,
${employerName}

---
This is an automated notification from CareerMatch Application Tracking System.`;

      const mailtoLink = `mailto:${applicantData.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      console.log('Opening email client for:', applicantData.email);
      window.location.href = mailtoLink;
      
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const filteredList = allApplications.filter(item => {
    const matchesSearch = item.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && item.status === activeTab;
  });

  const getCount = (status) => allApplications.filter(a => a.status === status).length;

  return (
    <CompanyLayout>
      <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Responsive Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                  Application Review
                </h1>
                <p className="text-slate-600 text-sm font-medium">
                  Manage candidate applications
                </p>
              </div>
              
              {/* Responsive Stats */}
              <div className="flex gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">{allApplications.length}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">Total</div>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">{getCount("Pending")}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">Pending</div>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">{getCount("Accepted")}</div>
                  <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-semibold">Accepted</div>
                </div>
              </div>
            </div>

            {/* Responsive Tab Navigation & Search */}
            <div className="space-y-4">
              {/* Desktop Tabs */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex border-b border-slate-200">
                  <button 
                    onClick={() => setActiveTab("Pending")} 
                    className={`px-4 lg:px-6 py-3 text-sm font-semibold transition-all ${
                      activeTab === "Pending" 
                        ? "text-slate-900 border-b-2 border-slate-900" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Pending ({getCount("Pending")})
                  </button>
                  <button 
                    onClick={() => setActiveTab("Accepted")} 
                    className={`px-4 lg:px-6 py-3 text-sm font-semibold transition-all ${
                      activeTab === "Accepted" 
                        ? "text-slate-900 border-b-2 border-slate-900" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Accepted ({getCount("Accepted")})
                  </button>
                  <button 
                    onClick={() => setActiveTab("Rejected")} 
                    className={`px-4 lg:px-6 py-3 text-sm font-semibold transition-all ${
                      activeTab === "Rejected" 
                        ? "text-slate-900 border-b-2 border-slate-900" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Rejected ({getCount("Rejected")})
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-slate-400 transition-all bg-white text-sm w-48 lg:w-64"
                    />
                  </div>
                  <button 
                    onClick={fetchApplications}
                    disabled={loading}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Mobile Tabs & Search */}
              <div className="sm:hidden space-y-3">
                {/* Search Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search applications..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-slate-400 transition-all bg-white text-sm"
                    />
                  </div>
                  <button 
                    onClick={fetchApplications}
                    disabled={loading}
                    className="p-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Tab Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                  <button 
                    onClick={() => setActiveTab("Pending")} 
                    className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                      activeTab === "Pending" 
                        ? "bg-slate-900 text-white" 
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    Pending ({getCount("Pending")})
                  </button>
                  <button 
                    onClick={() => setActiveTab("Accepted")} 
                    className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                      activeTab === "Accepted" 
                        ? "bg-slate-900 text-white" 
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    Accepted ({getCount("Accepted")})
                  </button>
                  <button 
                    onClick={() => setActiveTab("Rejected")} 
                    className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                      activeTab === "Rejected" 
                        ? "bg-slate-900 text-white" 
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    Rejected ({getCount("Rejected")})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-slate-300 border-t-slate-900"></div>
              <p className="mt-4 text-slate-600 text-sm font-medium">Loading applications...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.length > 0 ? (
                      filteredList.map((app) => (
                        <tr 
                          key={app.application_id} 
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => setSelectedApplicant(app)} 
                              className="flex items-center gap-3 group"
                            >
                              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
                                {app.fullname.charAt(0)}
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                                  {app.fullname}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  View profile
                                </p>
                              </div>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-slate-900 text-sm">
                                {app.job_title}
                              </span>
                              <span className="text-xs text-slate-500">
                                Applied {formatDate(app.date_applied || app.created_at)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <a 
                                href={`mailto:${app.email}`} 
                                className="text-sm text-slate-700 hover:text-slate-900 transition-colors"
                              >
                                {app.email}
                              </a>
                              <a 
                                href={`tel:${app.phone}`} 
                                className="text-sm text-slate-600"
                              >
                                {app.phone}
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                app.status === 'Accepted' 
                                  ? 'bg-slate-100 text-slate-900' 
                                  : app.status === 'Rejected' 
                                  ? 'bg-slate-100 text-slate-700' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {app.status}
                              </span>
                              {app.processed_at && (
                                <p className="text-[10px] text-slate-400 font-medium">
                                  {formatDate(app.processed_at)}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              {activeTab === "Pending" ? (
                                <>
                                  <button 
                                    onClick={() => initiateStatusChange(app, 'Accepted')} 
                                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-all"
                                  >
                                    Accept
                                  </button>
                                  <button 
                                    onClick={() => initiateStatusChange(app, 'Rejected')} 
                                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : activeTab === "Accepted" ? (
                                <>
                                  <button 
                                    onClick={() => sendAcceptanceEmail(app)}
                                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-all flex items-center gap-1"
                                  >
                                    <Mail className="w-3 h-3" />
                                    Email
                                  </button>
                                  <button 
                                    onClick={() => initiateStatusChange(app, 'Pending')}
                                    className="px-3 py-2 border border-slate-300 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all"
                                  >
                                    Undo
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => initiateStatusChange(app, 'Pending')}
                                  className="px-3 py-2 border border-slate-300 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all"
                                >
                                  Undo
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-16">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                              <Users className="w-8 h-8 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-slate-600 font-medium">No {activeTab.toLowerCase()} applications</p>
                              <p className="text-slate-500 text-sm mt-1">Applications will appear here once submitted</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {filteredList.length > 0 ? (
                  filteredList.map((app) => (
                    <div 
                      key={app.application_id}
                      className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <button 
                          onClick={() => setSelectedApplicant(app)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold flex-shrink-0">
                            {app.fullname.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{app.fullname}</p>
                            <p className="text-sm text-slate-600 truncate">{app.job_title}</p>
                          </div>
                        </button>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                          app.status === 'Accepted' 
                            ? 'bg-slate-100 text-slate-900' 
                            : app.status === 'Rejected' 
                            ? 'bg-slate-100 text-slate-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <a href={`mailto:${app.email}`} className="truncate hover:text-slate-900">
                            {app.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <a href={`tel:${app.phone}`} className="truncate">
                            {app.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Applied {formatDate(app.date_applied || app.created_at)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-slate-100">
                        {activeTab === "Pending" ? (
                          <>
                            <button 
                              onClick={() => initiateStatusChange(app, 'Accepted')} 
                              className="flex-1 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => initiateStatusChange(app, 'Rejected')} 
                              className="flex-1 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all"
                            >
                              Reject
                            </button>
                          </>
                        ) : activeTab === "Accepted" ? (
                          <>
                            <button 
                              onClick={() => sendAcceptanceEmail(app)}
                              className="flex-1 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-1"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </button>
                            <button 
                              onClick={() => initiateStatusChange(app, 'Pending')}
                              className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all"
                            >
                              Undo
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => initiateStatusChange(app, 'Pending')}
                            className="w-full py-2 border border-slate-300 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all"
                          >
                            Undo Decision
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-600 font-medium">No {activeTab.toLowerCase()} applications</p>
                        <p className="text-slate-500 text-sm mt-1">Applications will appear here once submitted</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmation.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl border border-slate-200">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                {confirmation.type === 'Accepted' && <CheckCircle className="w-6 h-6 text-slate-700" />}
                {confirmation.type === 'Rejected' && <XCircle className="w-6 h-6 text-slate-700" />}
                {confirmation.type === 'Pending' && <RotateCcw className="w-6 h-6 text-slate-700" />}
              </div>
              
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 text-center">
                {confirmation.type === 'Pending' ? 'Undo Decision?' : 'Confirm Action'}
              </h2>
              
              <p className="text-slate-600 mb-6 text-center text-sm">
                {confirmation.type === 'Pending' 
                  ? <>Move <strong>{confirmation.data.fullname}</strong> back to pending review?</>
                  : confirmation.type === 'Accepted'
                  ? <>Accept <strong>{confirmation.data.fullname}</strong> and send an interview invitation?</>
                  : <>Reject <strong>{confirmation.data.fullname}'s</strong> application for this position?</>
                }
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmation({ isOpen: false, type: "", data: null })} 
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDecision} 
                  className="flex-1 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all text-sm"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resume Modal - Responsive */}
        {selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-t-3xl sm:rounded-xl w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-xl border-t sm:border border-slate-200 flex flex-col">
              {/* Header */}
              <div className="p-6 sm:p-8 border-b border-slate-200">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 sm:gap-4 items-start flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xl sm:text-2xl font-bold flex-shrink-0">
                      {selectedApplicant.fullname.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{selectedApplicant.fullname}</h2>
                      <p className="text-slate-600 font-medium mt-0.5 text-sm sm:text-base truncate">{selectedApplicant.job_title}</p>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedApplicant.City || "Location not specified"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedApplicant(null)} 
                    className="p-2 hover:bg-slate-100 rounded-lg transition-all flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="p-4 sm:p-8 overflow-y-auto bg-slate-50 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Sidebar */}
                  <div className="md:col-span-1 space-y-3 sm:space-y-4">
                    <section className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 sm:mb-4">
                        Personal Details
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Gender</span>
                          <span className="font-medium text-slate-900">{selectedApplicant.Gender}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Birthday</span>
                          <span className="font-medium text-slate-900">{selectedApplicant.Birthday}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Status</span>
                          <span className="font-medium text-slate-900">{selectedApplicant.MaritalStatus}</span>
                        </div>
                      </div>
                    </section>
                    
                    <section className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 sm:mb-4">
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <a 
                          href={`mailto:${selectedApplicant.email}`} 
                          className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-colors break-all"
                        >
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="break-all">{selectedApplicant.email}</span>
                        </a>
                        <a 
                          href={`tel:${selectedApplicant.phone}`} 
                          className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-colors"
                        >
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          {selectedApplicant.phone}
                        </a>
                      </div>
                    </section>
                  </div>
                  
                  {/* Main Content */}
                  <div className="md:col-span-2 space-y-3 sm:space-y-4">
                    <section className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Professional Summary
                      </h3>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {selectedApplicant.AboutMe || selectedApplicant.Summary || 'No summary provided'}
                      </p>
                    </section>
                    
                    <section className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicant.Skills?.split(',').map((skill, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </section>

                    <section className="bg-white rounded-lg p-4 sm:p-6 border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Experience
                      </h3>
                      <p className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                        {selectedApplicant.Experience || "No experience listed."}
                      </p>
                    </section>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              {selectedApplicant.status === "Pending" && (
                <div className="p-4 sm:p-6 bg-white border-t border-slate-200 flex gap-3">
                  <button 
                    onClick={() => initiateStatusChange(selectedApplicant, 'Accepted')} 
                    className="flex-1 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all text-sm sm:text-base"
                  >
                    Accept Candidate
                  </button>
                  <button 
                    onClick={() => initiateStatusChange(selectedApplicant, 'Rejected')} 
                    className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all text-sm sm:text-base"
                  >
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        html, body, #root, * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        
        /* Hide scrollbar for mobile card list */
        @media (max-width: 1024px) {
          .space-y-3::-webkit-scrollbar {
            display: none;
          }
          .space-y-3 {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </CompanyLayout>
  );
}