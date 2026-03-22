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
  ChevronRight,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react'

const sampleMentees = [
  { id: 1, name: 'Alex Chen', email: 'alex.chen@company.com', department: 'Engineering', progress: 75, status: 'on_track', joiningDate: '2024-01-15' },
  { id: 2, name: 'Maria Garcia', email: 'maria.garcia@company.com', department: 'Marketing', progress: 45, status: 'at_risk', joiningDate: '2024-01-10' },
  { id: 3, name: 'James Wilson', email: 'james.wilson@company.com', department: 'Sales', progress: 100, status: 'completed', joiningDate: '2024-01-08' },
  { id: 4, name: 'Emily Brown', email: 'emily.brown@company.com', department: 'Engineering', progress: 60, status: 'on_track', joiningDate: '2024-01-12' },
  { id: 5, name: 'David Kim', email: 'david.kim@company.com', department: 'Finance', progress: 30, status: 'at_risk', joiningDate: '2024-01-16' },
  { id: 6, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', department: 'HR', progress: 90, status: 'on_track', joiningDate: '2024-01-05' },
]

export default function MentorEmployees() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [mentees, setMentees] = useState(sampleMentees)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const filteredMentees = mentees.filter(mentee => {
    const matchesSearch = mentee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentee.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || mentee.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) return <LoadingPage message="Loading employees..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">My Mentees</h2>
          <p className="text-slate-500 mt-1">Track and manage your assigned employees</p>
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
            <option value="on_track">On Track</option>
            <option value="at_risk">At Risk</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredMentees.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No mentees found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentees.map(mentee => (
            <Card 
              key={mentee.id} 
              className="hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(`/mentor/employees/${mentee.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={mentee.name} size="lg" />
                    <div>
                      <h3 className="font-semibold text-slate-800">{mentee.name}</h3>
                      <p className="text-sm text-slate-500">{mentee.department}</p>
                    </div>
                  </div>
                  <StatusBadge status={mentee.status === 'on_track' ? 'active' : mentee.status} />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-slate-800">{mentee.progress}%</span>
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

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
