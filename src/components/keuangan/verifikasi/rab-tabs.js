'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const tabItems = [
  { value: 'all', label: 'Semua' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' }
]

export function BudgetTabs({ selectedTab, onTabChange, children }) {
  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList>
        {tabItems.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="data-[state=active]:text-white"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={selectedTab} className="mt-4">
        {children}
      </TabsContent>
    </Tabs>
  )
}
