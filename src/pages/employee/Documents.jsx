import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/Loading'
import toast from 'react-hot-toast'
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  File,
  Image,
  X
} from 'lucide-react'

const sampleDocuments = [
  {
    id: 1,
    name: 'Signed NDA.pdf',
    type: 'pdf',
    size: '245 KB',
    uploadedAt: '2024-01-15',
    status: 'verified',
  },
  {
    id: 2,
    name: 'Employment Contract.pdf',
    type: 'pdf',
    size: '512 KB',
    uploadedAt: '2024-01-14',
    status: 'verified',
  },
  {
    id: 3,
    name: 'ID Card Copy.jpg',
    type: 'image',
    size: '1.2 MB',
    uploadedAt: '2024-01-13',
    status: 'pending',
  },
  {
    id: 4,
    name: 'Tax Form W-4.pdf',
    type: 'pdf',
    size: '180 KB',
    uploadedAt: '2024-01-12',
    status: 'verified',
  },
]

const requiredDocuments = [
  { id: 1, name: 'Signed NDA', description: 'Non-disclosure agreement' },
  { id: 2, name: 'Employment Contract', description: 'Signed employment agreement' },
  { id: 3, name: 'ID Card Copy', description: 'Government-issued ID' },
  { id: 4, name: 'Tax Form W-4', description: 'Federal tax withholding' },
  { id: 5, name: 'Direct Deposit Form', description: 'Bank account information' },
  { id: 6, name: 'Emergency Contact', description: 'Emergency contact details' },
]

export default function EmployeeDocuments() {
  const { profile } = useAuth()
  const [documents, setDocuments] = useState(sampleDocuments)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files)
    }
  }

  const handleUpload = async (files) => {
    setUploading(true)
    
    for (const file of Array.from(files)) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newDoc = {
        id: Date.now(),
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        size: `${(file.size / 1024).toFixed(0)} KB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'pending',
      }
      
      setDocuments(prev => [...prev, newDoc])
      toast.success(`${file.name} uploaded successfully`)
    }
    
    setUploading(false)
  }

  const handleDelete = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId))
    toast.success('Document deleted')
  }

  const verifiedCount = documents.filter(d => d.status === 'verified').length
  const totalRequired = requiredDocuments.length

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />
      case 'image':
        return <Image className="w-5 h-5 text-blue-500" />
      default:
        return <File className="w-5 h-5 text-slate-500" />
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 border-0 text-white">
          <CardContent className="p-6">
            <p className="text-blue-100 text-sm">Documents Verified</p>
            <p className="text-4xl font-bold mt-2">{verifiedCount}/{totalRequired}</p>
            <p className="text-blue-100 text-sm mt-2">
              {verifiedCount === totalRequired ? 'All documents verified!' : 'Complete to proceed'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Verified</p>
                <p className="text-2xl font-bold text-slate-800">
                  {documents.filter(d => d.status === 'verified').length}
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
                <p className="text-sm text-slate-500">Pending Review</p>
                <p className="text-2xl font-bold text-slate-800">
                  {documents.filter(d => d.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {requiredDocuments.map(doc => {
              const uploaded = documents.find(d => d.name.toLowerCase().includes(doc.name.toLowerCase()))
              return (
                <div key={doc.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      uploaded ? 'bg-emerald-100' : 'bg-slate-100'
                    }`}>
                      {uploaded ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{doc.name}</p>
                      <p className="text-sm text-slate-500">{doc.description}</p>
                    </div>
                  </div>
                  {uploaded ? (
                    <Badge variant="success">Uploaded</Badge>
                  ) : (
                    <Badge variant="warning">Required</Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          multiple
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-800 mb-2">
            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </p>
          <p className="text-sm text-slate-500">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
          </p>
        </label>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Uploaded Documents</CardTitle>
            <span className="text-sm text-slate-500">{documents.length} files</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {documents.length === 0 ? (
            <EmptyState 
              icon={FileText}
              title="No documents uploaded"
              description="Upload your required documents to complete the onboarding process."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(doc.type)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{doc.name}</p>
                      <p className="text-sm text-slate-500">
                        {doc.size} • Uploaded {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={doc.status === 'verified' ? 'success' : 'warning'}>
                      {doc.status === 'verified' ? 'Verified' : 'Pending'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
