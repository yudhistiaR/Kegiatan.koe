import { SignUp } from '@clerk/nextjs'

function Page() {
  return (
    <div className="container mx-auto flex justify-center items-center max-h-screen h-screen">
      <SignUp />
    </div>
  )
}
export default Page
