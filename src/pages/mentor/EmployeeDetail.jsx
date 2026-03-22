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
  AlertTriangle,
  FileText,
  GraduationCap,
  HelpCircle,
  Star,
  Send,
  User
} from 'lucide-react'

const sampleEmployee = {
  id: 1,
  name: 'Alex Chen',
  email: 'alex.chen@company.com',
  department: 'Engineering',
  joiningDate: '2024-01-15',
  progress: 75,
  status: 'on_track',
  quizScore: 85,
  documentsVerified: 4,
  feedbackRating: 4.5,
  completedSteps: [
    { id: 1, title: 'Company Orientation', completedAt: '2024-01-15' },
    { id: 2, title: 'HR Policies', completedAt: '2024-01-16' },
    { id: 3, title: 'Security Training', completedAt: '2024-01-17' },
  ],
  pendingSteps: [
    { id: 4, title: 'Tools & Systems Quiz', type: 'quiz' },
    { id: 5, title: 'Department Introduction', type: 'training' },
    { id: 6, title: 'Final Feedback', type: 'feedback' },
  ],
  feedback: [
    { step: 'Company Orientation', rating: 5, comment: 'Great introduction!', date: '2024-01-15' },
    { step: 'HR Policies', rating: 4, comment: 'Very informative', date: '2024-01-16' },
  ],
  comments: [
    { id: 1, text: 'Progressing well, enthusiastic about learning.', author: 'You', date: '2024-01-17' },
  ],
}

export default function MentorEmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [employee, setEmployee] = useState(sampleEmployee)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [id])

  const handleAddComment = () => {
    if (!newComment.trim()) return
    
    const comment = {
      id: Date.now(),
      text: newComment,
      author: 'You',
      date: new Date().toISOString(),
    }
    
    setEmployee({ ...employee, comments: [comment, ...employee.comments] })
    setNewComment('')
    toast.success('Comment added')
  }

  const handleApproveStep = (stepId) => {
    toast.success('Step approved')
  }

  const handleSendReminder = () => {
    toast.success('Reminder sent!')
  }

  if (loading) return <LoadingPage message="Loading employee details..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <button 
        onClick={() => navigate('/mentor/employees')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mentees
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
                    <p className="text-slate-500">{employee.department}</p>
                    <p className="text-sm text-slate-400 mt-1">Joined {formatDate(employee.joiningDate)}</p>
                  </div>
                </div>
                <Badge variant={employee.status === 'at_risk' ? 'warning' : 'success'}>
                  {employee.status === 'on_track' ? 'On Track' : 'At Risk'}
                </Badge>
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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <Mail className="w-4 h-4" />
                {employee.email}
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Phone className="w-4 h-4" />
                Request Call
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Calendar className="w-4 h-4" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleSendReminder}>
                <MessageSquare className="w-4 h-4" />
                Send Reminder
              </Button>
              <Button variant="secondary" className="w-full">
                <CheckCircle2 className="w-4 h-4" />
                Approve Step
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 space-y-4">
                {employee.comments.map(comment => (
                  <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-800">{comment.text}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {comment.author} • {formatRelativeTime(comment.date)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button size="sm" onClick={handleAddComment}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
