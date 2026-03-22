import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { useGroq } from '../../hooks/useGroq'
import toast from 'react-hot-toast'
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  GraduationCap,
  HelpCircle,
  FileText,
  MessageSquare,
  Sparkles,
  Save,
  Loader2,
  Wand2
} from 'lucide-react'

const sampleContent = {
  departments: [
    { id: 1, name: 'Engineering', steps: 6, modules: 12 },
    { id: 2, name: 'Marketing', steps: 5, modules: 10 },
    { id: 3, name: 'Sales', steps: 5, modules: 8 },
    { id: 4, name: 'HR', steps: 6, modules: 11 },
    { id: 5, name: 'Finance', steps: 5, modules: 9 },
  ],
  steps: [
    { id: 1, title: 'Company Orientation', department: 'All', type: 'training', order: 1 },
    { id: 2, title: 'HR Policies & Compliance', department: 'All', type: 'document', order: 2 },
    { id: 3, title: 'Department Introduction', department: 'Engineering', type: 'training', order: 1 },
    { id: 4, title: 'Tools & Systems Quiz', department: 'Engineering', type: 'quiz', order: 2 },
    { id: 5, title: 'Marketing Fundamentals', department: 'Marketing', type: 'training', order: 1 },
    { id: 6, title: 'Sales Process Training', department: 'Sales', type: 'training', order: 1 },
  ]
}

const stepTypes = [
  { value: 'training', label: 'Training Module', icon: GraduationCap },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'feedback', label: 'Feedback', icon: MessageSquare },
]

export default function HRContent() {
  const { profile } = useAuth()
  const { generateQuiz, summarizeContent, loading: aiLoading } = useGroq()
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('steps')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    type: 'training',
    description: '',
    content: ''
  })

  const handleOpenModal = (type, item = null) => {
    setModalType(type)
    if (item) {
      setFormData({
        title: item.title || '',
        department: item.department || '',
        type: item.type || 'training',
        description: item.description || '',
        content: item.content || ''
      })
    } else {
      setFormData({ title: '', department: '', type: 'training', description: '', content: '' })
    }
    setShowModal(true)
  }

  const handleSave = () => {
    toast.success(`${modalType === 'department' ? 'Department' : 'Step'} saved successfully!`)
    setShowModal(false)
  }

  const handleDelete = (id) => {
    toast.success('Item deleted successfully')
  }

  const handleGenerateQuiz = async () => {
    const topic = 'Company policies, security awareness, and workplace ethics'
    const quizData = await generateQuiz(topic, 5)
    
    if (quizData && quizData.questions) {
      toast.success(`Generated ${quizData.questions.length} quiz questions!`)
      console.log('Generated Quiz:', quizData)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Content Management</h2>
          <p className="text-slate-500 mt-1">Manage departments, onboarding steps, and training content</p>
        </div>
        <Button onClick={() => handleOpenModal('step')}>
          <Plus className="w-4 h-4" />
          Add New Step
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit">
        {['steps', 'departments', 'templates'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab 
                ? 'bg-white text-slate-800 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {selectedTab === 'steps' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Onboarding Steps</CardTitle>
                <CardDescription>Manage the order and content of onboarding steps</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {sampleContent.steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4 p-4 hover:bg-slate-50">
                  <div className="text-slate-400 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                    {step.order}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{step.title}</p>
                    <p className="text-sm text-slate-500">{step.department}</p>
                  </div>
                  <Badge variant={
                    step.type === 'training' ? 'primary' :
                    step.type === 'quiz' ? 'accent' :
                    step.type === 'document' ? 'warning' : 'default'
                  }>
                    {step.type}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal('step', step)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(step.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleContent.departments.map(dept => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal('department', dept)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(dept.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{dept.name}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{dept.steps} steps</span>
                  <span>{dept.modules} modules</span>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-dashed border-2 border-slate-300 hover:border-primary-400 transition-colors cursor-pointer" onClick={() => handleOpenModal('department')}>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[160px]">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500">Add Department</p>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'templates' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-8 h-8 text-accent-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">AI Quiz Generator</h3>
                  <p className="text-slate-500 mb-4">
                    Generate custom quiz questions instantly using AI. Just enter a topic and get multiple-choice questions ready for your onboarding modules.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleGenerateQuiz}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          Generate Quiz
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Training Summarizer</h4>
                    <p className="text-sm text-slate-500">Auto-summarize long PDFs</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  <Sparkles className="w-4 h-4" />
                  Summarize Content
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Performance Prep</h4>
                    <p className="text-sm text-slate-500">AI review comments</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  <Sparkles className="w-4 h-4" />
                  Generate Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'department' ? 'Add Department' : 'Add Step'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter title"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          {modalType === 'step' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {stepTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                        formData.type === type.value 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <type.icon className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Enter description"
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
