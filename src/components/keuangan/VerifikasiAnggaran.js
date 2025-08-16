'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { LoadingState, ErrorState } from '@/components/LoadState/LoadStatus'
import { BudgetPreview } from './verifikasi/rab-preview'
import { BudgetTabs } from './verifikasi/rab-tabs'
import { BudgetTable } from './verifikasi/rab-table'
import { BudgetDetail } from './verifikasi/rab-detail'

const statusUpdateSchema = z.object({
  status: z.enum(['REJECTED', 'PENDING', 'APPROVED']),
  notes: z.string().optional()
})

export default function VerifikasiAnggaran() {
  const { orgId } = useAuth()
  const queryClient = useQueryClient()
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedRab, setSelectedRab] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false)

  const statusForm = useForm({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: { status: 'PENDING', notes: '' }
  })

  const {
    data: rabData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['rab', orgId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/proker/rab`)
      if (!response.ok) throw new Error('Failed to fetch RAB data')
      return response.json()
    },
    enabled: !!orgId
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ rabId, status, notes }) => {
      const response = await fetch(`/api/v1/proker/rab`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rabId, status, notes })
      })
      if (!response.ok) throw new Error('Failed to update status')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rab'] })
      toast.success('Status successfully updated')
      setIsStatusUpdateOpen(false)
      statusForm.reset()
    },
    onError: error => {
      toast.error(`Failed to update status: ${error.message}`)
    }
  })

  const filteredData = useMemo(() => {
    if (!rabData) return []
    const upperCaseTab = selectedTab.toUpperCase()
    if (upperCaseTab === 'ALL') return rabData
    return rabData.filter(item => item.status === upperCaseTab)
  }, [rabData, selectedTab])

  const stats = useMemo(() => {
    if (!rabData)
      return { total: 0, pending: 0, approved: 0, rejected: 0, totalBudget: 0 }

    const approvedRabData = rabData.filter(item => item.status === 'APPROVED')

    const totalBudget = approvedRabData.reduce((sum, item) => {
      const budget = item.listRab.reduce(
        (acc, curr) => acc + Number(curr.harga) * Number(curr.jumlah),
        0
      )
      return sum + budget
    }, 0)

    return {
      total: rabData.length,
      pending: rabData.filter(item => item.status === 'PENDING').length,
      approved: rabData.filter(item => item.status === 'APPROVED').length,
      rejected: rabData.filter(item => item.status === 'REJECTED').length,
      totalBudget
    }
  }, [rabData])

  const handleViewDetail = rab => {
    setSelectedRab(rab)
    setIsDetailOpen(true)
  }

  const handleUpdateStatus = rab => {
    setSelectedRab(rab)
    statusForm.setValue('status', rab.status)
    setIsStatusUpdateOpen(true)
  }

  const onSubmitStatusUpdate = data => {
    updateStatusMutation.mutate({
      rabId: selectedRab.id,
      status: data.status,
      notes: data.notes
    })
  }

  if (isLoading) return <LoadingState />
  if (isError) return <ErrorState error={error} />

  return (
    <div className="min-h-screen mt-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Verifikasi Anggaran
          </h1>
          <p className="text-gray-400">
            Kelola dan verifikasi RAB dari berbagai program kerja
          </p>
        </div>

        <BudgetPreview stats={stats} />

        <Card className="h-full border-opacity-30 bg-transparent">
          <CardHeader>
            <CardTitle>Daftar RAB</CardTitle>
            <CardDescription>
              Kelola verifikasi RAB dari berbagai program kerja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetTabs selectedTab={selectedTab} onTabChange={setSelectedTab}>
              <BudgetTable
                data={filteredData}
                onViewDetail={handleViewDetail}
                onUpdateStatus={handleUpdateStatus}
              />
            </BudgetTabs>
          </CardContent>
        </Card>

        <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
          <DialogContent
            style={{
              backgroundColor: 'oklch(29.46% 0.06 276.82)',
              borderColor: 'oklch(56.95% 0.165 266.79)'
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-white">
                Update Status RAB
              </DialogTitle>
              <DialogDescription>
                Update the verification status for this budget plan.
              </DialogDescription>
            </DialogHeader>
            <Form {...statusForm}>
              <form
                onSubmit={statusForm.handleSubmit(onSubmitStatusUpdate)}
                className="space-y-4"
              >
                <FormField
                  control={statusForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-transparent border-gray-600 text-white">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="APPROVED">Disetujui</SelectItem>
                          <SelectItem value="REJECTED">Ditolak</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={statusForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        Notes (Optional)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes..."
                          {...field}
                          className="bg-transparent border-gray-600 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsStatusUpdateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending
                      ? 'Updating...'
                      : 'Update Status'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <BudgetDetail
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          selectedRab={selectedRab}
        />
      </div>
    </div>
  )
}
