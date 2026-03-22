import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const FALLBACK_QUIZ = {
  questions: [
    { question: "What is our company's primary mission?", options: ["Profit maximization", "Customer satisfaction", "Employee growth", "Innovation first"], correct: 1 },
    { question: "How often should you update your task progress in the project management tool?", options: ["Weekly", "Daily", "Monthly", "When asked"], correct: 1 },
    { question: "What should you do if you encounter a security threat?", options: ["Ignore it", "Report to IT immediately", "Fix it yourself", "Tell a colleague"], correct: 1 },
    { question: "Which communication channel should be used for urgent matters?", options: ["Email", "Slack", "Phone/Teams call", "Project board"], correct: 2 },
    { question: "How often are performance reviews conducted?", options: ["Monthly", "Quarterly", "Annually", "Bi-annually"], correct: 3 }
  ]
}

export const useGroq = () => {
  const [loading, setLoading] = useState(false)

  const generateQuiz = async (topic, numQuestions = 5) => {
    setLoading(true)
    try {
      if (!GROQ_API_KEY) {
        toast.error('AI API key not configured. Using sample quiz.')
        return FALLBACK_QUIZ
      }

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'user',
            content: `Generate ${numQuestions} multiple choice quiz questions about "${topic}" for new employee onboarding. Return ONLY valid JSON in this exact format with no additional text:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }
  ]
}
Keep questions simple and appropriate for new employees. Make sure the JSON is valid and parseable.`
          }],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      const content = response.data.choices[0].message.content.trim()
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        if (parsed.questions && parsed.questions.length > 0) {
          return parsed
        }
      }
      toast.error('Could not parse AI response. Using sample quiz.')
      return FALLBACK_QUIZ
    } catch (error) {
      console.error('AI Quiz generation error:', error)
      if (error.response?.status === 401) {
        toast.error('Invalid API key. Using sample quiz.')
      } else if (error.message?.includes('image')) {
        toast.error('Image processing not supported. Using sample quiz.')
      } else {
        toast.error('AI unavailable. Using sample quiz.')
      }
      return FALLBACK_QUIZ
    } finally {
      setLoading(false)
    }
  }

  const getFeedback = async (score, missedTopics, moduleName) => {
    setLoading(true)
    try {
      if (!GROQ_API_KEY) {
        return "Great effort! Review the missed topics and try again. Your mentor is here to help you succeed."
      }

      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'user',
            content: `Employee scored ${score}% on "${moduleName}" quiz. They struggled with: ${missedTopics.join(', ') || 'general concepts'}. 

Give 3 actionable, specific improvement tips. Keep it professional, encouraging, and under 100 words. Format as a numbered list.`
          }],
          max_tokens: 200,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('AI Feedback generation error:', error)
      return "Keep practicing! Review the training materials again and focus on understanding the key concepts. Your mentor is here to help."
    } finally {
      setLoading(false)
    }
  }

  const suggestMentor = async (employeeSkills, department) => {
    setLoading(true)
    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'user',
            content: `A new employee in ${department} department has skill gaps in: ${employeeSkills.join(', ')}.

Based on this, suggest what type of mentor would be best suited. Return JSON:
{
  "suggestedSkills": ["skill1", "skill2"],
  "reasoning": "Why this mentor type is recommended",
  "tips": ["tip1", "tip2"]
}
Keep it concise.`
          }],
          max_tokens: 300,
          temperature: 0.5
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      const content = response.data.choices[0].message.content.trim()
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return null
    } catch (error) {
      console.error('AI Mentor suggestion error:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const summarizeContent = async (content, context = 'company policy') => {
    setLoading(true)
    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'user',
            content: `Summarize this ${context} into 5 key points that new employees must know. Keep each point brief (under 20 words).

Content:
${content.substring(0, 2000)}

Return as a numbered list.`
          }],
          max_tokens: 300,
          temperature: 0.5
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('AI Summarization error:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const generatePerformanceReview = async (employeeData) => {
    setLoading(true)
    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'mixtral-8x7b-32768',
          messages: [{
            role: 'user',
            content: `Generate a performance review summary for an employee based on this onboarding data:

- Quiz Scores: ${employeeData.quizScores?.join(', ') || 'N/A'}
- Average Score: ${employeeData.avgScore || 'N/A'}%
- Feedback Rating: ${employeeData.feedbackRating || 'N/A'}/5
- Completion Time: ${employeeData.completionTime || 'N/A'} days
- Department: ${employeeData.department || 'N/A'}

Provide:
1. Strengths (2-3 points)
2. Areas for Improvement (2-3 points)  
3. Overall Assessment (1-2 sentences)

Keep it professional and constructive.`
          }],
          max_tokens: 400,
          temperature: 0.6
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('AI Performance review error:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { 
    generateQuiz, 
    getFeedback, 
    suggestMentor, 
    summarizeContent,
    generatePerformanceReview,
    loading 
  }
}
