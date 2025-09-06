import SidebarWithTooltipProvider from '@/components/navbar/_sidebar'
import OrientationWrapper from '@/components/OrientationWrap'

const DashboardLayout = ({ children }) => {
  return (
    <SidebarWithTooltipProvider>
      <OrientationWrapper>{children}</OrientationWrapper>
    </SidebarWithTooltipProvider>
  )
}

export default DashboardLayout
