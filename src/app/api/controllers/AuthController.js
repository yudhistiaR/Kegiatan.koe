import { NextResponse } from 'next/server'
import { AuthService } from '../services/AuthService'

export class AuthController {
  static async REGISTER() {
    try {
      const response = await AuthService.REGISTER()

      return NextResponse.json({ response, status: '200' })
    } catch (error) {
      return NextResponse.json({ message: error })
    }
  }
}
