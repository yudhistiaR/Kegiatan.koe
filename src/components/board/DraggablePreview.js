'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { AvatarStack } from '../ui/AvatarStack'
import { Calendar, Users } from 'lucide-react'

function DraggablePreview({ data }) {
  const getPriorityColor = priority => {
    const colors = {
      HIGH: 'oklch(65% 0.15 0)',
      MEDIUM: 'oklch(65% 0.15 45)',
      LOW: 'oklch(65% 0.15 140)'
    }
    return colors[priority] || 'oklch(56.95% 0.165 266.79)'
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <Card
      className="cursor-grabbing rounded-lg border-2 shadow-2xl transform rotate-3 scale-105"
      style={{
        backgroundColor: 'oklch(27.27% 0.056 276.3)',
        borderColor: 'oklch(56.95% 0.165 266.79)',
        boxShadow: '0 20px 40px oklch(56.95% 0.165 266.79 / 0.4)'
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-semibold text-white line-clamp-2">
            {data.name}
          </h3>
          <span
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: getPriorityColor(data.priority) }}
          >
            {data.priority}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="py-0 space-y-3">
        <p className="text-sm text-white/70 line-clamp-2">{data.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDate(data.start)} - {formatDate(data.end)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/60">
            <Users className="h-3 w-3" />
            <span>{data.assignedTo.length} anggota</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex justify-between items-center w-full">
          <AvatarStack
            avatars={data.assignedTo.map(assigned => assigned.user)}
            maxAvatarsAmount={3}
            spacing="sm"
          />
          <div className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/60">
            {data.divisi.name}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default DraggablePreview
