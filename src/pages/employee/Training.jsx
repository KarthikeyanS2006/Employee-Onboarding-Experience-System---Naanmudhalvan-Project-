import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { calculateProgress } from '../../lib/utils'
import {
  Play,
  Clock,
  CheckCircle2,
  BookOpen,
  FileText,
  HelpCircle,
  ChevronRight,
  BarChart
} from 'lucide-react'

const sampleModules = [
  {
    id: 1,
    title: 'Company Culture & Values',
    description: 'Understanding our mission, vision, and core values that drive everything we do.',
    type: 'training',
    duration: '45 min',
    lessons: 5,
    status: 'completed',
    progress: 100,
  },
  {
    id: 2,
    title: 'HR Policies & Benefits',
    description: 'Complete guide to company policies, leave policies, and employee benefits.',
    type: 'document',
    duration: '30 min',
    lessons: 3,
    status: 'completed',
    progress: 100,
  },
  {
    id: 3,
    title: 'Department Introduction',
    description: 'Meet your team, understand workflows, and get familiar with your role.',
    type: 'training',
    duration: '60 min',
    lessons: 8,
    status: 'in_progress',
    progress: 40,
  },
  {
    id: 4,
    title: 'Tools & Systems Training',
    description: 'Hands-on training with our core tools including Slack, Jira, and internal systems.',
    type: 'quiz',
    duration: '45 min',
    lessons: 10,
    status: 'pending',
    progress: 0,
  },
  {
    id: 5,
    title: 'Security Awareness',
    description: 'Essential security practices to keep company and customer data safe.',
    type: 'quiz',
    duration: '30 min',
    lessons: 6,
    status: 'pending',
    progress: 0,
  },
  {
    id: 6,
    title: 'Communication Standards',
    description: 'Best practices for professional communication across the organization.',
    type: 'training',
    duration: '25 min',
    lessons: 4,
    status: 'pending',
    progress: 0,
  },
]

export default function EmployeeTraining() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setTimeout(() => {
      setModules(sampleModules)
      setLoading(false)
    }, 500)
  }, [])

  const filteredModules = filter === 'all' 
    ? modules 
    : modules.filter(m => m.status === filter)

  const overallProgress = calculateProgress(
    modules.filter(m => m.status === 'completed').length,
    modules.length
  )

  if (loading) return <LoadingPage message="Loading training modules..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Training Modules</h2>
          <p className="text-slate-500 mt-1">
            Complete all modules to finish your onboarding journey
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          {['all', 'in_progress', 'completed', 'pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === f 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Overall Progress</p>
                <p className="text-4xl font-bold mt-2">{overallProgress}%</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completed</p>
                <p className="text-2xl font-bold text-slate-800">
                  {modules.filter(m => m.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Remaining</p>
                <p className="text-2xl font-bold text-slate-800">
                  {modules.filter(m => m.status !== 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => (
          <Card 
            key={module.id} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer group"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => navigate(`/employee/training/${module.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  module.status === 'completed' 
                    ? 'bg-emerald-100' 
                    : module.status === 'in_progress'
                    ? 'bg-primary-100'
                    : 'bg-slate-100'
                }`}>
                  {module.status === 'completed' ? (
                    <CheckCircle2 className={`w-6 h-6 ${module.status === 'completed' ? 'text-emerald-600' : 'text-primary-600'}`} />
                  ) : module.type === 'quiz' ? (
                    <HelpCircle className="w-6 h-6 text-accent-600" />
                  ) : module.type === 'document' ? (
                    <FileText className="w-6 h-6 text-amber-600" />
                  ) : (
                    <Play className="w-6 h-6 text-primary-600" />
                  )}
                </div>
                <Badge variant={
                  module.type === 'quiz' ? 'accent' :
                  module.type === 'document' ? 'warning' :
                  'primary'
                }>
                  {module.type}
                </Badge>
              </div>

              <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
                {module.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                {module.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {module.lessons} lessons
                </span>
              </div>

              {module.status !== 'pending' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-slate-700">{module.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        module.status === 'completed' 
                          ? 'bg-emerald-500' 
                          : 'bg-primary-500'
                      }`}
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {module.status === 'pending' && (
                <Button variant="secondary" className="w-full" size="sm">
                  Start Module
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}

              {module.status === 'in_progress' && (
                <Button className="w-full" size="sm">
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
