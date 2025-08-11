import { Badge } from '@/components/ui/badge'

export function TimelineItem({ step, title, badge, description }) {
  return (
    <div className="flex items-start space-x-6">
      <div className="w-12 h-12 bg-[#4b6fd7] rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold">{step}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <Badge
            variant="secondary"
            className="bg-[#4b6fd7]/20 text-[#4b6fd7] border-[#4b6fd7]/30"
          >
            {badge}
          </Badge>
        </div>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  )
}
