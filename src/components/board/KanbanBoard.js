'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { Plus, Calendar, Users, AlertCircle } from 'lucide-react'

//components
import { toast } from 'sonner'
import CreatedTaskDialog from './CreatedTaskDialog'
import { ErrorState } from '@/components/LoadState/LoadStatus'
import { Protect } from '@clerk/nextjs'

//Kanban-components
import DraggableItem from './DraggableItem'
import DraggablePreview from './DraggablePreview'

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
}

const defaultApiConfig = {
  me: {
    fetchUrl: (_, prokerId) => `/api/v1/me/tugas/${prokerId}`,
    updateUrl: (orgId, prokerId) => `/api/v1/proker/${orgId}/${prokerId}/tugas`,
    batchUpdateUrl: (orgId, prokerId) =>
      `/api/v1/proker/${orgId}/${prokerId}/tugas/batch`,
    queryKey: (orgId, prokerId) => ['me-tugas', 'me', orgId, prokerId]
  },
  divisi: {
    fetchUrl: divisiId => `/api/v1/proker/divisi/${divisiId}/tugas`,
    updateUrl: divisiId => `/api/v1/proker/divisi/${divisiId}/tugas`,
    batchUpdateUrl: divisiId => `/api/v1/proker/divisi/${divisiId}/tugas/batch`,
    queryKey: divisiId => ['tugas', 'divisi', divisiId]
  },
  all: {
    fetchUrl: (orgId, prokerId) => `/api/v1/proker/${orgId}/${prokerId}/tugas`,
    updateUrl: (orgId, prokerId) => `/api/v1/proker/${orgId}/${prokerId}/tugas`,
    batchUpdateUrl: (orgId, prokerId) =>
      `/api/v1/proker/${orgId}/${prokerId}/tugas/batch`,
    queryKey: (orgId, prokerId) => ['tugas', 'all', orgId, prokerId]
  }
}

