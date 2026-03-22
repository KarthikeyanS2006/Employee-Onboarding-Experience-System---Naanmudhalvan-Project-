import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight, Users, Shield, Briefcase } from 'lucide-react'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
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
              <div className="text-center mb-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
