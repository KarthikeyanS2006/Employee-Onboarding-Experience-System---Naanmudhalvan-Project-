import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge, Avatar } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import { LoadingPage } from '../../components/ui/Loading'
import { formatDate, formatRelativeTime } from '../../lib/utils'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  Star,
  Send,
  Edit,
  UserX,
  UserCheck
} from 'lucide-react'

const sampleEmployee = {
  id: 1,
  name: 'Alex Chen',
  email: 'alex.chen@company.com',
  department: 'Engineering',
  role: 'employee',
  joiningDate: '2024-01-15',
  progress: 75,
  status: 'active',
  quizScore: 85,
  documentsVerified: 4,
  feedbackRating: 4.5,
  mentor: 'Sarah Johnson',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, San Francisco, CA',
  completedSteps: [
    { id: 1, title: 'Company Orientation', completedAt: '2024-01-15' },
    { id: 2, title: 'HR Policies', completedAt: '2024-01-16' },
    { id: 3, title: 'Security Training', completedAt: '2024-01-17' },
    { id: 4, title: 'Department Introduction', completedAt: '2024-01-17' },
  ],
  pendingSteps: [
    { id: 5, title: 'Tools & Systems Quiz', type: 'quiz' },
    { id: 6, title: 'Final Assessment', type: 'quiz' },
    { id: 7, title: 'Final Feedback', type: 'feedback' },
  ],
  feedback: [
    { step: 'Company Orientation', rating: 5, comment: 'Great introduction!', date: '2024-01-15' },
    { step: 'HR Policies', rating: 4, comment: 'Very informative', date: '2024-01-16' },
    { step: 'Security Training', rating: 5, comment: 'Excellent content', date: '2024-01-17' },
  ],
  quizHistory: [
    { title: 'Company Culture Quiz', score: 90, date: '2024-01-15' },
    { title: 'Security Awareness Quiz', score: 85, date: '2024-01-17' },
  ],
}

export default function HREmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState(sampleEmployee)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [id])

  const handleSendReminder = () => {
    toast.success('Reminder sent to employee!')
  }

  const handleReassignMentor = () => {
    toast.success('Mentor reassignment initiated')
  }

  if (loading) return <LoadingPage message="Loading employee details..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <button 
        onClick={() => navigate('/hr/employees')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Employees
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar name={employee.name} size="xl" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{employee.name}</h2>
                    <p className="text-slate-500">{employee.department} • {employee.role}</p>
                    <p className="text-sm text-slate-400 mt-1">Joined {formatDate(employee.joiningDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={employee.status === 'active' ? 'success' : employee.status === 'at_risk' ? 'warning' : 'accent'}>
                    {employee.status}
                  </Badge>
                  <Button variant="secondary" size="sm">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary-600">{employee.progress}%</p>
                  <p className="text-sm text-slate-500">Progress</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-600">{employee.quizScore}%</p>
                  <p className="text-sm text-slate-500">Quiz Score</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-600">{employee.documentsVerified}/6</p>
                  <p className="text-sm text-slate-500">Docs Verified</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-2xl font-bold text-amber-600">{employee.feedbackRating}</p>
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                  <p className="text-sm text-slate-500">Feedback Avg</p>
                </div>
              </div>

              <ProgressBar value={employee.progress} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-emerald-600 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed ({employee.completedSteps.length})
                  </h4>
                  <div className="space-y-2">
                    {employee.completedSteps.map(step => (
                      <div key={step.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span className="font-medium text-slate-800">{step.title}</span>
                        </div>
                        <span className="text-sm text-slate-500">{step.completedAt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-amber-600 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Pending ({employee.pendingSteps.length})
                  </h4>
                  <div className="space-y-2">
                    {employee.pendingSteps.map(step => (
                      <div key={step.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {step.type === 'quiz' ? (
                            <HelpCircle className="w-5 h-5 text-amber-600" />
                          ) : step.type === 'training' ? (
                            <GraduationCap className="w-5 h-5 text-amber-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-amber-600" />
                          )}
                          <span className="font-medium text-slate-800">{step.title}</span>
                        </div>
                        <Badge variant="warning">{step.type}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {employee.quizHistory.map((quiz, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">{quiz.title}</p>
                        <p className="text-sm text-slate-500">{quiz.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          quiz.score >= 70 ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {quiz.score}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {employee.feedback.map((fb, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-800">{fb.step}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{fb.comment}</p>
                      <p className="text-xs text-slate-400 mt-1">{fb.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{formatDate(employee.joiningDate)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentor Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={employee.mentor} size="md" />
                <div>
                  <p className="font-medium text-slate-800">{employee.mentor}</p>
                  <p className="text-sm text-slate-500">Assigned Mentor</p>
                </div>
              </div>
              <Button variant="secondary" className="w-full" onClick={handleReassignMentor}>
                Reassign Mentor
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HR Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleSendReminder}>
                <MessageSquare className="w-4 h-4" />
                Send Reminder
              </Button>
              <Button variant="secondary" className="w-full">
                <CheckCircle2 className="w-4 h-4" />
                Mark as Complete
              </Button>
              <Button variant="secondary" className="w-full">
                <Calendar className="w-4 h-4" />
                Schedule Check-in
              </Button>
              <Button variant="danger" className="w-full">
                <UserX className="w-4 h-4" />
                Remove Employee
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
