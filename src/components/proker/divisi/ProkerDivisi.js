'use client'

import CreateProkerDivisi from './CreateProkerDivisi'
import CardListDivisi from './CardListDivisi'
import { Protect } from '@clerk/nextjs'

const ProkerDivisi = () => {
  return (
    <div className="space-y-5">
      <Protect permission="divisi:create">
        <nav className="w-full h-12 bg-background shadow-md flex items-center justify-end p-4 rounded-md">
          <CreateProkerDivisi />
        </nav>
      </Protect>
      <Protect permission="divisi:view">
        <CardListDivisi />
      </Protect>
    </div>
  )
}

export default ProkerDivisi
