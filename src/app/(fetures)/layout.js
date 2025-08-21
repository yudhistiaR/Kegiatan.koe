import SidebarWithTooltipProvider from '@/components/navbar/_sidebar'

const DashboardLayout = ({ children }) => {
  return <SidebarWithTooltipProvider>{children}</SidebarWithTooltipProvider>
}

export default DashboardLayout
