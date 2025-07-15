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

//components
import { toast } from 'sonner'
import CreatedTaskDialog from './CreatedTaskDialog'
import { ErrorState } from '@/components/LoadState/LoadStatus'

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

/**
 * Reusable KanbanBoard Component
 */
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

  const { data: rawData, error } = useQuery({
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

        updateTaskMutation.mutate(updatedTask)
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

        batchUpdateTasksMutation.mutate(tasksToUpdate)
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
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Pilih Program Kerja terlebih dahulu</p>
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
      <div className="space-y-4">
        {showCreateDialog && (
          <CreatedTaskDialog divisiId={divisiId} scope={scope} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(columns).map(([status, items]) => (
            <DroppableContainer
              key={status}
              id={status}
              title={getStatusTitle(status)}
              items={items}
              enableDragAndDrop={enableDragAndDrop}
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

function DroppableContainer({ id, title, items, enableDragAndDrop = true }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: !enableDragAndDrop
  })

  return (
    <div
      ref={setNodeRef}
      className={`${
        isOver && enableDragAndDrop
          ? 'bg-background/50 ring-2 ring-accentColor'
          : 'bg-background'
      } rounded shadow-md transition-all duration-150 ${
        !enableDragAndDrop ? 'opacity-90' : ''
      }`}
    >
      <div className="flex justify-between items-center p-4 mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          {title}
          {!enableDragAndDrop && (
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              Read Only
            </span>
          )}
        </h2>
        <div className="bg-accentColor text-white text-sm font-semibold px-2 py-1 rounded-full">
          {items?.length || 0}
        </div>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto min-h-[400px] max-h-[600px] p-2">
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
          <div className="flex-1 flex items-center justify-center text-zinc-500 border-2 border-zinc-500 border-dashed rounded-md">
            <p>{enableDragAndDrop ? 'Drop task here' : 'No tasks'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
