import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { cn, getInitials } from '../../lib/utils'
import { LayoutDashboard, GraduationCap, FileText, MessageSquare, Users, Award, BookOpen, LogOut, UserCheck } from 'lucide-react'

const employeeNav = [
  { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employee/training', icon: GraduationCap, label: 'Training' },
  { to: '/employee/documents', icon: FileText, label: 'Documents' },
  { to: '/employee/feedback', icon: MessageSquare, label: 'Feedback' },
  { to: '/employee/mentor', icon: UserCheck, label: 'Mentor' },
  { to: '/employee/certificate', icon: Award, label: 'Certificate' },
]

const mentorNav = [
  { to: '/mentor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/mentor/employees', icon: Users, label: 'Mentees' },
]

const hrNav = [
  { to: '/hr/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/hr/employees', icon: Users, label: 'Employees' },
  { to: '/hr/content', icon: BookOpen, label: 'Content' },
]

export default function Sidebar() {
  const { profile, logout } = useAuth()
  const location = useLocation()
  
  const navItems = profile?.role === 'hr' ? hrNav : profile?.role === 'mentor' ? mentorNav : employeeNav

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 flex flex-col z-40">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">OnboardX</h1>
            <p className="text-xs text-gray-500 capitalize">{profile?.role || 'User'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1',
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-blue-600' : 'text-gray-400')} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(profile?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{profile?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{profile?.department || 'No Department'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
