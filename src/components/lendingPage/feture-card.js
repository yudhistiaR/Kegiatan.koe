import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export function FeatureCard({
  icon: Icon,
  title,
  description,
  centered = false
}) {
  return (
    <Card
      className={`border-2 border-[#3d4166] hover:border-[#4b6fd7]/50 transition-colors bg-[#2d3154] ${centered ? 'text-center' : ''}`}
    >
      <CardHeader>
        <div
          className={`w-16 h-16 bg-[#4b6fd7]/10 rounded-full flex items-center justify-center mb-4 ${centered ? 'mx-auto' : ''}`}
        >
          <Icon className="w-8 h-8 text-[#4b6fd7]" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
