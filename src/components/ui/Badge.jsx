import { cn, getInitials, generateGradient } from '../../lib/utils'

const statusColors = {
  pending: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  at_risk: 'bg-red-100 text-red-700',
  active: 'bg-blue-100 text-blue-700',
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    accent: 'bg-accent-100 text-accent-700',
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    at_risk: 'At Risk',
    active: 'Active',
  }

  const variantMap = {
    pending: 'warning',
    in_progress: 'primary',
    completed: 'success',
    at_risk: 'danger',
    active: 'primary',
  }

  return (
    <Badge variant={variantMap[status] || 'default'}>
      {statusLabels[status] || status}
    </Badge>
  )
}

export function Avatar({ name, size = 'md', className }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold',
      generateGradient(name || ''),
      sizes[size],
      className
    )}>
      {getInitials(name)}
    </div>
  )
}
