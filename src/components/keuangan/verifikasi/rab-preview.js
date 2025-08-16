'use client'

import { FileText, Clock, CheckCircle, DollarSign } from 'lucide-react'
import { FinanceCard } from '../ui/FinansialCard'

export function BudgetPreview({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <FinanceCard
        title="Total RAB"
        amount={{ value: stats.total, isCounter: true }}
        description="Total submissions"
        icon={FileText}
      />
      <FinanceCard
        title="Pending"
        amount={{ value: stats.pending, isCounter: true }}
        description="Awaiting review"
        icon={Clock}
      />
      <FinanceCard
        title="Disetujui"
        amount={{ value: stats.approved, isCounter: true }}
        description="Total approved RAB"
        icon={CheckCircle}
      />
      <FinanceCard
        title="Total Anggaran"
        amount={{ value: stats.totalBudget }}
        description="Sum of all budgets"
        icon={DollarSign}
      />
    </div>
  )
}
