import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useGroq } from '../../hooks/useGroq'
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Trophy, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmployeeAIGuiz() {
  const navigate = useNavigate()
  const { getFeedback } = useGroq()
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const savedQuiz = localStorage.getItem('aiGeneratedQuiz')
    if (savedQuiz) {
      setQuiz(JSON.parse(savedQuiz))
    } else {
      toast.error('No quiz found. Please generate a quiz first.')
      navigate('/employee/training')
    }
  }, [])

  const handleAnswer = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex })
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const handleSubmit = async () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setShowResults(true)

    const missedTopics = quiz.questions
      .filter((q, i) => answers[i] !== q.correct)
      .map(q => q.question)

    const aiFeedback = await getFeedback(finalScore, missedTopics, 'AI Generated Quiz')
    setFeedback(aiFeedback)
  }

  const handleRetake = () => {
    setAnswers({})
    setCurrentQuestion(0)
    setShowResults(false)
    setScore(0)
    setFeedback(null)
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (showResults) {
    const percentage = score
    const passed = percentage >= 60

    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
              <Trophy className={`w-10 h-10 ${passed ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-gray-500 mb-6">You scored {percentage}%</p>
            
            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{quiz.questions.filter((q, i) => answers[i] === q.correct).length}</p>
                <p className="text-sm text-gray-500">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{quiz.questions.filter((q, i) => answers[i] !== q.correct).length}</p>
                <p className="text-sm text-gray-500">Incorrect</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-600">{quiz.questions.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>

            {feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-blue-900 mb-2">AI Feedback</h4>
                <p className="text-blue-700 text-sm whitespace-pre-line">{feedback}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button variant="primary" className="w-full" onClick={handleRetake}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => navigate('/employee/training')}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Training
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          {quiz.questions.map((q, qIndex) => {
            const isCorrect = answers[qIndex] === q.correct
            return (
              <Card key={qIndex} className={isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                      <div className="space-y-1">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className={`text-sm ${oIndex === q.correct ? 'text-green-700 font-medium' : oIndex === answers[qIndex] ? 'text-red-700' : 'text-gray-600'}`}>
                            {opt} {oIndex === q.correct && <span className="text-green-600">(Correct)</span>}
                            {oIndex === answers[qIndex] && oIndex !== q.correct && <span className="text-red-600">(Your answer)</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate('/employee/training')} className="flex items-center text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Training
        </button>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">AI Generated Quiz</h2>
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  answers[currentQuestion] === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-sm font-medium ${
                  answers[currentQuestion] === index 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button 
          variant="secondary" 
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        
        {currentQuestion === quiz.questions.length - 1 ? (
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== quiz.questions.length}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
              currentQuestion === index 
                ? 'bg-blue-600 text-white' 
                : answers[index] !== undefined 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
