import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import ProgressBar from '../../components/ui/ProgressBar'
import { Badge, StatusBadge, Avatar } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { supabase } from '../../lib/supabase'
import { formatDate, formatRelativeTime, calculateProgress } from '../../lib/utils'
import {
  GraduationCap,
  FileText,
  MessageSquare,
  Award,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  TrendingUp,
  Users,
  Calendar,
  Play,
  Upload
} from 'lucide-react'

const sampleSteps = [
  { id: 1, title: 'Company Orientation', description: 'Learn about our culture, values, and mission', type: 'training', status: 'completed' },
  { id: 2, title: 'HR Policies & Compliance', description: 'Review essential policies and sign acknowledgments', type: 'document', status: 'completed' },
  { id: 3, title: 'Department Introduction', description: 'Meet your team and understand your role', type: 'training', status: 'in_progress' },
  { id: 4, title: 'Tools & Systems Training', description: 'Get hands-on with our core tools and platforms', type: 'quiz', status: 'pending' },
  { id: 5, title: 'Security Awareness', description: 'Complete security fundamentals training', type: 'quiz', status: 'pending' },
  { id: 6, title: 'First Week Feedback', description: 'Share your onboarding experience', type: 'feedback', status: 'pending' },
]

const sampleActivities = [
  { id: 1, action: 'Completed', item: 'Company Orientation', time: '2 hours ago', icon: CheckCircle2 },
  { id: 2, action: 'Started', item: 'Department Introduction', time: '1 day ago', icon: Play },
  { id: 3, action: 'Uploaded', item: 'Signed NDA', time: '2 days ago', icon: Upload },
]

export default function EmployeeDashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [stats, setStats] = useState({
    completedSteps: 0,
    totalSteps: 0,
    quizScore: 0,
    daysActive: 0
  })

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const completedSteps = sampleSteps.filter(s => s.status === 'completed').length
        setProgress(calculateProgress(completedSteps, sampleSteps.length))
        setStats({
          completedSteps,
          totalSteps: sampleSteps.length,
          quizScore: 85,
          daysActive: 5
        })
      } catch (error) {
        console.error('Error loading progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  if (loading) return <LoadingPage message="Loading your dashboard..." />

  const nextStep = sampleSteps.find(s => s.status === 'in_progress' || s.status === 'pending')

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-primary-500 to-primary-700 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <CardContent className="relative p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Welcome back,</p>
                  <h2 className="text-3xl font-bold mt-1">{profile?.name}</h2>
                  <p className="text-blue-100 mt-2">
                    {profile?.department ? `${profile.department} Department` : 'New Team Member'}
                  </p>
                  <p className="text-blue-100/80 text-sm mt-1">
                    Joined {profile?.joining_date ? formatDate(profile.joining_date) : 'Recently'}
                  </p>
                </div>
                <Avatar name={profile?.name} size="xl" className="ring-4 ring-white/20" />
              </div>
              
              <div className="mt-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-blue-100">Onboarding Progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-slate-600">Completed</span>
                  </div>
                  <span className="font-semibold text-slate-800">{stats.completedSteps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm text-slate-600">Remaining</span>
                  </div>
                  <span className="font-semibold text-slate-800">{stats.totalSteps - stats.completedSteps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-600">Quiz Score</span>
                  </div>
                  <span className="font-semibold text-slate-800">{stats.quizScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-sm text-slate-600">Days Active</span>
                  </div>
                  <span className="font-semibold text-slate-800">{stats.daysActive}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Your Mentor</h3>
              <div className="flex items-center gap-4">
                <Avatar name="Sarah Johnson" size="lg" />
                <div>
                  <p className="font-medium text-slate-800">Sarah Johnson</p>
                  <p className="text-sm text-slate-500">Senior Engineer</p>
                  <Badge variant="success" className="mt-1">Active</Badge>
                </div>
              </div>
              <Button variant="secondary" className="w-full mt-4" onClick={() => navigate('/employee/mentor')}>
                <MessageSquare className="w-4 h-4" />
                Message Mentor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {nextStep && (
        <Card className="border-l-4 border-l-primary-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-primary-600 font-medium">Up Next</p>
                  <h3 className="text-lg font-semibold text-slate-800">{nextStep.title}</h3>
                  <p className="text-sm text-slate-500">{nextStep.description}</p>
                </div>
              </div>
              <Button onClick={() => navigate('/employee/training')}>
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Onboarding Steps</CardTitle>
              <Badge variant="primary">{stats.completedSteps}/{stats.totalSteps} Complete</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {sampleSteps.map((step, index) => (
                <div 
                  key={step.id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate('/employee/training')}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'completed' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : step.status === 'in_progress'
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : step.status === 'in_progress' ? (
                      <Circle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${step.status === 'completed' ? 'text-slate-500' : 'text-slate-800'}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-slate-500">{step.description}</p>
                  </div>
                  <Badge variant={
                    step.type === 'training' ? 'primary' :
                    step.type === 'quiz' ? 'accent' :
                    step.type === 'document' ? 'warning' : 'default'
                  }>
                    {step.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {sampleActivities.map(activity => (
                  <div key={activity.id} className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <activity.icon className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800">
                        <span className="font-medium">{activity.action}</span> {activity.item}
                      </p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/employee/documents')}>
                <Upload className="w-5 h-5" />
                <span className="text-xs">Upload Docs</span>
              </Button>
              <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/employee/feedback')}>
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs">Give Feedback</span>
              </Button>
              <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/employee/training')}>
                <GraduationCap className="w-5 h-5" />
                <span className="text-xs">Training</span>
              </Button>
              <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/employee/certificate')}>
                <Award className="w-5 h-5" />
                <span className="text-xs">Certificate</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
