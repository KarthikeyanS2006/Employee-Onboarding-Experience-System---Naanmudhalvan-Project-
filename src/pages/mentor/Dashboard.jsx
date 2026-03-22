import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Avatar, StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { Users, CheckCircle2, AlertTriangle, Clock, MessageSquare, Calendar, TrendingUp } from 'lucide-react'

const mentees = [
  { id: 1, name: 'Alex Chen', email: 'alex@company.com', department: 'Engineering', progress: 75, status: 'active', lastActive: '2 hours ago', quizScore: 85 },
  { id: 2, name: 'Maria Garcia', email: 'maria@company.com', department: 'Marketing', progress: 45, status: 'at_risk', lastActive: '5 hours ago', quizScore: 60 },
  { id: 3, name: 'James Wilson', email: 'james@company.com', department: 'Sales', progress: 100, status: 'completed', lastActive: '1 day ago', quizScore: 95 },
  { id: 4, name: 'Emily Brown', email: 'emily@company.com', department: 'Engineering', progress: 60, status: 'active', lastActive: '3 hours ago', quizScore: 72 },
]

const recentActivity = [
  { id: 1, mentee: 'Alex Chen', action: 'Completed Security Training', time: '2 hours ago' },
  { id: 2, mentee: 'Maria Garcia', action: 'Needs attention - Quiz score below 70%', time: '5 hours ago' },
  { id: 3, mentee: 'James Wilson', action: 'Completed all onboarding steps', time: '1 day ago' },
]

export default function MentorDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => { setTimeout(() => setLoading(false), 500) }, [])

  const stats = { totalMentees: mentees.length, onTrack: mentees.filter(m => m.status === 'active').length, atRisk: mentees.filter(m => m.status === 'at_risk').length, completed: mentees.filter(m => m.status === 'completed').length }

  if (loading) return <LoadingPage message="Loading dashboard..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Mentor Dashboard</h2>
          <p className="text-gray-500 mt-1">Manage your assigned mentees</p>
        </div>
        <Button variant="secondary"><MessageSquare className="w-4 h-4 mr-2" />Send Group Reminder</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Mentees</p><p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalMentees}</p></div><Users className="w-10 h-10 text-gray-200" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">On Track</p><p className="text-3xl font-bold text-green-600 mt-1">{stats.onTrack}</p></div><CheckCircle2 className="w-10 h-10 text-green-100" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">At Risk</p><p className="text-3xl font-bold text-amber-600 mt-1">{stats.atRisk}</p></div><AlertTriangle className="w-10 h-10 text-amber-100" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Completed</p><p className="text-3xl font-bold text-blue-600 mt-1">{stats.completed}</p></div><TrendingUp className="w-10 h-10 text-blue-100" /></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><div className="flex items-center justify-between"><CardTitle>Your Mentees</CardTitle><Button variant="secondary" size="sm" onClick={() => navigate('/mentor/employees')}>View All</Button></div></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Employee</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Progress</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Quiz</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500"></th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {mentees.map(mentee => (
                  <tr key={mentee.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/mentor/employees/${mentee.id}`)}>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar name={mentee.name} size="sm" /><div><p className="font-medium text-gray-900">{mentee.name}</p><p className="text-xs text-gray-500">{mentee.department}</p></div></div></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-20 h-1.5 bg-gray-200 rounded-full"><div className={`h-full rounded-full ${mentee.progress >= 70 ? 'bg-green-500' : mentee.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${mentee.progress}%` }} /></div><span className="text-sm font-medium text-gray-600">{mentee.progress}%</span></div></td>
                    <td className="px-4 py-3"><span className={`font-medium ${mentee.quizScore >= 70 ? 'text-green-600' : 'text-amber-600'}`}>{mentee.quizScore}%</span></td>
                    <td className="px-4 py-3"><StatusBadge status={mentee.status} /></td>
                    <td className="px-4 py-3"><Button variant="ghost" size="sm">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="p-4">
                    <p className="text-sm text-gray-800"><span className="font-medium">{activity.mentee}</span></p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start"><MessageSquare className="w-4 h-4 mr-2" />Send Reminder</Button>
              <Button variant="secondary" className="w-full justify-start"><Calendar className="w-4 h-4 mr-2" />Schedule Meeting</Button>
              <Button variant="secondary" className="w-full justify-start"><TrendingUp className="w-4 h-4 mr-2" />View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
