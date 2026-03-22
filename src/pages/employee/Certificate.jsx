import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { formatDate } from '../../lib/utils'
import toast from 'react-hot-toast'
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  DownloadCloud,
  Linkedin,
  Twitter,
  Mail,
  Sparkles
} from 'lucide-react'

export default function EmployeeCertificate() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setCompleted(true)
      setLoading(false)
    }, 1000)
  }, [])

  const handleDownload = () => {
    toast.success('Certificate downloaded!')
  }

  const handleShare = (platform) => {
    toast.success(`Share link copied for ${platform}!`)
  }

  if (loading) return <LoadingPage message="Generating certificate..." />

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
          <Award className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {completed ? 'Congratulations!' : 'Certificate Coming Soon'}
        </h1>
        <p className="text-slate-500">
          {completed 
            ? 'You have successfully completed your onboarding journey. Download your certificate below!'
            : 'Complete all onboarding steps to receive your certificate.'
          }
        </p>
      </div>

      {completed ? (
        <>
          <Card className="max-w-3xl mx-auto border-2 border-accent-200 bg-gradient-to-br from-white to-accent-50/30">
            <CardContent className="p-8">
              <div className="text-center border-2 border-accent-200 rounded-xl p-8 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-500 via-purple-500 to-accent-500" />
                
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-accent-600 font-medium tracking-widest uppercase text-sm">Certificate of Completion</p>
                </div>

                <div className="mb-8">
                  <p className="text-slate-500 mb-2">This is to certify that</p>
                  <h2 className="text-4xl font-bold text-slate-800 font-mono">
                    {profile?.name || 'Employee Name'}
                  </h2>
                  <p className="text-slate-500 mt-2">has successfully completed the</p>
                  <h3 className="text-2xl font-semibold text-accent-600 mt-2">
                    Employee Onboarding Program
                  </h3>
                </div>

                <div className="flex items-center justify-center gap-8 py-6 border-y border-slate-200 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Department</p>
                    <p className="font-semibold text-slate-800">{profile?.department || 'General'}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Completion Date</p>
                    <p className="font-semibold text-slate-800">{formatDate(new Date())}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Duration</p>
                    <p className="font-semibold text-slate-800">2 Weeks</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs text-slate-400">Certificate ID</p>
                    <p className="font-mono text-sm text-slate-600">ONBX-2024-{Date.now().toString().slice(-6)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Issued by</p>
                    <p className="font-semibold text-slate-800">OnboardX HR</p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-accent-500 via-purple-500 to-accent-500" />
              </div>
            </CardContent>
          </Card>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">Download Certificate</h3>
                    <p className="text-sm text-slate-500">Get your certificate in PDF format</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={() => handleShare('email')}>
                      <Mail className="w-4 h-4" />
                      Email
                    </Button>
                    <Button variant="secondary" onClick={() => handleShare('linkedin')}>
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </Button>
                    <Button variant="secondary" onClick={() => handleShare('twitter')}>
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </Button>
                    <Button onClick={handleDownload}>
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Fully Verified</h4>
                <p className="text-sm text-slate-500">This certificate is verified and can be authenticated</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Share Anywhere</h4>
                <p className="text-sm text-slate-500">Share your achievement on professional networks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-accent-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Career Ready</h4>
                <p className="text-sm text-slate-500">Add to your resume and portfolio</p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Keep Going!</h3>
            <p className="text-slate-500 mb-6">
              You need to complete all onboarding steps to unlock your certificate.
            </p>
            <Button onClick={() => navigate('/employee/dashboard')}>
              View Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
