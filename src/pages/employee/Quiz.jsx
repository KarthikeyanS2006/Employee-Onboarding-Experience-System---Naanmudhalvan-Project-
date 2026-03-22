import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import { LoadingPage } from '../../components/ui/Loading'
import { useGroq } from '../../hooks/useGroq'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Award,
  Sparkles,
  Lightbulb,
  Loader2
} from 'lucide-react'

const quizQuestions = {
  1: [
    {
      id: 1,
      question: 'What is the primary mission of OnboardX?',
      options: [
        'To maximize shareholder value',
        'To transform how companies welcome and develop talent',
        'To create the cheapest software solution',
        'To dominate the market'
      ],
      correct: 1
    },
    {
      id: 2,
      question: 'Which of the following is one of our core values?',
      options: [
        'Individual achievement over team success',
        'Cutting corners to meet deadlines',
        'Customer obsession',
        'Working in isolation'
      ],
      correct: 2
    },
    {
      id: 3,
      question: 'How should you handle a situation where you disagree with a team decision?',
      options: [
        'Ignore it and do your own thing',
        'Voice concerns privately and respect the final decision',
        'Publicly criticize the decision',
        'Refuse to participate'
      ],
      correct: 1
    },
    {
      id: 4,
      question: 'What year was OnboardX founded?',
      options: ['2015', '2018', '2020', '2022'],
      correct: 2
    },
    {
      id: 5,
      question: 'Who embodies our leadership principles?',
      options: [
        'Only executives',
        'Only managers',
        'All team members',
        'No one in particular'
      ],
      correct: 2
    }
  ],
  3: [
    {
      id: 1,
      question: 'What is the primary communication tool used by the team?',
      options: ['Email', 'Slack', 'Phone calls', 'In-person meetings only'],
      correct: 1
    },
    {
      id: 2,
      question: 'How should you track your work progress?',
      options: [
        'In a personal notebook',
        'In Jira tickets',
        'Via memory',
        'Through verbal updates only'
      ],
      correct: 1
    },
    {
      id: 3,
      question: 'What should you do if you are blocked on a task?',
      options: [
        'Wait until someone notices',
        'Reach out to your mentor or team for help',
        'Move on to something else',
        'Report it in the weekly meeting only'
      ],
      correct: 1
    }
  ],
  4: [
    {
      id: 1,
      question: 'What is the recommended password length?',
      options: ['6 characters', '8 characters', '12+ characters', '4 characters'],
      correct: 2
    },
    {
      id: 2,
      question: 'Which of these is a sign of a phishing email?',
      options: [
        'Email from a known colleague',
        'Urgent request for immediate action with a suspicious link',
        'Regular newsletter',
        'Calendar invitation'
      ],
      correct: 1
    },
    {
      id: 3,
      question: 'Should you share your login credentials with trusted colleagues?',
      options: ['Yes, for efficiency', 'Only with managers', 'Never', 'Only via email'],
      correct: 2
    }
  ]
}

export default function EmployeeQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { getFeedback, loading: aiLoading } = useGroq()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [aiFeedback, setAIFeedback] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const quizData = quizQuestions[id] || quizQuestions[1]
      setQuestions(quizData)
      setLoading(false)
    }, 500)
  }, [id])

  const handleSelectAnswer = (index) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer')
      return
    }

    const isCorrect = selectedAnswer === questions[currentIndex].correct
    const newAnswers = [...answers, { questionId: questions[currentIndex].id, selected: selectedAnswer, correct: isCorrect }]
    setAnswers(newAnswers)
    
    if (isCorrect) {
      setScore(score + 1)
    }
    
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      handleCompleteQuiz()
    }
  }

  const handleRetry = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setQuizCompleted(false)
    setAIFeedback('')
  }

  const handleCompleteQuiz = async () => {
    setQuizCompleted(true)
    
    if (!passed) {
      const missedTopics = answers
        .filter(a => !a.correct)
        .map((a, i) => `Question ${i + 1}`)
      
      const feedback = await getFeedback(percentage, missedTopics, 'Training Quiz')
      if (feedback) {
        setAIFeedback(feedback)
      }
    }
  }

  const currentQuestion = questions[currentIndex]
  const passThreshold = 70
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const passed = percentage >= passThreshold

  if (loading) return <LoadingPage message="Loading quiz..." />

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <Card>
          <CardContent className="p-8 text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
              passed ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <Award className="w-10 h-10 text-emerald-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            
            <p className="text-slate-500 mb-6">
              {passed 
                ? 'You have successfully passed this quiz.' 
                : `You need ${passThreshold}% to pass. Keep studying and try again!`
              }
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <p className="text-4xl font-bold text-slate-800 mb-2">{percentage}%</p>
              <p className="text-slate-500">
                {score} out of {questions.length} correct
              </p>
            </div>

            {!passed && aiFeedback && (
              <div className="bg-accent-50 rounded-xl p-6 mb-6 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-accent-600" />
                  <h3 className="font-semibold text-accent-700">AI Personalized Feedback</h3>
                </div>
                <div className="text-slate-700 whitespace-pre-line text-sm">
                  {aiFeedback}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              {passed ? (
                <Button onClick={() => navigate('/employee/training')}>
                  Back to Training
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => navigate('/employee/training')}>
                    Review Material
                  </Button>
                  <Button onClick={handleRetry}>
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button 
        onClick={() => navigate('/employee/training')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Training
      </button>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Knowledge Check</CardTitle>
            <span className="text-sm text-slate-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <ProgressBar 
            value={((currentIndex + 1) / questions.length) * 100} 
            size="sm" 
            showLabel={false}
            className="mt-4"
          />
        </CardHeader>

        <CardContent className="p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.correct
              
              let bgColor = 'bg-white hover:bg-slate-50'
              let borderColor = 'border-slate-200'
              let textColor = 'text-slate-700'
              
              if (showResult) {
                if (isCorrect) {
                  bgColor = 'bg-emerald-50'
                  borderColor = 'border-emerald-500'
                  textColor = 'text-emerald-700'
                } else if (isSelected && !isCorrect) {
                  bgColor = 'bg-red-50'
                  borderColor = 'border-red-500'
                  textColor = 'text-red-700'
                }
              } else if (isSelected) {
                bgColor = 'bg-primary-50'
                borderColor = 'border-primary-500'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${bgColor} ${borderColor} ${textColor} ${
                    !showResult && 'hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="font-medium">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-end gap-4">
            {!showResult ? (
              <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  'See Results'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
