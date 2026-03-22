import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import { LoadingPage } from '../../components/ui/Loading'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle2,
  Play,
  ChevronRight,
  FileText,
  HelpCircle,
  MessageSquare
} from 'lucide-react'

const moduleContent = {
  1: {
    title: 'Company Culture & Values',
    description: 'Understanding our mission, vision, and core values that drive everything we do.',
    duration: '45 min',
    lessons: [
      {
        id: 1,
        title: 'Our Mission & Vision',
        type: 'video',
        duration: '12 min',
        completed: true,
        content: 'At OnboardX, our mission is to transform how companies welcome and develop their talent...'
      },
      {
        id: 2,
        title: 'Core Values Deep Dive',
        type: 'reading',
        duration: '10 min',
        completed: true,
        content: 'Our core values guide every decision we make and every action we take...'
      },
      {
        id: 3,
        title: 'Leadership Principles',
        type: 'video',
        duration: '15 min',
        completed: true,
        content: 'Our leaders embody these principles and guide teams toward success...'
      },
      {
        id: 4,
        title: 'Company History',
        type: 'reading',
        duration: '5 min',
        completed: true,
        content: 'Founded in 2020, we have grown from a small startup to an industry leader...'
      },
      {
        id: 5,
        title: 'Knowledge Check',
        type: 'quiz',
        completed: true,
        content: null
      }
    ]
  },
  3: {
    title: 'Department Introduction',
    description: 'Meet your team, understand workflows, and get familiar with your role.',
    duration: '60 min',
    lessons: [
      {
        id: 1,
        title: 'Meet the Team',
        type: 'video',
        duration: '15 min',
        completed: true,
        content: 'Get to know your team members and their roles within the department...'
      },
      {
        id: 2,
        title: 'Team Workflows',
        type: 'reading',
        duration: '10 min',
        completed: true,
        content: 'Understanding how our team collaborates and delivers results...'
      },
      {
        id: 3,
        title: 'Role Expectations',
        type: 'video',
        duration: '12 min',
        completed: false,
        content: 'Learn what is expected of you in your new role...'
      },
      {
        id: 4,
        title: 'Tools We Use',
        type: 'reading',
        duration: '8 min',
        completed: false,
        content: 'An overview of the tools and systems you will be using daily...'
      },
      {
        id: 5,
        title: 'Communication Channels',
        type: 'video',
        duration: '10 min',
        completed: false,
        content: 'How we communicate effectively within the team...'
      },
      {
        id: 6,
        title: 'Team Quiz',
        type: 'quiz',
        completed: false,
        content: null
      }
    ]
  },
  4: {
    title: 'Tools & Systems Training',
    description: 'Hands-on training with our core tools including Slack, Jira, and internal systems.',
    duration: '45 min',
    lessons: [
      { id: 1, title: 'Slack Basics', type: 'video', duration: '10 min', completed: false },
      { id: 2, title: 'Jira Workflow', type: 'video', duration: '15 min', completed: false },
      { id: 3, title: 'Internal Wiki', type: 'reading', duration: '8 min', completed: false },
      { id: 4, title: 'Tools Assessment', type: 'quiz', completed: false, content: null }
    ]
  },
  5: {
    title: 'Security Awareness',
    description: 'Essential security practices to keep company and customer data safe.',
    duration: '30 min',
    lessons: [
      { id: 1, title: 'Security Fundamentals', type: 'video', duration: '10 min', completed: false },
      { id: 2, title: 'Password Best Practices', type: 'reading', duration: '5 min', completed: false },
      { id: 3, title: 'Phishing Awareness', type: 'video', duration: '8 min', completed: false },
      { id: 4, title: 'Security Quiz', type: 'quiz', completed: false, content: null }
    ]
  },
  6: {
    title: 'Communication Standards',
    description: 'Best practices for professional communication across the organization.',
    duration: '25 min',
    lessons: [
      { id: 1, title: 'Email Etiquette', type: 'video', duration: '8 min', completed: false },
      { id: 2, title: 'Meeting Best Practices', type: 'reading', duration: '7 min', completed: false },
      { id: 3, title: 'Documentation Standards', type: 'video', duration: '10 min', completed: false }
    ]
  }
}

