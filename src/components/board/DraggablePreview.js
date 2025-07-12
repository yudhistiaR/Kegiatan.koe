'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { AvatarStack } from '../ui/AvatarStack'
import { badgeVariants } from '../ui/badge'

function DraggablePreview({ data }) {
  return (
    <Card className={`bg-foreground cursor-grab rounded-none shadow-md`}>
      <CardHeader>
        <CardTitle className="truncate flex justify-between items-center text-sm">
          <h1>{data.name}</h1>
          <p
            className={badgeVariants({
              variant:
                data.priority === 'HIGH'
                  ? 'destructive'
                  : data.priority === 'MEDIUM'
                    ? 'success'
                    : 'warning'
            })}
          >
            {data.priority}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{data.description}</p>
      </CardContent>
      <CardFooter>
        <AvatarStack avatars={data.assignedTo.map(assigned => assigned.user)} />
      </CardFooter>
    </Card>
  )
}

export default DraggablePreview
