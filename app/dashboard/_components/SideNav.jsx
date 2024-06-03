import React, { useEffect } from 'react'
import { BarChart, FileText, MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
function SideNav() {
    const menuList=[
        {
            id:1,
            name:'My forms',
            icon:FileText,
            path:'/dashboard'
        },
        {
            id:1,
            name:'Responses',
            icon:MessageSquare,
            path:'/dashboard/responses'
        }
    ]

    const path=usePathname();
    useEffect(()=>{    
    } ,[path])
  return (
    <div className='h-screen shadow-sm border'>
        <div>
            {menuList.map((menu,index)=>(
                <Link href={menu.path} key={index}>
              <h2 key={index} className={`flex items-center gap-3 p-4 hover:bg-primary hover:text-white rounded-lg cursor-pointer text-gray-500 ${path==menu.path && 'bg-primary text-white'}`}
              >
                   <menu.icon></menu.icon>
                   {menu.name}
              </h2>
              </Link> 
            ))}
        </div>
    </div>
  )
}

export default SideNav
