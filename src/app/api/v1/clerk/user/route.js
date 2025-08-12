import { NextResponse } from 'next/server'
import { auth, createClerkClient } from '@clerk/nextjs/server'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ message: 'No user found' }, { status: 400 })
  }

  const findUser = await clerk.users.getUser(userId)

  if (!findUser) {
    return NextResponse.json({ message: 'No user found' }, { status: 400 })
  }

  const userMetaData = {
    id: findUser.id,
    npm: findUser.publicMetadata.metadata.npm,
    username: findUser.username,
    profileImg: findUser.imageUrl,
    universitas: findUser.publicMetadata.metadata.universitas,
    telpon: findUser.publicMetadata.metadata.telpon,
    tanggal_lahir: findUser.publicMetadata.metadata.tanggal_lahir,
    jenis_kelamin: findUser.publicMetadata.metadata.jenis_kelamin,
    alamat: findUser.publicMetadata.metadata.alamat,
    bio: findUser.publicMetadata.metadata.bio
  }

  return NextResponse.json(userMetaData, { status: 200 })
}

export async function PUT(req, _res) {
  const { userId } = await auth()
  const userData = await req.json()

  if (!userId) {
    return NextResponse.json({ message: 'No user found' }, { status: 400 })
  }

  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      metadata: {
        ...userData
      }
    }
  })

  return NextResponse.json({ message: 'ok' }, { status: 200 })
}
