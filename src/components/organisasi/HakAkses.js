'use client'

import { Protect } from '@/lib/auth-ui'
import { Button } from '../ui/button'

const HakAkses = () => {
  return (
    <div>
      <h1>kkk</h1>
      <Protect permission="program_kerja:create">
        <Button>Edit</Button>
      </Protect>
    </div>
  )
}

export default HakAkses