export default function EmployeeTrainingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [module, setModule] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      const moduleData = moduleContent[id] || moduleContent[1]
      setModule(moduleData)
      setCurrentLesson(moduleData.lessons[0])
      setLoading(false)
    }, 500)
  }, [id])

  const handleCompleteLesson = () => {
    if (!currentLesson || currentLesson.completed) return
    
    const updatedLessons = module.lessons.map(lesson => 
      lesson.id === currentLesson.id ? { ...lesson, completed: true } : lesson
    )
    setModule({ ...module, lessons: updatedLessons })
    
    const currentIndex = module.lessons.findIndex(l => l.id === currentLesson.id)
    if (currentIndex < module.lessons.length - 1) {
      setCurrentLesson(module.lessons[currentIndex + 1])
    }
    
    toast.success('Lesson completed!')
  }

  const handleStartQuiz = () => {
    navigate(`/employee/quiz/${id}`)
  }

  const completedCount = module?.lessons.filter(l => l.completed).length || 0
  const totalCount = module?.lessons.length || 0
  const progress = Math.round((completedCount / totalCount) * 100)

  if (loading) return <LoadingPage message="Loading module..." />

  return (
    <div className="animate-fade-in">
      <button 
        onClick={() => navigate('/employee/training')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Training
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge variant="primary" className="mb-2">Training Module</Badge>
                  <h1 className="text-2xl font-bold text-slate-800">{module.title}</h1>
                  <p className="text-slate-500 mt-2">{module.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </div>
              </div>

              <ProgressBar value={progress} />

              {currentLesson && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentLesson.type === 'video' ? 'bg-primary-100' :
                      currentLesson.type === 'quiz' ? 'bg-accent-100' :
                      'bg-amber-100'
                    }`}>
                      {currentLesson.type === 'video' ? (
                        <Play className={`w-5 h-5 ${currentLesson.completed ? 'text-emerald-600' : 'text-primary-600'}`} />
                      ) : currentLesson.type === 'quiz' ? (
                        <HelpCircle className={`w-5 h-5 ${currentLesson.completed ? 'text-emerald-600' : 'text-accent-600'}`} />
                      ) : (
                        <FileText className={`w-5 h-5 ${currentLesson.completed ? 'text-emerald-600' : 'text-amber-600'}`} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Currently viewing</p>
                      <h2 className="font-semibold text-slate-800">{currentLesson.title}</h2>
                    </div>
                  </div>

                  {currentLesson.content && (
                    <div className="bg-slate-50 rounded-xl p-6 mb-6">
                      {currentLesson.type === 'video' && (
                        <div className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                          <div className="text-center">
                            <Play className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-500">Video Player</p>
                          </div>
                        </div>
                      )}
                      <p className="text-slate-700 leading-relaxed">{currentLesson.content}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {currentLesson.type === 'quiz' ? (
                      <Button className="flex-1" onClick={handleStartQuiz}>
                        Start Quiz
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1" 
                        onClick={handleCompleteLesson}
                        disabled={currentLesson.completed}
                      >
                        {currentLesson.completed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Mark as Complete
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {module.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors ${
                      currentLesson?.id === lesson.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      lesson.completed 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : currentLesson?.id === lesson.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        lesson.completed ? 'text-slate-500' : 'text-slate-800'
                      }`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {lesson.type === 'quiz' ? 'Quiz' : lesson.duration}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Need Help?</h3>
              <p className="text-sm text-slate-500 mb-4">
                Have questions about this module? Reach out to your mentor.
              </p>
              <Button variant="secondary" className="w-full">
                <MessageSquare className="w-4 h-4" />
                Contact Mentor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
