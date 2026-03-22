import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { useGroq } from '../../hooks/useGroq'
import { calculateProgress } from '../../lib/utils'
import { Play, Clock, CheckCircle2, BookOpen, FileText, HelpCircle, ChevronRight, Sparkles, Loader2, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

const departmentModules = {
  IT: [
    { id: 1, title: 'IT Orientation', description: 'Learn about IT department and policies.', type: 'training', duration: '45 min', lessons: 5, status: 'completed', progress: 100 },
    { id: 2, title: 'Security Training', description: 'Cybersecurity fundamentals.', type: 'training', duration: '30 min', lessons: 4, status: 'completed', progress: 100 },
    { id: 3, title: 'Development Setup', description: 'Set up your development environment.', type: 'document', duration: '60 min', lessons: 3, status: 'in_progress', progress: 40 },
    { id: 4, title: 'Code Review Process', description: 'Learn our code review standards.', type: 'training', duration: '45 min', lessons: 6, status: 'pending', progress: 0 },
    { id: 5, title: 'Git Workflow Quiz', description: 'Test your Git knowledge.', type: 'quiz', duration: '20 min', lessons: 5, status: 'pending', progress: 0 },
    { id: 6, title: 'DevOps Overview', description: 'CI/CD and deployment pipeline.', type: 'training', duration: '50 min', lessons: 7, status: 'pending', progress: 0 },
  ],
  HR: [
    { id: 1, title: 'HR Policies Overview', description: 'Company policies and procedures.', type: 'training', duration: '40 min', lessons: 5, status: 'completed', progress: 100 },
    { id: 2, title: 'Benefits Administration', description: 'Employee benefits management.', type: 'training', duration: '35 min', lessons: 4, status: 'completed', progress: 100 },
    { id: 3, title: 'Recruitment System', description: 'How to use our ATS.', type: 'training', duration: '45 min', lessons: 6, status: 'in_progress', progress: 60 },
    { id: 4, title: 'Payroll Training', description: 'Payroll processing basics.', type: 'training', duration: '40 min', lessons: 5, status: 'pending', progress: 0 },
    { id: 5, title: 'HR Quiz', description: 'Test your HR knowledge.', type: 'quiz', duration: '25 min', lessons: 8, status: 'pending', progress: 0 },
    { id: 6, title: 'Onboarding Best Practices', description: 'How to onboard new hires.', type: 'training', duration: '35 min', lessons: 4, status: 'pending', progress: 0 },
  ],
  Sales: [
    { id: 1, title: 'Sales Orientation', description: 'Learn about our sales process.', type: 'training', duration: '50 min', lessons: 6, status: 'completed', progress: 100 },
    { id: 2, title: 'Product Knowledge', description: 'Understanding our products.', type: 'training', duration: '45 min', lessons: 5, status: 'completed', progress: 100 },
    { id: 3, title: 'CRM Training', description: 'Using our CRM system.', type: 'training', duration: '60 min', lessons: 8, status: 'in_progress', progress: 30 },
    { id: 4, title: 'Sales Playbook', description: 'Our sales methodology.', type: 'document', duration: '40 min', lessons: 4, status: 'pending', progress: 0 },
    { id: 5, title: 'Sales Quiz', description: 'Test your sales knowledge.', type: 'quiz', duration: '20 min', lessons: 10, status: 'pending', progress: 0 },
    { id: 6, title: 'Demo Training', description: 'Product demonstration skills.', type: 'training', duration: '45 min', lessons: 5, status: 'pending', progress: 0 },
  ],
  Marketing: [
    { id: 1, title: 'Marketing Orientation', description: 'Brand and marketing overview.', type: 'training', duration: '40 min', lessons: 5, status: 'completed', progress: 100 },
    { id: 2, title: 'Brand Guidelines', description: 'Our brand standards.', type: 'document', duration: '30 min', lessons: 3, status: 'completed', progress: 100 },
    { id: 3, title: 'Campaign Tools', description: 'Marketing automation tools.', type: 'training', duration: '50 min', lessons: 6, status: 'in_progress', progress: 45 },
    { id: 4, title: 'Content Strategy', description: 'Creating marketing content.', type: 'training', duration: '45 min', lessons: 5, status: 'pending', progress: 0 },
    { id: 5, title: 'Marketing Quiz', description: 'Test your marketing knowledge.', type: 'quiz', duration: '20 min', lessons: 8, status: 'pending', progress: 0 },
    { id: 6, title: 'Analytics Training', description: 'Measuring campaign success.', type: 'training', duration: '40 min', lessons: 4, status: 'pending', progress: 0 },
  ],
  Finance: [
    { id: 1, title: 'Finance Orientation', description: 'Financial procedures overview.', type: 'training', duration: '45 min', lessons: 5, status: 'completed', progress: 100 },
    { id: 2, title: 'Accounting Software', description: 'Using our accounting tools.', type: 'training', duration: '50 min', lessons: 6, status: 'completed', progress: 100 },
    { id: 3, title: 'Compliance Training', description: 'Financial compliance requirements.', type: 'training', duration: '40 min', lessons: 5, status: 'in_progress', progress: 50 },
    { id: 4, title: 'Expense Policy', description: 'Company expense guidelines.', type: 'document', duration: '25 min', lessons: 3, status: 'pending', progress: 0 },
    { id: 5, title: 'Finance Quiz', description: 'Test your finance knowledge.', type: 'quiz', duration: '25 min', lessons: 10, status: 'pending', progress: 0 },
    { id: 6, title: 'Reporting Tools', description: 'Financial reporting systems.', type: 'training', duration: '45 min', lessons: 5, status: 'pending', progress: 0 },
  ],
  Default: [
    { id: 1, title: 'Company Culture', description: 'Learn about our mission and values.', type: 'training', duration: '45 min', lessons: 5, status: 'completed', progress: 100 },
    { id: 2, title: 'HR Policies', description: 'Company policies and benefits.', type: 'document', duration: '30 min', lessons: 3, status: 'completed', progress: 100 },
    { id: 3, title: 'Department Intro', description: 'Meet your team and role.', type: 'training', duration: '60 min', lessons: 8, status: 'in_progress', progress: 40 },
    { id: 4, title: 'Tools Training', description: 'Learn core tools and systems.', type: 'quiz', duration: '45 min', lessons: 10, status: 'pending', progress: 0 },
    { id: 5, title: 'Security Basics', description: 'Security best practices.', type: 'quiz', duration: '30 min', lessons: 6, status: 'pending', progress: 0 },
    { id: 6, title: 'Communication', description: 'Professional communication.', type: 'training', duration: '25 min', lessons: 4, status: 'pending', progress: 0 },
  ]
}

const typeIcons = { training: Play, quiz: HelpCircle, document: FileText, feedback: MessageSquare }
const typeColors = { training: 'bg-blue-100 text-blue-600', quiz: 'bg-purple-100 text-purple-600', document: 'bg-amber-100 text-amber-600', feedback: 'bg-green-100 text-green-600' }

export default function EmployeeTraining() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const { generateQuiz, loading: aiLoading } = useGroq()
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState([])
  const [filter, setFilter] = useState('all')
  const [showAIGenerate, setShowAIGenerate] = useState(false)

  useEffect(() => {
    const dept = profile?.department || 'Default'
    const deptModules = departmentModules[dept] || departmentModules['Default']
    setTimeout(() => { setModules(deptModules); setLoading(false) }, 500)
  }, [profile?.department])

  const filteredModules = filter === 'all' ? modules : modules.filter(m => m.status === filter)
  const overallProgress = calculateProgress(modules.filter(m => m.status === 'completed').length, modules.length)

  const handleGenerateQuiz = async () => {
    setShowAIGenerate(true)
    const topic = profile?.department ? `${profile.department} training and best practices` : 'company onboarding'
    const quizData = await generateQuiz(topic, 5)
    if (quizData) {
      toast.success('AI Quiz generated successfully!')
      console.log('Generated Quiz:', quizData)
    }
    setShowAIGenerate(false)
  }

  if (loading) return <LoadingPage message="Loading modules..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Training Modules</h2>
          <p className="text-gray-500 mt-1">{profile?.department || 'General'} Department - Complete all modules</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleGenerateQuiz} disabled={aiLoading}>
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            AI Generate Quiz
          </Button>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {['all', 'in_progress', 'completed', 'pending'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showAIGenerate && (
        <Card className="border-blue-300 bg-blue-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-blue-700">AI is generating a custom quiz for your department...</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Overall Progress</p><p className="text-3xl font-bold text-gray-900 mt-1">{overallProgress}%</p><div className="w-full h-2 bg-gray-100 rounded-full mt-3"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${overallProgress}%` }} /></div></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Completed</p><p className="text-3xl font-bold text-green-600 mt-1">{modules.filter(m => m.status === 'completed').length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-gray-500">In Progress</p><p className="text-3xl font-bold text-blue-600 mt-1">{modules.filter(m => m.status === 'in_progress').length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-gray-500">Remaining</p><p className="text-3xl font-bold text-gray-400 mt-1">{modules.filter(m => m.status !== 'completed').length}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((module, index) => {
          const Icon = typeIcons[module.type] || BookOpen
          return (
            <Card key={module.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/employee/training/${module.id}`)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[module.type]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={module.type === 'quiz' ? 'primary' : 'default'}>{module.type}</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{module.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{module.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{module.lessons} lessons</span>
                </div>
                {module.status !== 'pending' && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Progress</span><span className="font-medium text-gray-700">{module.progress}%</span></div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full"><div className={`h-full rounded-full ${module.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${module.progress}%` }} /></div>
                  </div>
                )}
                <Button variant={module.status === 'in_progress' ? 'primary' : 'secondary'} size="sm" className="w-full mt-2">
                  {module.status === 'completed' ? 'Review' : module.status === 'in_progress' ? 'Continue' : 'Start'} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
