import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { calculateProgress } from '../../lib/utils'
import { Play, Clock, CheckCircle2, BookOpen, FileText, HelpCircle, ChevronRight } from 'lucide-react'

const sampleModules = [
  { id: 1, title: 'Company Culture', description: 'Learn about our mission and values.', type: 'training', duration: '45 min', lessons: 5, status: 'completed', progress: 100 },
  { id: 2, title: 'HR Policies', description: 'Company policies and benefits.', type: 'document', duration: '30 min', lessons: 3, status: 'completed', progress: 100 },
  { id: 3, title: 'Department Intro', description: 'Meet your team and role.', type: 'training', duration: '60 min', lessons: 8, status: 'in_progress', progress: 40 },
  { id: 4, title: 'Tools Training', description: 'Learn core tools and systems.', type: 'quiz', duration: '45 min', lessons: 10, status: 'pending', progress: 0 },
  { id: 5, title: 'Security Training', description: 'Security best practices.', type: 'quiz', duration: '30 min', lessons: 6, status: 'pending', progress: 0 },
  { id: 6, title: 'Communication', description: 'Professional communication.', type: 'training', duration: '25 min', lessons: 4, status: 'pending', progress: 0 },
]

const typeIcons = { training: Play, quiz: HelpCircle, document: FileText, feedback: MessageSquare }
const typeColors = { training: 'bg-blue-100 text-blue-600', quiz: 'bg-purple-100 text-purple-600', document: 'bg-amber-100 text-amber-600', feedback: 'bg-green-100 text-green-600' }

export default function EmployeeTraining() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setTimeout(() => { setModules(sampleModules); setLoading(false) }, 500)
  }, [])

  const filteredModules = filter === 'all' ? modules : modules.filter(m => m.status === filter)
  const overallProgress = calculateProgress(modules.filter(m => m.status === 'completed').length, modules.length)

  if (loading) return <LoadingPage message="Loading modules..." />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Training Modules</h2>
          <p className="text-gray-500 mt-1">Complete all modules to finish onboarding</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {['all', 'in_progress', 'completed', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Overall Progress</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{overallProgress}%</p>
            <div className="w-full h-2 bg-gray-100 rounded-full mt-3">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${overallProgress}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{modules.filter(m => m.status === 'completed').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{modules.filter(m => m.status === 'in_progress').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-3xl font-bold text-gray-400 mt-1">{modules.filter(m => m.status !== 'completed').length}</p>
          </CardContent>
        </Card>
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
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-700">{module.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className={`h-full rounded-full ${module.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${module.progress}%` }} />
                    </div>
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
