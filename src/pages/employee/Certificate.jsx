import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { LoadingPage } from '../../components/ui/Loading'
import { formatDate } from '../../lib/utils'
import toast from 'react-hot-toast'
import { jsPDF } from 'jspdf'
import { Award, Download, CheckCircle2, Linkedin, Mail } from 'lucide-react'

export default function EmployeeCertificate() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    const certId = `ONBX-2024-${Date.now().toString().slice(-6)}`
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(28)
    doc.text('Certificate of Completion', 105, 40, { align: 'center' })
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text('This is to certify that', 105, 65, { align: 'center' })
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.text(profile?.name || 'Employee', 105, 80, { align: 'center' })
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text('has successfully completed the Employee Onboarding Program', 105, 95, { align: 'center' })
    doc.text(`in the ${profile?.department || 'General'} Department`, 105, 105, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text(`Completion Date: ${formatDate(new Date())}`, 105, 130, { align: 'center' })
    doc.text(`Certificate ID: ${certId}`, 105, 140, { align: 'center' })
    doc.text('Issued by: OnboardX HR Team', 105, 150, { align: 'center' })
    
    doc.setDrawColor(0, 102, 204)
    doc.line(50, 55, 160, 55)
    doc.line(50, 115, 160, 115)
    
    doc.save(`OnboardX-Certificate-${certId}.pdf`)
    toast.success('Certificate downloaded!')
  }

  const handleShare = (platform) => {
    const text = `I just completed my onboarding at OnboardX! 🎉`
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=My Onboarding Certificate&body=${encodeURIComponent(text)}`
    }
    toast.success(`Share link ready for ${platform}!`)
  }

  if (loading) return <LoadingPage message="Generating certificate..." />

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h1>
        <p className="text-gray-500">You have completed your onboarding journey!</p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center border-2 border-gray-200 rounded-xl p-8">
            <p className="text-blue-600 font-medium tracking-widest uppercase text-sm mb-4">Certificate of Completion</p>
            
            <p className="text-gray-500 mb-2">This is to certify that</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{profile?.name || 'Employee'}</h2>
            <p className="text-gray-500 mb-2">has successfully completed the</p>
            <h3 className="text-2xl font-semibold text-blue-600 mb-6">Employee Onboarding Program</h3>
            
            <div className="flex items-center justify-center gap-8 py-4 border-y border-gray-200 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold text-gray-900">{profile?.department || 'General'}</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-sm text-gray-500">Completion Date</p>
                <p className="font-semibold text-gray-900">{formatDate(new Date())}</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-semibold text-gray-900">2 Weeks</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="text-left">
                <p className="text-gray-400">Certificate ID</p>
                <p className="font-mono text-gray-600">ONBX-2024-{Date.now().toString().slice(-6)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Issued by</p>
                <p className="font-semibold text-gray-900">OnboardX HR</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Download Certificate</h3>
              <p className="text-sm text-gray-500">Get your certificate in PDF format</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleShare('linkedin')}>
                <Linkedin className="w-4 h-4" /> LinkedIn
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleShare('email')}>
                <Mail className="w-4 h-4" /> Email
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="w-4 h-4" /> Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-5 text-center">
          <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900">Verified</h4>
          <p className="text-sm text-gray-500">Certificate is authentic</p>
        </CardContent></Card>
        <Card><CardContent className="p-5 text-center">
          <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900">Shareable</h4>
          <p className="text-sm text-gray-500">Add to LinkedIn/resume</p>
        </CardContent></Card>
        <Card><CardContent className="p-5 text-center">
          <CheckCircle2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-900">Career Ready</h4>
          <p className="text-sm text-gray-500">For future reviews</p>
        </CardContent></Card>
      </div>
    </div>
  )
}
