'use clinet'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

export function FinanceCard({
  title,
  amount = { value: '', isCounter: false },
  description,
  icon: Icon,
  trend = { value: 0, isPositive: true }
}) {
  return (
    <Card className="border border-[#3d4166] bg-[#2d3154] hover:border-[#4b6fd7]/50 transition-colors w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-[#4b6fd7]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {amount.isCounter ? amount.value : formatCurrency(amount.value)}
        </div>
        {trend && (
          <p
            className={`text-xs ${trend.isPositive ? 'text-green-400' : 'text-red-400'} flex items-center mt-1`}
          >
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
            <span className="text-gray-400 ml-1">dari bulan lalu</span>
          </p>
        )}
        {description && (
          <CardDescription className="mt-1">{description}</CardDescription>
        )}
      </CardContent>
    </Card>
  )
}
