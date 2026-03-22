import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'

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
  
  const getTitle = () => {
    if (location.pathname.includes('/employee/training/') || location.pathname.includes('/employee/quiz/')) return 'Training Module'
    if (location.pathname.includes('/mentor/employees/') || location.pathname.includes('/hr/employees/')) return 'Employee Details'
    return pageTitles[location.pathname] || 'OnboardX'
  }

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
        </div>
      </div>
    </header>
  )
}
