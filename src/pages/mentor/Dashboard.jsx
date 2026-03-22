import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge, StatusBadge, Avatar } from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { formatDate, formatRelativeTime } from '../../lib/utils'
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Calendar,
  ChevronRight,
  UserPlus
} from 'lucide-react'

const sampleMentees = [
  {
    id: 1,
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    department: 'Engineering',
    joiningDate: '2024-01-15',
    progress: 75,
    status: 'on_track',
    lastActivity: '2024-01-18T10:30:00',
    quizScore: 85,
    pendingTasks: 2,
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    department: 'Marketing',
    joiningDate: '2024-01-10',
    progress: 45,
    status: 'at_risk',
    lastActivity: '2024-01-16T14:00:00',
    quizScore: 60,
    pendingTasks: 5,
  },
  {
    id: 3,
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    department: 'Sales',
    joiningDate: '2024-01-08',
    progress: 100,
    status: 'completed',
    lastActivity: '2024-01-18T09:00:00',
    quizScore: 95,
    pendingTasks: 0,
  },
]

const recentActivities = [
  { id: 1, mentee: 'Alex Chen', action: 'Completed Company Orientation', time: '2 hours ago' },
  { id: 2, mentee: 'Maria Garcia', action: 'Needs attention - Quiz score below 70%', time: '5 hours ago' },
  { id: 3, mentee: 'James Wilson', action: 'Completed all onboarding steps', time: '1 day ago' },
  { id: 4, mentee: 'Alex Chen', action: 'Submitted first feedback', time: '1 day ago' },
]

export default function MentorDashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [mentees, setMentees] = useState(sampleMentees)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const stats = {
    totalMentees: mentees.length,
    onTrack: mentees.filter(m => m.status === 'on_track').length,
    atRisk: mentees.filter(m => m.status === 'at_risk').length,
    completed: mentees.filter(m => m.status === 'completed').length,
  }

  if (loading) return <LoadingPage message="Loading dashboard..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Mentees</p>
                <p className="text-4xl font-bold mt-2">{stats.totalMentees}</p>
              </div>
              <Users className="w-12 h-12 text-white/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">On Track</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.onTrack}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">At Risk</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{stats.atRisk}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-3xl font-bold text-accent-600 mt-2">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Mentees</CardTitle>
                <Button variant="secondary" size="sm" onClick={() => navigate('/mentor/employees')}>
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quiz Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mentees.map(mentee => (
                      <tr key={mentee.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/mentor/employees/${mentee.id}`)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar name={mentee.name} size="sm" />
                            <div>
                              <p className="font-medium text-slate-800">{mentee.name}</p>
                              <p className="text-sm text-slate-500">{mentee.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-500">{mentee.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  mentee.progress === 100 ? 'bg-emerald-500' :
                                  mentee.progress >= 50 ? 'bg-primary-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${mentee.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-medium ${
                            mentee.quizScore >= 70 ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {mentee.quizScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={mentee.status === 'on_track' ? 'active' : mentee.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/mentor/employees/${mentee.id}`) }}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="p-4">
                    <p className="text-sm text-slate-800">
                      <span className="font-medium">{activity.mentee}</span>
                    </p>
                    <p className="text-sm text-slate-500">{activity.action}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <UserPlus className="w-4 h-4" />
                Add New Mentee
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <MessageSquare className="w-4 h-4" />
                Send Group Reminder
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Calendar className="w-4 h-4" />
                Schedule 1:1 Meetings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
