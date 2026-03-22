import { cn } from '../../lib/utils'

export default function Input({ 
  label, 
  error, 
  className, 
  ...props 
}) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 border rounded-lg text-slate-800 placeholder-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'transition-all duration-150',
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
