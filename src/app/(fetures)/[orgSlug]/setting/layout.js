'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'

const SettingLayout = ({ children }) => {
  const pathname = usePathname().split('/').slice(1)

  return (
    <div className="h-full w-full flex gap-8">
      <aside>
        <ul>
          <li>
            <Link
              className={buttonVariants({ variant: 'link' })}
              href="/setting/profile"
            >
              Profile Setting
            </Link>
          </li>
          <li>
            <Link
              className={buttonVariants({ variant: 'link' })}
              href="/setting/organisasi"
            >
              Organisasi Setting
            </Link>
          </li>
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i}>
              <Link
                className={buttonVariants({ variant: 'link' })}
                href={`/setting/${i}`}
              >
                Setting {i}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex-1">
        <h1 className="mb-5 text-xl font-bold uppercase">{pathname[1]}</h1>
        <div>{children}</div>
      </div>
    </div>
  )
}

export default SettingLayout
