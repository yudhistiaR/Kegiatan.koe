'use client'

//Hooks
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { formatDate } from '@/helpers/formatedate'
import { notFound } from 'next/navigation'

//componets
import { CardLoading } from '../CardLoading'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Link from 'next/link'
import { User, Target, PencilLine } from 'lucide-react'

const ProkerList = () => {
  const { userId, orgId, orgSlug, isLoaded } = useAuth()

  const { data, isLoading, isPending } = useQuery({
    queryKey: ['proker-list', userId, orgId],
    queryFn: async () => {
      const res = await fetch('/api/v1/proker', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }
      return res.json()
    },
    enabled: isLoaded && !!userId && !!orgId
  })

  if (!isLoaded || isLoading || isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <CardLoading key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {data.length > 0 ? (
        <>
          {data.map((proker, _) => (
            <Link href={`/${orgSlug}/proker/${proker.id}`} key={proker.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{proker.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 text-xs mt-2 font-semibold text-white">
                      <p className="bg-green-500/80 p-[3px] rounded-xs">
                        LIST ID {proker.id.split('-')[0]}
                      </p>
                      <p className="bg-red-500/80 p-[3px] rounded-xs">
                        Persentase 40%
                      </p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold flex items-center gap-2">
                      <User size={20} className="text-accentColor" />
                      {proker.author}
                    </p>
                    <p className="text-xs font-semibold flex items-center gap-2">
                      <Target size={20} className="text-accentColor" />
                      Persiapan : {formatDate(proker.end)}
                    </p>
                    <p className="text-xs font-semibold flex items-center gap-2">
                      <PencilLine size={20} className="text-accentColor" />
                      Pelaksanaan : {formatDate(proker.start)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </>
      ) : (
        <div className="w-full h-full col-span-4 text-2xl font-bold flex justify-center items-center mt-20">
          <p>Program Kerja masih kosong</p>
        </div>
      )}
    </div>
  )
}

export default ProkerList
