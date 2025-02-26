import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Users, Package, CheckCircle, Clock, Menu, Home, 
  PieChart, Settings, LogOut, Bell, ChevronDown, MoreHorizontal, Check, X, 
  ThumbsUp, Award, Layers, Zap, BarChart2, Heart, Target, MessageCircle, 
  FileText, Share2, AlertTriangle, Download, Truck, Coffee, DollarSign,
  Mail, Phone, UserPlus, Plus } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const NGODashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('donations');
  const [showMap, setShowMap] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  
  // NGO Profile data
  const ngoProfile = {
    name: "Raymond Ellis",
    position: "Food Distribution Manager",
    profileImage: "/api/placeholder/100/100",
    activityCompletion: 82,
    volunteerEngagement: 55,
    totalDonationsReceived: 1245,
    totalDonationsDistributed: 1156,
    ongoingHelpRequests: 12,
    volunteerRequestsPending: 5,
    leaderboardRank: 3,
    ratings: 4.8,
    recentActivities: [
      { id: 1, type: "donation", title: "Received 50kg of rice", timestamp: "2 hours ago" },
      { id: 2, type: "distribution", title: "Distributed food to 25 families", timestamp: "Yesterday" },
      { id: 3, type: "volunteer", title: "5 new volunteers joined", timestamp: "3 days ago" }
    ],
    location: "123 Charity Lane, Helpville",
    contactEmail: "raymond@foodcharity.org",
    contactPhone: "(555) 123-4567"
  };

  // Donation requests data
  const [donationRequests, setDonationRequests] = useState([
    { id: 1, date: '2023-08-12', donor: 'John Doe', foodType: 'Packed Food', foodAmount: '20 kg', donationStatus: 'Pending', location: 'Downtown', description: 'Non-perishable food items packed for distribution', priority: 'Medium' },
    { id: 2, date: '2023-08-13', donor: 'Jane Smith', foodType: 'Fresh Fruits', foodAmount: '15 kg', donationStatus: 'Pending', location: 'Westside', description: 'Assorted fresh fruits for children', priority: 'High' },
    { id: 3, date: '2023-08-14', donor: 'Michael Brown', foodType: 'Canned Goods', foodAmount: '25 kg', donationStatus: 'Approved', location: 'Northside', description: 'Various canned food items with long shelf life', priority: 'Low' },
    { id: 4, date: '2023-08-15', donor: 'Sarah Johnson', foodType: 'Vegetables', foodAmount: '10 kg', donationStatus: 'Rejected', location: 'Eastside', description: 'Fresh vegetables from local farmers', priority: 'Medium' },
    { id: 5, date: '2023-08-16', donor: 'Robert Wilson', foodType: 'Packaged Meals', foodAmount: '30 kg', donationStatus: 'Completed', location: 'Southside', description: 'Ready-to-eat packaged meals', priority: 'High' },
    { id: 6, date: '2023-08-17', donor: 'Emily Davis', foodType: 'Bread', foodAmount: '12 kg', donationStatus: 'Pending', location: 'Central', description: 'Fresh bread from local bakery', priority: 'Medium' },
    { id: 7, date: '2023-08-18', donor: 'David Wilson', foodType: 'Rice', foodAmount: '40 kg', donationStatus: 'Pending', location: 'Industrial Area', description: 'Rice bags for family distribution', priority: 'High' },
  ]);

  // Volunteer requests data
  const volunteerRequests = [
    { id: 1, name: 'Amanda Lee', skills: 'Food Distribution, Driving', availability: 'Weekends', status: 'Pending', location: 'Downtown' },
    { id: 2, name: 'Thomas Garcia', skills: 'Administration, Cooking', availability: 'Evenings', status: 'Approved', location: 'Westside' },
    { id: 3, name: 'Rebecca Wang', skills: 'Logistics, First Aid', availability: 'Full-time', status: 'Pending', location: 'Northside' },
    { id: 4, name: 'James Miller', skills: 'Transportation, Heavy Lifting', availability: 'Weekdays', status: 'Rejected', location: 'Eastside' },
  ];

  // Leaderboard data
  const leaderboardData = [
    { id: 1, name: "Hope Foundation", donationsDistributed: 3452, rank: 1 },
    { id: 2, name: "Food For All", donationsDistributed: 3105, rank: 2 },
    { id: 3, name: "Raymond Ellis (You)", donationsDistributed: 1156, rank: 3, highlight: true },
    { id: 4, name: "Helping Hands", donationsDistributed: 982, rank: 4 },
    { id: 5, name: "Community Care", donationsDistributed: 845, rank: 5 },
  ];

  // Simulating loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter donation requests based on search term
  const filteredDonationRequests = donationRequests.filter(request => 
    request.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequestAction = (id, action) => {
    // Update donation request status
    setDonationRequests(prev => 
      prev.map(req => 
        req.id === id 
          ? { ...req, donationStatus: action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Completed' } 
          : req
      )
    );
    
    setSelectedRequest(null);
    
    // Show success notification animation
    setNotificationType("success");
    setNotificationMessage(
      action === 'approve' 
        ? "Donation request approved successfully!" 
        : action === 'reject'
          ? "Donation request rejected."
          : "Donation marked as completed!"
    );
    
    const notification = document.getElementById('notification');
    notification.classList.remove('opacity-0', 'translate-y-4');
    notification.classList.add('opacity-100', 'translate-y-0');
    
    setTimeout(() => {
      notification.classList.remove('opacity-100', 'translate-y-0');
      notification.classList.add('opacity-0', 'translate-y-4');
    }, 3000);
  };

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    setShowVolunteerModal(false);
    
    // Show success notification
    setNotificationType("success");
    setNotificationMessage("Volunteer request submitted successfully!");
    
    const notification = document.getElementById('notification');
    notification.classList.remove('opacity-0', 'translate-y-4');
    notification.classList.add('opacity-100', 'translate-y-0');
    
    setTimeout(() => {
      notification.classList.remove('opacity-100', 'translate-y-0');
      notification.classList.add('opacity-0', 'translate-y-4');
    }, 3000);
  };

  // Add navigation handler
  const handleNavigation = (page) => {
    setActivePage(page);
    switch (page) {
      case 'dashboard':
        navigate('/ngo/dashboard');
        break;
      case 'analytics':
        navigate('/ngo/analytics');
        break;
      case 'donations':
        setActiveTab('donations');
        break;
      case 'volunteers':
        setActiveTab('volunteers');
        break;
      case 'locations':
        setShowMap(true);
        break;
      case 'calendar':
        navigate('/ngo/calendar');
        break;
      case 'leaderboard':
        setActiveTab('leaderboard');
        break;
      case 'reports':
        navigate('/ngo/reports');
        break;
      case 'documentation':
        window.open('/docs', '_blank');
        break;
      case 'settings':
        navigate('/ngo/settings');
        break;
      default:
        break;
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Add logout confirmation
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear any stored tokens/session
      localStorage.removeItem('ngoToken');
      // Redirect to login
      navigate('/login');
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-indigo-900 flex flex-col items-center justify-center z-50">
        <div className="text-white text-2xl font-bold mb-4 flex items-center">
          <Heart className="h-8 w-8 mr-2 text-white animate-pulse" />
          Food Donations NGO
        </div>
        <div className="w-32 h-32 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        <p className="text-white mt-4 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 py-16 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-indigo-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-lg z-10`}>
        <div className={`p-4 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} border-b border-indigo-800`}>
          {!sidebarCollapsed && (
            <div className="flex items-center">
              <div className="bg-white rounded-full p-1 mr-2">
                <Heart className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Food Donations</h3>
                <p className="text-xs text-indigo-300">NGO Dashboard</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="bg-white rounded-full p-1">
              <Heart className="h-5 w-5 text-indigo-600" />
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            className={`${sidebarCollapsed ? 'mx-auto mt-4' : ''} text-indigo-300 hover:text-white transition-colors`}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        <div className="py-4 flex-1 overflow-y-auto">
          <div className={`px-4 ${sidebarCollapsed ? 'text-center' : ''}`}>
            <div className="space-y-1">
              <div 
                onClick={() => handleNavigation('ngo')}
                className={`flex items-center p-2 ${activePage === 'dashboard' ? 'bg-indigo-800' : ''} rounded hover:bg-indigo-700 transition-all cursor-pointer`}
              >
                <Home className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5`} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </div>
              
              <div 
                onClick={() => handleNavigation('donations')}
                className={`flex items-center p-2 ${activePage === 'donations' ? 'bg-indigo-800' : ''} rounded hover:bg-indigo-700 transition-all cursor-pointer`}
              >
                <Package className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5`} />
                {!sidebarCollapsed && <span>Donations</span>}
              </div>
              
              <div 
                onClick={() => handleNavigation('volunteers')}
                className={`flex items-center p-2 ${activePage === 'volunteers' ? 'bg-indigo-800' : ''} rounded hover:bg-indigo-700 transition-all cursor-pointer`}
              >
                <Users className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5`} />
                {!sidebarCollapsed && <span>Volunteers</span>}
              </div>
            </div>
            
            {sidebarCollapsed && <div className="border-t border-indigo-800 my-4"></div>}
            <div className="space-y-1">
              <div 
                onClick={() => handleNavigation('leaderboard')}
                className={`flex items-center p-2 ${activePage === 'leaderboard' ? 'bg-indigo-800' : ''} rounded hover:bg-indigo-700 transition-all cursor-pointer`}
              >
                <Award className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5`} />
                {!sidebarCollapsed && <span>Leaderboard</span>}
              </div>
            </div>
            <div className="space-y-1">
              <Link to="/ngo/settings"><div
                className={`flex items-center p-2 ${activePage === 'leaderboard' ? 'bg-indigo-800' : ''} rounded hover:bg-indigo-700 transition-all cursor-pointer`}
              >
                <Award className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5`} />
                {!sidebarCollapsed && <span>Settings</span>}
              </div></Link>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-indigo-800 mt-auto">
          <div 
            onClick={handleLogout}
            className="flex items-center p-2 hover:bg-indigo-800 rounded transition-all cursor-pointer"
          >
            <LogOut className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5`} />
            {!sidebarCollapsed && <span>Log Out</span>}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="ml-2 text-gray-500 cursor-pointer hover:text-indigo-500 transition-colors">
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-gray-100 rounded-full p-1 cursor-pointer hover:bg-gray-200 transition-all">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs animate-pulse">3</span>
              </div>
            </div>
            
            <div className="relative bg-gray-100 rounded-full px-3 py-2 flex items-center cursor-pointer hover:bg-gray-200 transition-all group">
              <img src="/api/placeholder/32/32" alt="Profile" className="h-8 w-8 rounded-full border-2 border-white" />
              <span className="ml-2 text-sm font-medium">Maria Oliveira</span>
              <ChevronDown className="ml-1 h-4 w-4 text-gray-500 group-hover:rotate-180 transition-transform duration-300" />
              
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                <div className="p-2">
                  <div className="p-2 hover:bg-gray-100 rounded transition-all flex items-center cursor-pointer">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Profile</span>
                  </div>
                  <div className="border-t my-1 border-gray-200"></div>
                  <div className="p-2 hover:bg-gray-100 rounded transition-all flex items-center cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Log out</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 transform transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="md:mr-6 mb-4 md:mb-0 relative">
                <img src="/api/placeholder/100/100" alt="Raymond Ellis" className="h-24 w-24 rounded-xl shadow-md border-2 border-white" />
                <div className="absolute -top-2 -right-2 bg-green-500 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      {ngoProfile.name}
                      <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs py-1 px-2 rounded-full">Rank #{ngoProfile.leaderboardRank}</span>
                    </h2>
                    <p className="text-gray-500">{ngoProfile.position}</p>
                    <div className="flex mt-2 items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{ngoProfile.location}</span>
                    </div>
                    <div className="flex mt-1 items-center space-x-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{ngoProfile.contactEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{ngoProfile.contactPhone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <button 
                      onClick={() => setShowProfileModal(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
                    >
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-indigo-800">Donations Received</span>
                      <Package className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="text-2xl font-bold text-indigo-800">{ngoProfile.totalDonationsReceived.toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-green-800">Donations Distributed</span>
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-800">{ngoProfile.totalDonationsDistributed.toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-yellow-800">Help Requests</span>
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-800">{ngoProfile.ongoingHelpRequests}</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-800">Volunteer Requests</span>
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-800">{ngoProfile.volunteerRequestsPending}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Activity Completion</span>
                      <span className="font-semibold text-indigo-600">{ngoProfile.activityCompletion}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${ngoProfile.activityCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Volunteer Engagement</span>
                      <span className="font-semibold text-cyan-600">{ngoProfile.volunteerEngagement}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-400 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${ngoProfile.volunteerEngagement}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center">
                  <div className="flex items-center mr-4">
                    <span className="text-gray-700 font-medium mr-2">Rating:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <ThumbsUp 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(ngoProfile.ratings) ? 'text-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold">{ngoProfile.ratings}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium mr-2">Leaderboard:</span>
                    <span className="text-sm font-semibold bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">
                      #{ngoProfile.leaderboardRank} of 50 NGOs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="flex border-b">
              <button 
                onClick={() => setActiveTab('donations')} 
                className={`flex-1 py-3 font-medium text-center transition-colors ${activeTab === 'donations' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}
              >
                <div className="flex items-center justify-center">
                  <Package className="h-4 w-4 mr-2" />
                  Donations
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('volunteers')} 
                className={`flex-1 py-3 font-medium text-center transition-colors ${activeTab === 'volunteers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}
              >
                <div className="flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  Volunteers
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('leaderboard')} 
                className={`flex-1 py-3 font-medium text-center transition-colors ${activeTab === 'leaderboard' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}
              >
                <div className="flex items-center justify-center">
                  <Award className="h-4 w-4 mr-2" />
                  Leaderboard
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('activities')} 
                className={`flex-1 py-3 font-medium text-center transition-colors ${activeTab === 'activities' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}
              >
                <div className="flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Activities
                </div>
              </button>
            </div>
            
            {/* Donations Tab */}
            {activeTab === 'donations' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search donations by donor, food type, or location..."
                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute left-3 top-2.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className={`px-4 py-2 rounded-lg flex items-center transition-colors ${showMap ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {showMap ? 'Hide Map' : 'Show Map'}
                    </button>
                    <button 
                      onClick={() => setShowDonationModal(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-sm hover:shadow-md"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Add New Donation
                    </button>
                  </div>
                </div>
                
                {showMap && (
                  <div className="bg-gray-100 h-64 rounded-lg shadow-inner mb-6 p-2 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">Map view would display here</p>
                      <p className="text-sm">Showing donation locations across the city</p>
                    </div>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-600 text-sm">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Donor</th>
                        <th className="py-3 px-4 text-left font-medium">Food Type</th>
                        <th className="py-3 px-4 text-left font-medium">Amount</th>
                        <th className="py-3 px-4 text-left font-medium">Location</th>
                        <th className="py-3 px-4 text-left font-medium">Priority</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDonationRequests.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-8 text-center text-gray-500">
                            <Package className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                            <p>No donation requests found matching your search.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredDonationRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-gray-800">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-indigo-500 mr-2" />
                                <span>{request.date}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-800">
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-indigo-500 mr-2" />
                                <span>{request.donor}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-800 flex items-center">
                              <Coffee className="h-4 w-4 text-indigo-500 mr-2" />
                              {request.foodType}
                            </td>
                            <td className="py-3 px-4 text-gray-800">
                              <div className="flex items-center">
                                <Layers className="h-4 w-4 text-indigo-500 mr-2" />
                                <span>{request.foodAmount}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-800">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                                <span>{request.location}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.priority === 'High' ? 'bg-red-100 text-red-800' :
                                request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {request.priority}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.donationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                                request.donationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                                request.donationStatus === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.donationStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center space-x-2">
                                <button 
                                  onClick={() => setSelectedRequest(request)}
                                  className="bg-indigo-100 p-1.5 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors"
                                  title="View Details"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                                {request.donationStatus === 'Pending' && (
                                  <>
                                    <button 
                                      onClick={() => handleRequestAction(request.id, 'approve')}
                                      className="bg-green-100 p-1.5 rounded-full text-green-600 hover:bg-green-200 transition-colors"
                                      title="Approve"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleRequestAction(request.id, 'reject')}
                                      className="bg-red-100 p-1.5 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                                      title="Reject"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                                {request.donationStatus === 'Approved' && (
                                  <button 
                                    onClick={() => handleRequestAction(request.id, 'complete')}
                                    className="bg-blue-100 p-1.5 rounded-full text-blue-600 hover:bg-blue-200 transition-colors"
                                    title="Mark as Completed"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Volunteers Tab */}
            {activeTab === 'volunteers' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Volunteer Requests</h3>
                  <button 
                    onClick={() => setShowVolunteerModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-sm hover:shadow-md"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add New Volunteer
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-600 text-sm">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">Name</th>
                        <th className="py-3 px-4 text-left font-medium">Skills</th>
                        <th className="py-3 px-4 text-left font-medium">Availability</th>
                        <th className="py-3 px-4 text-left font-medium">Location</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-center font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {volunteerRequests.map((volunteer) => (
                        <tr key={volunteer.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-gray-800">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-indigo-500 mr-2" />
                              <span>{volunteer.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-800">{volunteer.skills}</td>
                          <td className="py-3 px-4 text-gray-800">{volunteer.availability}</td>
                          <td className="py-3 px-4 text-gray-800">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                              <span>{volunteer.location}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              volunteer.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              volunteer.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {volunteer.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button 
                                className="bg-indigo-100 p-1.5 rounded-full text-indigo-600 hover:bg-indigo-200 transition-colors"
                                title="View Details"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              {volunteer.status === 'Pending' && (
                                <>
                                  <button 
                                    className="bg-green-100 p-1.5 rounded-full text-green-600 hover:bg-green-200 transition-colors"
                                    title="Approve"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button 
                                    className="bg-red-100 p-1.5 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                                    title="Reject"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">NGO Leaderboard - Food Distributions</h3>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-sm flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Last updated: Today at 9:30 AM
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-600 text-sm">
                      <tr>
                        <th className="py-3 px-4 text-left font-medium">Rank</th>
                        <th className="py-3 px-4 text-left font-medium">Organization</th>
                        <th className="py-3 px-4 text-right font-medium">Donations Distributed</th>
                        <th className="py-3 px-4 text-center font-medium">Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leaderboardData.map((org) => (
                        <tr key={org.id} className={`hover:bg-gray-50 transition-colors ${org.highlight ? 'bg-indigo-50' : ''}`}>
                          <td className="py-3 px-4">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                              org.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                              org.rank === 2 ? 'bg-gray-200 text-gray-800' :
                              org.rank === 3 ? 'bg-amber-100 text-amber-800' :
                              'bg-indigo-100 text-indigo-800'
                            }`}>
                              {org.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-800 font-medium">
                            {org.name} {org.highlight && <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-full">You</span>}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-800 font-bold">
                            {org.donationsDistributed.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {org.rank === 1 && (
                              <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs font-medium flex items-center justify-center w-max mx-auto">
                                <Award className="h-4 w-4 mr-1" />
                                Gold
                              </span>
                            )}
                            {org.rank === 2 && (
                              <span className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-xs font-medium flex items-center justify-center w-max mx-auto">
                                <Award className="h-4 w-4 mr-1" />
                                Silver
                              </span>
                            )}
                            {org.rank === 3 && (
                              <span className="bg-amber-100 text-amber-800 py-1 px-3 rounded-full text-xs font-medium flex items-center justify-center w-max mx-auto">
                                <Award className="h-4 w-4 mr-1" />
                                Bronze
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Recent Activities</h3>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-gray-600 text-sm flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Real-time updates
                  </div>
                </div>
                
                <div className="space-y-4">
                  {ngoProfile.recentActivities.map((activity) => (
                    <div key={activity.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-4 ${
                          activity.type === 'donation' ? 'bg-green-100 text-green-600' :
                          activity.type === 'distribution' ? 'bg-blue-100 text-blue-600' :
                          'bg-indigo-100 text-indigo-600'
                        }`}>
                          {activity.type === 'donation' && <Package className="h-6 w-6" />}
                          {activity.type === 'distribution' && <Truck className="h-6 w-6" />}
                          {activity.type === 'volunteer' && <Users className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-800">{activity.title}</h4>
                            <span className="text-sm text-gray-500">{activity.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.type === 'donation' && 'A new donation has been received and added to inventory.'}
                            {activity.type === 'distribution' && 'Food packages were successfully distributed to families in need.'}
                            {activity.type === 'volunteer' && 'New volunteers have joined to help with food distribution.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-center pt-4">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center mx-auto">
                      <Clock className="h-4 w-4 mr-2" />
                      View More Activities
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Toast */}
      <div 
        id="notification" 
        className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-all transform translate-y-4 opacity-0 flex items-center ${
          notificationType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}
      >
        {notificationType === 'success' ? (
          <CheckCircle className="h-5 w-5 mr-2" />
        ) : (
          <AlertTriangle className="h-5 w-5 mr-2" />
        )}
        <span>{notificationMessage}</span>
      </div>
      
      {/* Donation Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Donation Details</h3>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Donation Date</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 text-indigo-600 mr-2" />
                    {selectedRequest.date}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Donor</p>
                  <p className="font-medium flex items-center">
                    <User className="h-4 w-4 text-indigo-600 mr-2" />
                    {selectedRequest.donor}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Food Type</p>
                  <p className="font-medium flex items-center">
                    <Coffee className="h-4 w-4 text-indigo-600 mr-2" />
                    {selectedRequest.foodType}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Amount</p>
                  <p className="font-medium flex items-center">
                    <Layers className="h-4 w-4 text-indigo-600 mr-2" />
                    {selectedRequest.foodAmount}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 text-indigo-600 mr-2" />
                    {selectedRequest.location}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Priority</p>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedRequest.priority === 'High' ? 'bg-red-100 text-red-800' :
                      selectedRequest.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedRequest.priority}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-1">Description</p>
                <p className="text-gray-800 border rounded-lg p-3 bg-gray-50">{selectedRequest.description}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">Current Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedRequest.donationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                    selectedRequest.donationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                    selectedRequest.donationStatus === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedRequest.donationStatus}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  
                  {selectedRequest.donationStatus === 'Pending' && (
                    <>
                      <button 
                        onClick={() => handleRequestAction(selectedRequest.id, 'approve')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRequestAction(selectedRequest.id, 'reject')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {selectedRequest.donationStatus === 'Approved' && (
                    <button 
                      onClick={() => handleRequestAction(selectedRequest.id, 'complete')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add New Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Add New Donation</h3>
                <button 
                  onClick={() => setShowDonationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Donor Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter donor name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Food Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="">Select food type</option>
                      <option value="packed">Packed Food</option>
                      <option value="fresh">Fresh Fruits</option>
                      <option value="canned">Canned Goods</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="meals">Packaged Meals</option>
                      <option value="bread">Bread</option>
                      <option value="rice">Rice</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Amount (kg)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter amount in kg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter location"
                    />


                    </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Priority</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="">Select priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
                    placeholder="Enter donation details and any special requirements"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => setShowDonationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Donation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Add New Volunteer Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Add New Volunteer</h3>
                <button 
                  onClick={() => setShowVolunteerModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Location</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter location"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Skills</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="">Select primary skill</option>
                      <option value="driving">Driving</option>
                      <option value="cooking">Cooking</option>
                      <option value="packaging">Packaging</option>
                      <option value="logistics">Logistics</option>
                      <option value="coordination">Coordination</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Availability</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="">Select availability</option>
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="evenings">Evenings</option>
                      <option value="mornings">Mornings</option>
                      <option value="fulltime">Full-time</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-1">Additional Information</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
                    placeholder="Enter any additional information or specific areas of interest"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => setShowVolunteerModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Volunteer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add propTypes validation if needed
NGODashboard.propTypes = {
  // Add prop validations here
};

// Add defaultProps if needed 
NGODashboard.defaultProps = {
  // Add default props here
};

export default NGODashboard;