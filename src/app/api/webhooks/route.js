import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { ReponseError } from '../errors/ResponseError'
import { verifyWebhook } from '@clerk/nextjs/webhooks'

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id, deleted } = evt.data
    const eventType = evt.type

    if (
      eventType === 'organizationMembership.created' ||
      eventType === 'organizationMembership.updated'
    ) {
      const { id: memId, organization, public_user_data, role } = evt.data
      const { id: org_id } = organization
      const { user_id } = public_user_data

      try {
        await prisma.organisasi_member.upsert({
          where: { clerkMemId: memId },
          update: {
            role: role
          },
          create: {
            organisasiId: org_id,
            clerkMemId: memId,
            memberId: user_id,
            role: role
          }
        })

        return NextResponse.json(
          { message: 'synchronized organization membership data' },
          { status: 200 }
        )
      } catch (error) {
        return ReponseError(error)
      }
    }

    if (eventType === 'organizationMembership.deleted') {
      if (deleted) {
        await prisma.organisasi_member.delete({
          where: { clerkMemId: id }
        })

        return NextResponse.json(
          { message: 'Organization membership deleted' },
          { status: 200 }
        )
      }
    }

    if (
      eventType === 'organization.created' ||
      eventType === 'organization.updated'
    ) {
      const { id, name, slug, image_url, created_by } = evt.data

      try {
        await prisma.organisasi.upsert({
          where: { id },
          update: {
            id: id,
            name: name,
            slug: slug,
            image_url: image_url,
            created_by: created_by
          },
          create: {
            id,
            name,
            slug,
            image_url,
            created_by
          }
        })

        return NextResponse.json(
          { message: 'synchronized organization data' },
          { status: 200 }
        )
      } catch (error) {
        return ReponseError(error)
      }
    }

    if (eventType === 'organization.deleted') {
      if (deleted) {
        await prisma.organisasi.delete({
          where: { id: id }
        })
        return NextResponse.json(
          { message: 'Organization deleted' },
          { status: 200 }
        )
      }
    }

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const {
        id: clerkId,
        email_addresses,
        first_name,
        last_name,
        profile_image_url,
        gender,
        birthday,
        username
      } = evt.data
      const email = email_addresses[0]?.email_address

      await prisma.user.upsert({
        where: { clerkId },
        update: {
          username: username,
          firstName: first_name,
          lastName: last_name,
          profileImg: profile_image_url,
          tanggal_lahir: birthday,
          jenis_kelamin: gender
        },
        create: {
          id,
          clerkId,
          email,
          username: username,
          firstName: first_name,
          lastName: last_name,
          profileImg: profile_image_url,
          tanggal_lahir: birthday,
          jenis_kelamin: gender
        }
      })

      return NextResponse.json(
        { message: 'User synchronized' },
        { status: 200 }
      )
    }

    if (eventType === 'user.deleted') {
      if (deleted) {
        await prisma.user.delete({
          where: { id: id, clerkId: id }
        })

        return NextResponse.json({ message: 'User deleted' }, { status: 200 })
      }
    }
  } catch (err) {
    return ReponseError(err)
  }

  return NextResponse.json({ message: 'OK!!!' }, { status: 200 })
}
