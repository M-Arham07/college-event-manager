'use client'

import { Badge } from '@/components/ui/badge'

interface AccessBadgeProps {
  mode: 'view' | 'edit'
  email?: string | null
}

export function AccessBadge({ mode, email }: AccessBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <Badge variant={mode === 'edit' ? 'default' : 'secondary'} className="gap-1">
        {mode === 'edit' ? (
          <>
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Edit Mode
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            View Only
          </>
        )}
      </Badge>
      {email && (
        <span className="text-xs text-muted-foreground">{email}</span>
      )}
    </div>
  )
}
