import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge, Avatar } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  Users,
  UserPlus,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  BarChart3,
  GraduationCap,
  Award
} from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const sampleStats = {
  totalEmployees: 156,
  newThisWeek: 12,
  completedOnboarding: 89,
  inProgress: 45,
  atRisk: 22,
  avgCompletionDays: 8,
  completionRate: 67,
}

const departmentData = {
  labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'],
  datasets: [
    {
      label: 'Completed',
      data: [25, 15, 20, 12, 10, 7],
      backgroundColor: '#10B981',
    },
    {
      label: 'In Progress',
      data: [12, 8, 10, 6, 5, 4],
      backgroundColor: '#3B82F6',
    },
    {
      label: 'At Risk',
      data: [5, 3, 6, 2, 3, 3],
      backgroundColor: '#F59E0B',
    },
  ],
}

const progressData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Completion Rate',
      data: [15, 35, 55, 67],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
}

const recentHires = [
  { id: 1, name: 'Alex Chen', department: 'Engineering', joiningDate: '2024-01-18', progress: 25 },
  { id: 2, name: 'Maria Garcia', department: 'Marketing', joiningDate: '2024-01-17', progress: 45 },
  { id: 3, name: 'James Wilson', department: 'Sales', joiningDate: '2024-01-16', progress: 60 },
  { id: 4, name: 'Emily Brown', department: 'Engineering', joiningDate: '2024-01-15', progress: 80 },
  { id: 5, name: 'David Kim', department: 'Finance', joiningDate: '2024-01-14', progress: 35 },
]

export default function HRDashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  if (loading) return <LoadingPage message="Loading analytics..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Analytics Dashboard</h2>
          <p className="text-slate-500 mt-1">Track onboarding metrics and employee progress</p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Employees</p>
                <p className="text-4xl font-bold mt-2">{sampleStats.totalEmployees}</p>
                <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12 this week
                </p>
              </div>
              <Users className="w-12 h-12 text-white/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{sampleStats.completedOnboarding}</p>
                <p className="text-sm text-slate-500 mt-2">{sampleStats.completionRate}% rate</p>
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
                <p className="text-sm text-slate-500">In Progress</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">{sampleStats.inProgress}</p>
                <p className="text-sm text-slate-500 mt-2">Avg {sampleStats.avgCompletionDays} days</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">At Risk</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">{sampleStats.atRisk}</p>
                <p className="text-sm text-slate-500 mt-2">Needs attention</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Onboarding by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar 
                data={departmentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line 
                data={progressData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, max: 100 },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Hires</CardTitle>
              <Button variant="secondary" size="sm" onClick={() => navigate('/hr/employees')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentHires.map(employee => (
                    <tr key={employee.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/hr/employees/${employee.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={employee.name} size="sm" />
                          <span className="font-medium text-slate-800">{employee.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{employee.department}</td>
                      <td className="px-6 py-4 text-slate-600">{employee.joiningDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                employee.progress >= 70 ? 'bg-emerald-500' :
                                employee.progress >= 40 ? 'bg-primary-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${employee.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-600">{employee.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="text-sm text-slate-500">Certificates Issued</p>
                  <p className="text-xl font-bold text-slate-800">89</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="text-sm text-slate-500">Avg Quiz Score</p>
                  <p className="text-xl font-bold text-slate-800">82%</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-accent-50 rounded-xl">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-accent-600" />
                <div>
                  <p className="text-sm text-slate-500">Feedback Avg</p>
                  <p className="text-xl font-bold text-slate-800">4.5/5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
