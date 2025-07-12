import Sidebar from '@/components/navbar/_sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'

const DashboardLayout = ({ children }) => {
  return (
    <TooltipProvider>
      <Sidebar>{children}</Sidebar>
      <Toaster
        richColors
        closeButton
        position="top-left"
        gap={10}
        className="z-[99999999]"
      />
    </TooltipProvider>
  )
}

export default DashboardLayout
