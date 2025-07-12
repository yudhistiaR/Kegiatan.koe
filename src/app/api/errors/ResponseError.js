import { ZodError } from 'zod'
import { ErrorResponse } from '@/helpers/error'
import { NextResponse } from 'next/server'

export function ReponseError(error) {
  if (error instanceof ZodError) {
    return NextResponse.json({ errors: error.issues }, { status: 400 })
  } else if (error instanceof ErrorResponse) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status }
    )
  } else {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
