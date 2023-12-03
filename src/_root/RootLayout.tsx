import Topbar from '@/components/ui/shared/Topbar'
import LeftSideBar from '@/components/ui/shared/LeftSideBar'
import { Outlet } from 'react-router-dom'
import BottomBar from '@/components/ui/shared/BottomBar'


const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar />

      <LeftSideBar />
      
      <section className="flex flex-1 h-full">
         <Outlet />
      </section>

      <BottomBar />

      </div>

  )
}

export default RootLayout