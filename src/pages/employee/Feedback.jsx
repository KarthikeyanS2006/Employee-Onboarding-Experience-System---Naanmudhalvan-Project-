import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import toast from 'react-hot-toast'
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Clock,
  CheckCircle2,
  Send
} from 'lucide-react'

const sampleFeedback = [
  {
    id: 1,
    step: 'Company Orientation',
    rating: 5,
    comment: 'Great introduction to the company culture. The video content was engaging.',
    submittedAt: '2024-01-15',
  },
  {
    id: 2,
    step: 'HR Policies',
    rating: 4,
    comment: 'Very comprehensive. Would have loved more examples.',
    submittedAt: '2024-01-14',
  },
]

const feedbackSteps = [
  { id: 1, title: 'Company Orientation', completed: true },
  { id: 2, title: 'HR Policies & Benefits', completed: true },
  { id: 3, title: 'Department Introduction', completed: false },
  { id: 4, title: 'Tools & Systems', completed: false },
  { id: 5, title: 'Security Training', completed: false },
]

export default function EmployeeFeedback() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [feedbackHistory, setFeedbackHistory] = useState(sampleFeedback)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedStep, setSelectedStep] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newFeedback = {
      id: Date.now(),
      step: selectedStep || 'General Feedback',
      rating,
      comment,
      submittedAt: new Date().toISOString().split('T')[0],
    }

    setFeedbackHistory(prev => [newFeedback, ...prev])
    setRating(0)
    setComment('')
    setSelectedStep('')
    setSubmitting(false)
    toast.success('Feedback submitted successfully!')
  }

  const completedSteps = feedbackHistory.length
  const averageRating = feedbackHistory.length > 0 
    ? (feedbackHistory.reduce((sum, f) => sum + f.rating, 0) / feedbackHistory.length).toFixed(1)
    : 0

  if (loading) return <LoadingPage message="Loading feedback..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-slate-500 mb-2">Feedback Submitted</p>
            <p className="text-4xl font-bold text-slate-800">{completedSteps}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-slate-500 mb-2">Average Rating</p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-4xl font-bold text-slate-800">{averageRating}</p>
              <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500 mb-2">Pending Feedback</p>
            <p className="text-4xl font-bold text-slate-800">
              {feedbackSteps.filter(s => !s.completed).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Which module is this for?
              </label>
              <select
                value={selectedStep}
                onChange={(e) => setSelectedStep(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">General Feedback</option>
                {feedbackSteps.filter(s => !s.completed).map(step => (
                  <option key={step.id} value={step.title}>{step.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                How would you rate this experience?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {rating === 0 && 'Click to rate'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional comments (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Share your thoughts about the onboarding experience..."
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleSubmit}
              loading={submitting}
              disabled={rating === 0}
            >
              <Send className="w-4 h-4" />
              Submit Feedback
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Feedback</CardTitle>
              <Badge variant="primary">{feedbackHistory.length} submissions</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {feedbackHistory.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No feedback submitted yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {feedbackHistory.map(feedback => (
                  <div key={feedback.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-slate-800">{feedback.step}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {feedback.submittedAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {feedback.comment && (
                      <p className="text-sm text-slate-600 mt-2">{feedback.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {feedbackSteps.map((step, index) => {
              const feedback = feedbackHistory.find(f => f.step === step.title)
              return (
                <div key={step.id} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    feedback 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {feedback ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-800">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {feedback ? 'Completed' : 'Pending'}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
