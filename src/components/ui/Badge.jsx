import { cn, getInitials } from '../../lib/utils'

const variants = {
  default: 'bg-gray-100 text-gray-600',
  primary: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
}

export function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const labels = { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', at_risk: 'At Risk', active: 'Active' }
  const variantMap = { pending: 'warning', in_progress: 'primary', completed: 'success', at_risk: 'danger', active: 'primary' }
  return <Badge variant={variantMap[status] || 'default'}>{labels[status] || status}</Badge>
}

export function Avatar({ name, size = 'md', className }) {
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600']
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-14 h-14 text-lg' }
  return (
    <div className={cn('rounded-full flex items-center justify-center text-white font-semibold', colors[colorIndex], sizes[size], className)}>
      {getInitials(name)}
    </div>
  )
}
