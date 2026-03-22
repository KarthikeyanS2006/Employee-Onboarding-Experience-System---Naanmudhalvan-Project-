import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge, Avatar } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import toast from 'react-hot-toast'
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Send,
  Clock,
  CheckCircle2,
  User
} from 'lucide-react'

const sampleMessages = [
  {
    id: 1,
    sender: 'mentor',
    text: 'Hi! Welcome to the team. I am Sarah, your mentor. Feel free to reach out if you have any questions.',
    time: '2 days ago',
  },
  {
    id: 2,
    sender: 'employee',
    text: 'Thank you Sarah! Excited to start. I have a question about the first week schedule.',
    time: '2 days ago',
  },
  {
    id: 3,
    sender: 'mentor',
    text: 'Great question! Your schedule for the first week includes orientation on Monday, team meetings on Tuesday-Thursday, and hands-on training on Friday. I will send you the detailed calendar invite.',
    time: '1 day ago',
  },
]

const scheduledMeetings = [
  {
    id: 1,
    title: '1:1 with Mentor',
    date: '2024-01-22',
    time: '10:00 AM - 11:00 AM',
    type: 'video'
  },
  {
    id: 2,
    title: 'Team Introduction',
    date: '2024-01-20',
    time: '2:00 PM - 3:00 PM',
    type: 'in-person'
  },
]

export default function EmployeeMentor() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState(sampleMessages)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now(),
      sender: 'employee',
      text: newMessage,
      time: 'Just now',
    }

    setMessages([...messages, message])
    setNewMessage('')
    toast.success('Message sent!')
  }

  if (loading) return <LoadingPage message="Loading mentor connection..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Messages</CardTitle>
                <Badge variant="success">Online</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'employee' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${msg.sender === 'employee' ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.sender === 'employee'
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <p className={`text-xs text-slate-400 mt-1 ${
                        msg.sender === 'employee' ? 'text-right' : 'text-left'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                    {msg.sender !== 'employee' && (
                      <Avatar name="Sarah Johnson" size="sm" className="ml-3 order-1" />
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Avatar name="Sarah Johnson" size="xl" className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">Sarah Johnson</h3>
                <p className="text-sm text-slate-500">Senior Software Engineer</p>
                <p className="text-sm text-primary-600 mt-1">Your Mentor</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Badge variant="success">Active</Badge>
                  <Badge variant="default">Responds within 24h</Badge>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  <Mail className="w-4 h-4" />
                  sarah.johnson@company.com
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Phone className="w-4 h-4" />
                  +1 (555) 123-4567
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Calendar className="w-4 h-4" />
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {scheduledMeetings.length === 0 ? (
                <div className="p-6 text-center">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No upcoming meetings</p>
                  <Button variant="secondary" size="sm" className="mt-3">
                    Schedule One
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {scheduledMeetings.map(meeting => (
                    <div key={meeting.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{meeting.title}</p>
                          <p className="text-sm text-slate-500">{meeting.date}</p>
                          <p className="text-sm text-slate-500">{meeting.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentorship Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Complete orientation</p>
                  <p className="text-xs text-slate-500">Completed on Jan 15</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Set up development environment</p>
                  <p className="text-xs text-slate-500">In progress</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-400">Meet all team members</p>
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