export default function KanbanBoard({
  scope = 'divisi',
  divisiId = null,
  prokerId = null,
  apiConfig = null,
  showCreateDialog = true,
  enableDragAndDrop = true,
  onTaskUpdate = null,
  onTasksReorder = null
}) {
  const { orgId } = useAuth()
  const queryClient = useQueryClient()
  const config = apiConfig || defaultApiConfig[scope]

  const [columns, setColumns] = useState({
    TODO: [],
    INPROGRESS: [],
    REVIEW: [],
    DONE: []
  })
  const [activeTask, setActiveTask] = useState(null)

  // Memoize URLs and query key to prevent recalculation
  const apiUrls = useMemo(() => {
    const fetchUrl =
      scope === 'divisi'
        ? config.fetchUrl(divisiId)
        : config.fetchUrl(orgId, prokerId)

    const updateUrl =
      scope === 'divisi'
        ? config.updateUrl(divisiId)
        : config.updateUrl(orgId, prokerId)

    const batchUpdateUrl =
      scope === 'divisi'
        ? config.batchUpdateUrl(divisiId)
        : config.batchUpdateUrl(orgId, prokerId)

    const queryKey =
      scope === 'divisi'
        ? config.queryKey(divisiId)
        : config.queryKey(orgId, prokerId)

    return { fetchUrl, updateUrl, batchUpdateUrl, queryKey }
  }, [scope, divisiId, prokerId, orgId, config])

  const {
    data: rawData,
    error,
    isLoading
  } = useQuery({
    queryKey: [...apiUrls.queryKey, apiUrls.fetchUrl],
    queryFn: async () => {
      const req = await fetch(apiUrls.fetchUrl)
      if (!req.ok) {
        throw new Error('Failed to fetch tasks')
      }
      return req.json()
    },
    enabled: !!(scope === 'divisi' ? divisiId : prokerId) && !!orgId,
    retry: 3,
    retryDelay: 1000
  })

  // Process data and update columns
  useEffect(() => {
    if (rawData && Array.isArray(rawData)) {
      const processedData = {
        TODO: [],
        INPROGRESS: [],
        REVIEW: [],
        DONE: []
      }

      const sortedTasks = [...rawData].sort((a, b) => a.order - b.order)

      sortedTasks.forEach(task => {
        if (processedData[task.status]) {
          processedData[task.status].push(task)
        }
      })

      setColumns(processedData)
    }
  }, [rawData])

  const { mutate: updateTask } = useMutation({
    mutationFn: async updatedTask => {
      const response = await fetch(apiUrls.updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      toast.success('Tugas berhasil diubah')
      queryClient.invalidateQueries({ queryKey: apiUrls.queryKey })

      if (onTaskUpdate) {
        onTaskUpdate(variables, data)
      }
    },
    onError: error => {
      toast.error('Gagal mengubah tugas')
      console.error('Update task error:', error)
    }
  })

  const { mutate: batchUpdateTasks } = useMutation({
    mutationFn: async updatedTasks => {
      const response = await fetch(apiUrls.batchUpdateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tasks: updatedTasks })
      })

      if (!response.ok) {
        throw new Error('Failed to batch update tasks')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: apiUrls.queryKey })

      if (onTasksReorder) {
        onTasksReorder(variables, data)
      }
    },
    onError: error => {
      toast.error('Gagal mengubah urutan tugas')
      console.error('Batch update tasks error:', error)
    }
  })

  const findColumnKeyByTaskId = useCallback(
    id => {
      return Object.keys(columns).find(key =>
        columns[key].some(item => item.id === id)
      )
    },
    [columns]
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 300,
        distance: 5
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 10
      }
    })
  )

  const handleDragStart = useCallback(
    event => {
      if (!enableDragAndDrop) return

      const { active } = event
      const task = Object.values(columns)
        .flat()
        .find(t => t.id === active.id)

      if (task) {
        setActiveTask(task)
      }
    },
    [enableDragAndDrop, columns]
  )

  const handleDragEnd = useCallback(
    event => {
      if (!enableDragAndDrop) {
        setActiveTask(null)
        return
      }

      setActiveTask(null)
      const { active, over } = event
      if (!over) return

      if (over.id in columns) {
        const sourceColumn = findColumnKeyByTaskId(active.id)
        if (sourceColumn === over.id) return

        const activeItem = columns[sourceColumn].find(
          item => item.id === active.id
        )
        const targetItems = columns[over.id]

        setColumns(prev => {
          const updatedSource = prev[sourceColumn].filter(
            item => item.id !== active.id
          )
          const updatedTarget = [
            ...prev[over.id],
            { ...activeItem, status: over.id }
          ]

          return {
            ...prev,
            [sourceColumn]: updatedSource,
            [over.id]: updatedTarget
          }
        })

        const updatedTask = {
          ...activeItem,
          status: over.id,
          order:
            targetItems.length > 0
              ? Math.max(...targetItems.map(item => item.order)) + 1
              : 0
        }

        updateTask(updatedTask)
        return
      }

      if (active.id === over.id) return

      const sourceColumn = findColumnKeyByTaskId(active.id)
      const targetColumn = findColumnKeyByTaskId(over.id)

      if (!sourceColumn || !targetColumn) return

      if (sourceColumn === targetColumn) {
        const oldIndex = columns[sourceColumn].findIndex(
          item => item.id === active.id
        )
        const newIndex = columns[sourceColumn].findIndex(
          item => item.id === over.id
        )

        const updatedItems = arrayMove(
          columns[sourceColumn],
          oldIndex,
          newIndex
        )

        setColumns(prev => ({
          ...prev,
          [sourceColumn]: updatedItems
        }))

        const tasksToUpdate = updatedItems.map((task, index) => ({
          ...task,
          order: index
        }))

        batchUpdateTasks(tasksToUpdate)
      } else {
        const activeItem = columns[sourceColumn].find(
          item => item.id === active.id
        )
        const overItemIndex = columns[targetColumn].findIndex(
          item => item.id === over.id
        )

        setColumns(prev => {
          const updatedSource = prev[sourceColumn].filter(
            item => item.id !== active.id
          )

          const updatedTarget = [
            ...prev[targetColumn].slice(0, overItemIndex),
            { ...activeItem, status: targetColumn },
            ...prev[targetColumn].slice(overItemIndex)
          ]

          return {
            ...prev,
            [sourceColumn]: updatedSource,
            [targetColumn]: updatedTarget
          }
        })

        const updatedTask = {
          ...activeItem,
          status: targetColumn,
          order: overItemIndex
        }

        const targetTasks = columns[targetColumn]
        const tasksToUpdate = [
          updatedTask,
          ...targetTasks
            .filter(task => task.order >= overItemIndex)
            .map(task => ({ ...task, order: task.order + 1 }))
        ]

        updateTask(updatedTask)
        batchUpdateTasks(tasksToUpdate)
      }
    },
    [
      enableDragAndDrop,
      columns,
      findColumnKeyByTaskId,
      updateTask,
      batchUpdateTasks
    ]
  )

  const handleDragCancel = useCallback(() => {
    setActiveTask(null)
  }, [])

  // Get API configuration
  if (!config) {
    throw new Error(`Invalid scope: ${scope}. Must be 'divisi', 'all', or 'me'`)
  }

  if (error) {
    return <ErrorState error={error} />
  }

  // Early return jika prokerId tidak ada untuk scope 'me'
  if (scope === 'me' && !prokerId) {
    return (
      <div
        className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg"
        style={{ borderColor: 'oklch(56.95% 0.165 266.79)' }}
      >
        <div className="text-center space-y-2">
          <AlertCircle
            className="h-12 w-12 mx-auto"
            style={{ color: 'oklch(56.95% 0.165 266.79)' }}
          />
          <p className="text-white/70">Pilih Program Kerja terlebih dahulu</p>
        </div>
      </div>
    )
  }

  // Validate required props
  if (scope === 'divisi' && !divisiId) {
    throw new Error('divisiId is required when scope is "divisi"')
  }

  if (scope === 'all' && !prokerId) {
    throw new Error('prokerId is required when scope is "all"')
  }

  return (
    <DndContext
      sensors={enableDragAndDrop ? sensors : []}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
    >
      <div className="w-full my-6 space-y-6">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">Manajemen Tugas</h1>
            <p className="text-white/70">
              Kelola dan pantau progress tugas tim Anda
            </p>
          </div>
          <Protect permission="tugas:create">
            {showCreateDialog && (
              <CreatedTaskDialog divisiId={divisiId} scope={scope} />
            )}
          </Protect>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(columns).map(([status, items]) => (
            <div
              key={status}
              className="rounded-lg p-4 border border-white/10"
              style={{ backgroundColor: 'oklch(27.27% 0.056 276.3)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">
                    {getStatusTitle(status)}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {items?.length || 0}
                  </p>
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: 'oklch(56.95% 0.165 266.79)'
                  }}
                >
                  {getStatusIcon(status)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(columns).map(([status, items]) => (
            <DroppableContainer
              key={status}
              id={status}
              title={getStatusTitle(status)}
              items={items}
              enableDragAndDrop={enableDragAndDrop}
              status={status}
            />
          ))}
        </div>
      </div>

      {enableDragAndDrop && (
        <DragOverlay dropAnimation={dropAnimation} zIndex={1000}>
          {activeTask ? <DraggablePreview data={activeTask} /> : null}
        </DragOverlay>
      )}
    </DndContext>
  )
}

function getStatusTitle(status) {
  const titles = {
    TODO: 'To Do',
    INPROGRESS: 'In Progress',
    REVIEW: 'Review',
    DONE: 'Done'
  }
  return titles[status] || status
}

function getStatusIcon(status) {
  const icons = {
    TODO: <Calendar className="h-5 w-5" style={{ color: 'white' }} />,
    INPROGRESS: <Users className="h-5 w-5" style={{ color: 'white' }} />,
    REVIEW: <AlertCircle className="h-5 w-5" style={{ color: 'white' }} />,
    DONE: <Plus className="h-5 w-5" style={{ color: 'white' }} />
  }
  return icons[status] || null
}

function DroppableContainer({
  id,
  title,
  items,
  enableDragAndDrop = true,
  status
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: !enableDragAndDrop
  })

  const getStatusColor = status => {
    const colors = {
      TODO: 'oklch(56.95% 0.165 266.79)',
      INPROGRESS: 'oklch(65% 0.15 45)',
      REVIEW: 'oklch(65% 0.15 25)',
      DONE: 'oklch(65% 0.15 140)'
    }
    return colors[status] || 'oklch(56.95% 0.165 266.79)'
  }

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border transition-all duration-200 ${
        isOver && enableDragAndDrop
          ? 'ring-2 scale-105 shadow-lg'
          : 'border-white/10'
      } ${!enableDragAndDrop ? 'opacity-90' : ''}`}
      style={{
        backgroundColor: 'oklch(29.46% 0.06 276.82)',
        ...(isOver &&
          enableDragAndDrop && {
            ringColor: getStatusColor(status),
            boxShadow: `0 0 20px ${getStatusColor(status)}20`
          })
      }}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getStatusColor(status) }}
          ></div>
          <h2 className="font-semibold text-white flex items-center gap-2">
            {title}
            {!enableDragAndDrop && (
              <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/60">
                Read Only
              </span>
            )}
          </h2>
        </div>
        <div
          className="px-2 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {items?.length || 0}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
          <SortableContext
            items={items?.map(item => item.id) || []}
            strategy={verticalListSortingStrategy}
            disabled={!enableDragAndDrop}
          >
            {items?.map(item => (
              <DraggableItem
                key={item.id}
                id={item.id}
                data={item}
                disabled={!enableDragAndDrop}
              />
            ))}
          </SortableContext>

          {(!items || items.length === 0) && (
            <div className="flex-1 flex flex-col items-center justify-center text-white/50 border-2 border-dashed border-white/20 rounded-lg py-12">
              <div className="text-center space-y-2">
                {getStatusIcon(status)}
                <p className="text-sm">
                  {enableDragAndDrop ? 'Drop tugas di sini' : 'Tidak ada tugas'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
