import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Users, UserPlus, TrendingUp, Clock, CheckCircle2, AlertTriangle, Download, BarChart3, Award } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const stats = { totalEmployees: 156, newThisWeek: 12, completedOnboarding: 89, inProgress: 45, atRisk: 22, avgCompletionDays: 8, completionRate: 67 }

const departmentData = {
  labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
  datasets: [{ label: 'Completed', data: [25, 15, 20, 12, 10], backgroundColor: '#10B981' }, { label: 'In Progress', data: [12, 8, 10, 6, 5], backgroundColor: '#3B82F6' }]
}

const recentHires = [
  { id: 1, name: 'Alex Chen', department: 'Engineering', joiningDate: '2024-01-18', progress: 25 },
  { id: 2, name: 'Maria Garcia', department: 'Marketing', joiningDate: '2024-01-17', progress: 45 },
  { id: 3, name: 'James Wilson', department: 'Sales', joiningDate: '2024-01-16', progress: 60 },
  { id: 4, name: 'Emily Brown', department: 'Engineering', joiningDate: '2024-01-15', progress: 80 },
  { id: 5, name: 'David Kim', department: 'Finance', joiningDate: '2024-01-14', progress: 35 },
]

export default function HRDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => { setTimeout(() => setLoading(false), 500) }, [])

  if (loading) return <LoadingPage message="Loading analytics..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-500 mt-1">Track onboarding metrics</p>
        </div>
        <Button variant="secondary"><Download className="w-4 h-4 mr-2" />Export</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Total Employees</p><p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEmployees}</p><p className="text-xs text-green-600 mt-1">+{stats.newThisWeek} this week</p></div><Users className="w-10 h-10 text-gray-200" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Completed</p><p className="text-3xl font-bold text-green-600 mt-1">{stats.completedOnboarding}</p><p className="text-xs text-gray-500 mt-1">{stats.completionRate}% rate</p></div><CheckCircle2 className="w-10 h-10 text-green-100" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">In Progress</p><p className="text-3xl font-bold text-blue-600 mt-1">{stats.inProgress}</p><p className="text-xs text-gray-500 mt-1">Avg {stats.avgCompletionDays} days</p></div><Clock className="w-10 h-10 text-blue-100" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">At Risk</p><p className="text-3xl font-bold text-amber-600 mt-1">{stats.atRisk}</p><p className="text-xs text-gray-500 mt-1">Needs attention</p></div><AlertTriangle className="w-10 h-10 text-amber-100" /></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Onboarding by Department</CardTitle></CardHeader>
          <CardContent><div className="h-64"><Bar data={departmentData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }} /></div></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Hires</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Employee</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Department</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Progress</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {recentHires.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/hr/employees/${emp.id}`)}>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar name={emp.name} size="sm" /><span className="font-medium text-gray-900">{emp.name}</span></div></td>
                    <td className="px-4 py-3 text-gray-600">{emp.department}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-20 h-1.5 bg-gray-200 rounded-full"><div className={`h-full rounded-full ${emp.progress >= 70 ? 'bg-green-500' : emp.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${emp.progress}%` }} /></div><span className="text-sm font-medium text-gray-600">{emp.progress}%</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-5"><div className="flex items-center gap-3"><Award className="w-8 h-8 text-green-600" /><div><p className="text-sm text-gray-500">Certificates Issued</p><p className="text-xl font-bold text-gray-900">89</p></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center gap-3"><BarChart3 className="w-8 h-8 text-blue-600" /><div><p className="text-sm text-gray-500">Avg Quiz Score</p><p className="text-xl font-bold text-gray-900">82%</p></div></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center gap-3"><TrendingUp className="w-8 h-8 text-purple-600" /><div><p className="text-sm text-gray-500">Feedback Avg</p><p className="text-xl font-bold text-gray-900">4.5/5</p></div></div></CardContent></Card>
      </div>
    </div>
  )
}
