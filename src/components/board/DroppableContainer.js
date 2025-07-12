'use client'

import { SortableContext } from '@dnd-kit/sortable'
import { DraggableItem } from './DraggableItem'

function DroppableContainer({ id, title, items }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`${
        isOver ? 'bg-background/50 ring-2 ring-accentColor' : 'bg-background'
      } rounded shadow-md transition-all duration-150`}
    >
      <div className="flex justify-between items-center p-4 mb-4">
        <h2 className="font-semibold">{title}</h2>
        <div className="bg-accentColor text-white text-sm font-semibold px-2 py-1 rounded-full">
          {items.length}
        </div>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto min-h-[500px] max-h-[500px] p-2">
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map(item => (
            <DraggableItem key={item.id} id={item.id} data={item} />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-zinc-500 border-2 border-zinc-500 border-dashed rounded-md">
            <p>Drop task here</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DroppableContainer
