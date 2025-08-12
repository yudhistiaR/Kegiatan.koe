import { auth } from '@clerk/nextjs/server'
import ProkerList from '@/components/proker/Proker-list'
import CreateProker from '@/components/proker/CreateProker'

const ProkerPage = async () => {
  const { has } = await auth()

  const isAccessCreate = has({ permission: 'program_kerja:create' })
  const isAccessView = has({ permission: 'program_kerja:view' })

  return (
    <div className="w-full h-full">
      {isAccessCreate && (
        <div className="mb-4 sticky top-0 right-0 bg-background p-4 rounded-md shadow-lg flex justify-end items-center gap-4 z-10">
          <CreateProker />
        </div>
      )}
      {/* Proker List */}
      {isAccessView && <ProkerList />}
    </div>
  )
}

export default ProkerPage
