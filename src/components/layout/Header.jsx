import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const pageTitles = {
  '/employee/dashboard': 'Dashboard',
  '/employee/training': 'Training Modules',
  '/employee/documents': 'Documents',
  '/employee/feedback': 'Feedback',
  '/employee/mentor': 'My Mentor',
  '/employee/certificate': 'Certificate',
  '/mentor/dashboard': 'Dashboard',
  '/mentor/employees': 'My Mentees',
  '/hr/dashboard': 'Dashboard',
  '/hr/employees': 'All Employees',
  '/hr/content': 'Content Management',
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  const getTitle = () => {
    if (location.pathname.includes('/employee/training/') || location.pathname.includes('/employee/quiz/')) return 'Training Module'
    if (location.pathname.includes('/mentor/employees/') || location.pathname.includes('/hr/employees/')) return 'Employee Details'
    return pageTitles[location.pathname] || 'OnboardX'
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const roleColors = {
    employee: 'bg-blue-100 text-blue-700',
    mentor: 'bg-purple-100 text-purple-700',
    hr: 'bg-green-100 text-green-700'
  }

  const roleLabels = {
    employee: 'Employee',
    mentor: 'Mentor',
    hr: 'HR Admin'
  }

  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'U')}&background=random&color=fff`

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{getTitle()}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..."
              className="w-56 pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img 
                src={avatarUrl} 
                alt={profile?.name} 
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showProfile && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowProfile(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <img 
                        src={avatarUrl} 
                        alt={profile?.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{profile?.name || 'User'}</p>
                        <p className="text-sm text-gray-500 truncate">{profile?.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[profile?.role] || roleColors.employee}`}>
                        {roleLabels[profile?.role] || 'Employee'}
                      </span>
                      {profile?.department && (
                        <span className="ml-2 text-xs text-gray-500">{profile.department}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={() => { setShowProfile(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">View Profile</span>
                    </button>
                    <button 
                      onClick={() => { setShowProfile(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                    <div className="border-t border-gray-200 my-1" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
