import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge, Avatar } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { formatDate, calculateProgress } from '../../lib/utils'
import { GraduationCap, FileText, MessageSquare, Award, CheckCircle2, Clock, Play, ArrowRight, Users } from 'lucide-react'

const departmentSteps = {
  IT: [
    { id: 1, title: 'IT Orientation', description: 'Learn about IT department and policies', type: 'training', status: 'completed' },
    { id: 2, title: 'Security Training', description: 'Cybersecurity fundamentals', type: 'training', status: 'completed' },
    { id: 3, title: 'Development Setup', description: 'Set up your development environment', type: 'document', status: 'in_progress' },
    { id: 4, title: 'Code Review Process', description: 'Learn our code review standards', type: 'training', status: 'pending' },
    { id: 5, title: 'Git Workflow Quiz', description: 'Test your Git knowledge', type: 'quiz', status: 'pending' },
    { id: 6, title: 'DevOps Overview', description: 'CI/CD and deployment pipeline', type: 'training', status: 'pending' },
  ],
  HR: [
    { id: 1, title: 'HR Policies Overview', description: 'Company policies and procedures', type: 'training', status: 'completed' },
    { id: 2, title: 'Benefits Administration', description: 'Employee benefits management', type: 'training', status: 'completed' },
    { id: 3, title: 'Recruitment System', description: 'How to use our ATS', type: 'training', status: 'in_progress' },
    { id: 4, title: 'Payroll Training', description: 'Payroll processing basics', type: 'training', status: 'pending' },
    { id: 5, title: 'HR Quiz', description: 'Test your HR knowledge', type: 'quiz', status: 'pending' },
    { id: 6, title: 'Onboarding Best Practices', description: 'How to onboard new hires', type: 'training', status: 'pending' },
  ],
  Sales: [
    { id: 1, title: 'Sales Orientation', description: 'Learn about our sales process', type: 'training', status: 'completed' },
    { id: 2, title: 'Product Knowledge', description: 'Understanding our products', type: 'training', status: 'completed' },
    { id: 3, title: 'CRM Training', description: 'Using our CRM system', type: 'training', status: 'in_progress' },
    { id: 4, title: 'Sales Playbook', description: 'Our sales methodology', type: 'document', status: 'pending' },
    { id: 5, title: 'Sales Quiz', description: 'Test your sales knowledge', type: 'quiz', status: 'pending' },
    { id: 6, title: 'Demo Training', description: 'Product demonstration skills', type: 'training', status: 'pending' },
  ],
  Marketing: [
    { id: 1, title: 'Marketing Orientation', description: 'Brand and marketing overview', type: 'training', status: 'completed' },
    { id: 2, title: 'Brand Guidelines', description: 'Our brand standards', type: 'document', status: 'completed' },
    { id: 3, title: 'Campaign Tools', description: 'Marketing automation tools', type: 'training', status: 'in_progress' },
    { id: 4, title: 'Content Strategy', description: 'Creating marketing content', type: 'training', status: 'pending' },
    { id: 5, title: 'Marketing Quiz', description: 'Test your marketing knowledge', type: 'quiz', status: 'pending' },
    { id: 6, title: 'Analytics Training', description: 'Measuring campaign success', type: 'training', status: 'pending' },
  ],
  Finance: [
    { id: 1, title: 'Finance Orientation', description: 'Financial procedures overview', type: 'training', status: 'completed' },
    { id: 2, title: 'Accounting Software', description: 'Using our accounting tools', type: 'training', status: 'completed' },
    { id: 3, title: 'Compliance Training', description: 'Financial compliance requirements', type: 'training', status: 'in_progress' },
    { id: 4, title: 'Expense Policy', description: 'Company expense guidelines', type: 'document', status: 'pending' },
    { id: 5, title: 'Finance Quiz', description: 'Test your finance knowledge', type: 'quiz', status: 'pending' },
    { id: 6, title: 'Reporting Tools', description: 'Financial reporting systems', type: 'training', status: 'pending' },
  ],
  Default: [
    { id: 1, title: 'Company Orientation', description: 'Learn about our culture', type: 'training', status: 'completed' },
    { id: 2, title: 'HR Policies', description: 'Review company policies', type: 'document', status: 'completed' },
    { id: 3, title: 'Department Intro', description: 'Meet your team', type: 'training', status: 'in_progress' },
    { id: 4, title: 'Tools Training', description: 'Learn our tools', type: 'training', status: 'pending' },
    { id: 5, title: 'Security Basics', description: 'Security fundamentals', type: 'quiz', status: 'pending' },
    { id: 6, title: 'First Feedback', description: 'Share your experience', type: 'feedback', status: 'pending' },
  ]
}

const quickActions = [
  { icon: GraduationCap, label: 'Training', path: '/employee/training', color: 'bg-blue-50 text-blue-600' },
  { icon: FileText, label: 'Documents', path: '/employee/documents', color: 'bg-green-50 text-green-600' },
  { icon: MessageSquare, label: 'Feedback', path: '/employee/feedback', color: 'bg-purple-50 text-purple-600' },
  { icon: Users, label: 'Mentor', path: '/employee/mentor', color: 'bg-orange-50 text-orange-600' },
  { icon: Award, label: 'Certificate', path: '/employee/certificate', color: 'bg-rose-50 text-rose-600' },
]

export default function EmployeeDashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [steps, setSteps] = useState([])

  useEffect(() => {
    const dept = profile?.department || 'Default'
    const deptSteps = departmentSteps[dept] || departmentSteps['Default']
    const completed = deptSteps.filter(s => s.status === 'completed').length
    setSteps(deptSteps)
    setProgress(calculateProgress(completed, deptSteps.length))
    setTimeout(() => setLoading(false), 500)
  }, [profile?.department])

  if (loading) return <LoadingPage message="Loading dashboard..." />

  const completedSteps = steps.filter(s => s.status === 'completed').length
  const nextStep = steps.find(s => s.status === 'in_progress' || s.status === 'pending')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Welcome back,</p>
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.name || 'User'}</h2>
                  <p className="text-gray-600 mt-1">{profile?.department || 'Team Member'}</p>
                  <p className="text-gray-400 text-sm mt-1">Joined {profile?.joining_date ? formatDate(profile.joining_date) : 'Recently'}</p>
                </div>
                <Avatar name={profile?.name} size="xl" />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Onboarding Progress</span>
                  <span className="font-semibold text-gray-900">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> {completedSteps} Completed</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-500" /> {steps.length - completedSteps} Remaining</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className={`p-4 rounded-xl ${action.color} hover:opacity-80 transition-opacity text-center`}
                  >
                    <action.icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {nextStep && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Next Step</p>
                  <h3 className="font-semibold text-gray-900">{nextStep.title}</h3>
                  <p className="text-sm text-gray-500">{nextStep.description}</p>
                </div>
              </div>
              <Button onClick={() => navigate('/employee/training')}>
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Onboarding Steps</CardTitle>
            <Badge>{completedSteps}/{steps.length} Complete</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate('/employee/training')}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.status === 'completed' ? 'bg-green-100 text-green-600' : 
                  step.status === 'in_progress' ? 'bg-blue-100 text-blue-600' : 
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${step.status === 'completed' ? 'text-gray-500' : 'text-gray-900'}`}>{step.title}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
                <Badge variant={step.type === 'quiz' ? 'primary' : 'default'}>{step.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
