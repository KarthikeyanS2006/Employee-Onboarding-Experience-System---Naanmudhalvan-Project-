import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import Login from './pages/Login'
import EmployeeDashboard from './pages/employee/Dashboard'
import EmployeeTraining from './pages/employee/Training'
import EmployeeTrainingDetail from './pages/employee/TrainingDetail'
import EmployeeQuiz from './pages/employee/Quiz'
import EmployeeAIGuiz from './pages/employee/AIGuiz'
import EmployeeDocuments from './pages/employee/Documents'
import EmployeeFeedback from './pages/employee/Feedback'
import EmployeeMentor from './pages/employee/Mentor'
import EmployeeCertificate from './pages/employee/Certificate'

import MentorDashboard from './pages/mentor/Dashboard'
import MentorEmployees from './pages/mentor/Employees'
import MentorEmployeeDetail from './pages/mentor/EmployeeDetail'

import HRDashboard from './pages/hr/Dashboard'
import HREmployees from './pages/hr/Employees'
import HREmployeeDetail from './pages/hr/EmployeeDetail'
import HRContent from './pages/hr/Content'

import Layout from './components/layout/Layout'

function ProtectedRoute({ children, allowedRoles }) {
  const { profile, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    const redirectPath = profile?.role === 'hr' ? '/hr/dashboard' 
      : profile?.role === 'mentor' ? '/mentor/dashboard' 
      : '/employee/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return children
}

function AppRoutes() {
  const { profile, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Loading OnboardX...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? (
          <Navigate to={profile?.role === 'hr' ? '/hr/dashboard' 
            : profile?.role === 'mentor' ? '/mentor/dashboard' 
            : '/employee/dashboard'} replace />
        ) : <Login />
      } />
      
      <Route path="/employee" element={
        <ProtectedRoute allowedRoles={['employee']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="training" element={<EmployeeTraining />} />
        <Route path="training/:id" element={<EmployeeTrainingDetail />} />
        <Route path="quiz/:id" element={<EmployeeQuiz />} />
        <Route path="quiz/ai" element={<EmployeeAIGuiz />} />
        <Route path="documents" element={<EmployeeDocuments />} />
        <Route path="feedback" element={<EmployeeFeedback />} />
        <Route path="mentor" element={<EmployeeMentor />} />
        <Route path="certificate" element={<EmployeeCertificate />} />
      </Route>

      <Route path="/mentor" element={
        <ProtectedRoute allowedRoles={['mentor']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<MentorDashboard />} />
        <Route path="employees" element={<MentorEmployees />} />
        <Route path="employees/:id" element={<MentorEmployeeDetail />} />
      </Route>

      <Route path="/hr" element={
        <ProtectedRoute allowedRoles={['hr']}>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<HRDashboard />} />
        <Route path="employees" element={<HREmployees />} />
        <Route path="employees/:id" element={<HREmployeeDetail />} />
        <Route path="content" element={<HRContent />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
