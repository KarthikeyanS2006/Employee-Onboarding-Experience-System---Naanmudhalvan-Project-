import { cn } from '../../lib/utils'

export default function ProgressBar({ 
  value, 
  max = 100, 
  size = 'md',
  showLabel = true,
  className 
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium text-slate-800">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out',
            percentage === 100 && 'from-emerald-500 to-emerald-600'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
