import Navbar from '@/components/Navbar'

const OrganisasiLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div>
        <div>{children}</div>
      </div>
    </>
  )
}

export default OrganisasiLayout
