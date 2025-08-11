'use client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export function ContactCard({ icon: Icon, title, description, onClick }) {
  return (
    <Card
      className="border border-[#3d4166] bg-[#2d3154] text-center hover:border-[#4b6fd7]/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <div className="w-12 h-12 bg-[#4b6fd7]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6 text-[#4b6fd7]" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
