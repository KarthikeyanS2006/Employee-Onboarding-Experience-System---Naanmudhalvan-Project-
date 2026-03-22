import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight, Users, Shield, Briefcase, UserCircle, GraduationCap, Building2, Wand2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const DEMO_ACCOUNTS = [
  {
    role: 'employee',
    label: 'Employee',
    description: 'New hire onboarding',
    icon: UserCircle,
    email: 'employee@demo.com',
    color: 'blue'
  },
  {
    role: 'mentor',
    label: 'Mentor',
    description: 'Guide & train employees',
    icon: GraduationCap,
    email: 'mentor@demo.com',
    color: 'purple'
  },
  {
    role: 'hr',
    label: 'HR Admin',
    description: 'Manage & monitor onboarding',
    icon: Building2,
    email: 'hr@demo.com',
    color: 'green'
  }
]

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [creatingDemo, setCreatingDemo] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: 'employee',
    department: ''
  })
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleQuickLogin = (account) => {
    setSelectedRole(account.role)
    setIsLogin(true)
    setFormData(prev => ({
      ...prev,
      email: account.email,
      password: 'demo123',
      role: account.role
    }))
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/employee/dashboard`
        }
      })
      
      if (error) throw error
    } catch (error) {
      toast.error(error.message || 'Google login failed')
      setGoogleLoading(false)
    }
  }

  const handleCreateDemoAccounts = async () => {
    setCreatingDemo(true)
    try {
      const demoUsers = [
        { email: 'employee@demo.com', name: 'Demo Employee', role: 'employee', department: 'Engineering' },
        { email: 'mentor@demo.com', name: 'Demo Mentor', role: 'mentor', department: 'Engineering' },
        { email: 'hr@demo.com', name: 'Demo HR Admin', role: 'hr', department: 'Human Resources' }
      ]

      for (const user of demoUsers) {
        const { error } = await supabase.auth.signUp({
          email: user.email,
          password: 'demo123',
          options: {
            data: {
              name: user.name,
              role: user.role,
              department: user.department
            }
          }
        })
        if (error && error.message !== 'User already registered') {
          console.warn(`Error creating ${user.email}:`, error.message)
        }
      }
      
      toast.success('Demo accounts created! You can now login.')
    } catch (error) {
      toast.error('Failed to create demo accounts')
    } finally {
      setCreatingDemo(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const profile = await login(formData.email, formData.password)
        toast.success(`Welcome back, ${profile.name}!`)
        
        if (profile.role === 'hr') navigate('/hr/dashboard')
        else if (profile.role === 'mentor') navigate('/mentor/dashboard')
        else navigate('/employee/dashboard')
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          setLoading(false)
          return
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          setLoading(false)
          return
        }
        
        await register(formData.email, formData.password, formData.name, formData.role, formData.department)
        toast.success('Account created successfully!')
        navigate('/employee/dashboard')
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-white border-r border-gray-200 p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">OnboardX</span>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                Employee Onboarding<br />Made Simple
              </h1>
              <p className="text-gray-600 leading-relaxed">
                A complete platform for new hire onboarding. Track progress, complete training, and get certified.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">3 Roles</p>
                <p className="text-sm text-gray-500">Custom views</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <Shield className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Secure</p>
                <p className="text-sm text-gray-500">Enterprise-ready</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <Briefcase className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-500">Track progress</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm">© 2024 OnboardX</p>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">OnboardX</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              {isLogin && !selectedRole && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Select Your Role</h2>
                    <p className="mt-1 text-gray-500 text-sm">Choose how you want to login</p>
                  </div>
                  <div className="space-y-3">
                    {DEMO_ACCOUNTS.map((account) => {
                      const Icon = account.icon
                      const colorClasses = {
                        blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
                        purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
                        green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                      }
                      return (
                        <button
                          key={account.role}
                          onClick={() => handleQuickLogin(account)}
                          className={`w-full p-4 rounded-lg border transition-all flex items-center gap-4 ${colorClasses[account.color]}`}
                        >
                          <Icon className="w-8 h-8" />
                          <div className="text-left flex-1">
                            <p className="font-semibold">{account.label}</p>
                            <p className="text-sm opacity-75">{account.description}</p>
                          </div>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <button 
                      onClick={handleGoogleLogin} 
                      disabled={googleLoading}
                      className="w-full py-3 px-4 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                    >
                      {googleLoading ? (
                        <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Continue with Google
                        </>
                      )}
                    </button>
                    
                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-gray-300 w-full"></div>
                      <span className="bg-white px-3 text-sm text-gray-400 absolute">or</span>
                    </div>
                    
                    <button 
                      onClick={handleCreateDemoAccounts} 
                      disabled={creatingDemo}
                      className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {creatingDemo ? (
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><Wand2 className="w-4 h-4" /> Create Demo Accounts</>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400">Creates: employee@demo.com, mentor@demo.com, hr@demo.com</p>
                    <button onClick={() => setIsLogin(false)} className="w-full text-center text-sm text-gray-500">
                      New here? <span className="text-blue-600 font-medium hover:underline">Create account</span>
                    </button>
                  </div>
                </>
              )}

              {(selectedRole || !isLogin) && (
                <>
                  <div className="text-center mb-6">
                    <button 
                      onClick={() => { setSelectedRole(null); setIsLogin(true) }} 
                      className="text-sm text-gray-500 hover:text-gray-700 mb-2"
                    >
                      ← Change role
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">
                      {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="mt-1 text-gray-500 text-sm">
                      {isLogin ? 'Sign in to continue' : 'Start your onboarding journey'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Smith" required />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                          <select name="role" value={formData.role} onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="employee">New Employee</option>
                            <option value="mentor">Mentor / Manager</option>
                            <option value="hr">HR Admin</option>
                          </select>
                        </div>

                        {formData.role === 'employee' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select name="department" value={formData.department} onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                              <option value="">Select department</option>
                              <option value="Engineering">Engineering</option>
                              <option value="Marketing">Marketing</option>
                              <option value="Sales">Sales</option>
                              <option value="HR">Human Resources</option>
                              <option value="Finance">Finance</option>
                            </select>
                          </div>
                        )}
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@company.com" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          placeholder="••••••••" required minLength={6} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="••••••••" required minLength={6} />
                      </div>
                    )}

                    <button type="submit" disabled={loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-gray-500 text-sm">
                      {isLogin ? "Don't have an account?" : 'Already have an account?'}
                      <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-blue-600 hover:text-blue-700 font-medium">
                        {isLogin ? 'Sign up' : 'Sign in'}
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
