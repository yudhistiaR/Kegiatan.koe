import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="container mx-auto flex justify-center items-center max-h-screen h-screen">
      <SignIn />
    </div>
  )
}
