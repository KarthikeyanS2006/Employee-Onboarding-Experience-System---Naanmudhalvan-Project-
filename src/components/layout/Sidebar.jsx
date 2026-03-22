import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { cn, getInitials, generateGradient } from '../../lib/utils'
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Upload,
  MessageSquare,
  Users,
  Award,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  ClipboardList,
  UserCheck
} from 'lucide-react'

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
  
  const navItems = profile?.role === 'hr' ? hrNav 
    : profile?.role === 'mentor' ? mentorNav 
    : employeeNav

  const handleLogout = async () => {
    await logout()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-40">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">OnboardX</h1>
            <p className="text-xs text-slate-500 capitalize">{profile?.role} Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-primary-500' : 'text-slate-400')} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
          <div className={cn(
            'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm',
            generateGradient(profile?.name || '')
          )}>
            {getInitials(profile?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{profile?.name}</p>
            <p className="text-xs text-slate-500 truncate">{profile?.department || 'No Department'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 mt-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
