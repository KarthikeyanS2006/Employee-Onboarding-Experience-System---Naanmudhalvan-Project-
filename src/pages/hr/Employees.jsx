import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge, StatusBadge, Avatar } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage, EmptyState } from '../../components/ui/Loading'
import {
  Search,
  Filter,
  UserPlus,
  Download,
  ChevronRight,
  Mail,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react'

const sampleEmployees = [
  { id: 1, name: 'Alex Chen', email: 'alex.chen@company.com', department: 'Engineering', role: 'employee', joiningDate: '2024-01-15', progress: 75, status: 'active' },
  { id: 2, name: 'Maria Garcia', email: 'maria.garcia@company.com', department: 'Marketing', role: 'employee', joiningDate: '2024-01-10', progress: 45, status: 'at_risk' },
  { id: 3, name: 'James Wilson', email: 'james.wilson@company.com', department: 'Sales', role: 'employee', joiningDate: '2024-01-08', progress: 100, status: 'completed' },
  { id: 4, name: 'Emily Brown', email: 'emily.brown@company.com', department: 'Engineering', role: 'employee', joiningDate: '2024-01-12', progress: 60, status: 'active' },
  { id: 5, name: 'David Kim', email: 'david.kim@company.com', department: 'Finance', role: 'employee', joiningDate: '2024-01-16', progress: 30, status: 'at_risk' },
  { id: 6, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', department: 'HR', role: 'mentor', joiningDate: '2023-06-01', progress: 100, status: 'completed' },
  { id: 7, name: 'Michael Lee', email: 'michael.lee@company.com', department: 'Engineering', role: 'employee', joiningDate: '2024-01-18', progress: 10, status: 'active' },
  { id: 8, name: 'Lisa Wang', email: 'lisa.wang@company.com', department: 'Marketing', role: 'employee', joiningDate: '2024-01-05', progress: 90, status: 'completed' },
]

export default function HREmployees() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState(sampleEmployees)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDept
  })

  if (loading) return <LoadingPage message="Loading employees..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">All Employees</h2>
          <p className="text-slate-500 mt-1">Manage all employees and track onboarding progress</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button>
            <UserPlus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="at_risk">At Risk</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredEmployees.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No employees found"
              description="Try adjusting your search or filter criteria."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/hr/employees/${emp.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={emp.name} size="sm" />
                          <div>
                            <p className="font-medium text-slate-800">{emp.name}</p>
                            <p className="text-sm text-slate-500">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{emp.department}</td>
                      <td className="px-6 py-4">
                        <Badge variant={emp.role === 'mentor' ? 'accent' : 'default'}>
                          {emp.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{emp.joiningDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                emp.progress === 100 ? 'bg-emerald-500' :
                                emp.progress >= 50 ? 'bg-primary-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${emp.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-slate-600">{emp.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {filteredEmployees.length} of {employees.length} employees
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled>Previous</Button>
          <Button variant="secondary" size="sm">Next</Button>
        </div>
      </div>
    </div>
  )
}
