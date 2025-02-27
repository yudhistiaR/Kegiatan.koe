import { RiLoaderFill } from 'react-icons/ri'

const LoadingPage = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <RiLoaderFill className="h-12 w-12 animate-spin" />
    </div>
  )
}

export default LoadingPage
