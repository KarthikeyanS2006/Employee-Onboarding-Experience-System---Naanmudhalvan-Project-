import { cn } from '../../lib/utils'
import { Loader2, FileQuestion, Inbox, AlertCircle } from 'lucide-react'

export function LoadingSpinner({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <Loader2 className={cn('animate-spin text-primary-500', sizes[size], className)} />
  )
}

export function LoadingPage({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-slate-500">{message}</p>
    </div>
  )
}

export function EmptyState({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  action,
  className 
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-800">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-sm">{description}</p>
      )}
      {action && (
        <div className="mt-6">{action}</div>
      )}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-800">Something went wrong</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        {message || 'An error occurred while loading this content.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="mt-6 text-primary-500 hover:text-primary-600 font-medium">
          Try again
        </button>
      )}
    </div>
  )
}
