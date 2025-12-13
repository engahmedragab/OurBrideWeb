'use client'

import { Footer, Header } from "@/Components/layout"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/Components/ui'
import { cn } from "@/lib";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";

const linksData = [
    { label: 'items', href: '/planning/items',icon: Home},
    { label: 'budget', href: '/planning/budget',icon: Home },
    { label: 'services', href: '/planning/services' ,icon: Home},
    { label: 'events', href: '/planning/events-itinerary',icon: Home },
    { label: 'guests', href: '/planning/guests', icon: Home },
    { label: 'To Do', href: '/planning/todo',icon: Home },
  ]
export default function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activePath = usePathname() || '/';
  return (
    <div className="w-full min-h-screen  flex flex-col bg-white">
     <div className="min-h-screen flex flex-col">
      <Header />
<NavigationMenu 
      className="max-w-none items-start  w-full justify-center"
    >
      <NavigationMenuList className="flex my-4 border rounded justify-center gap-4">
        
        {linksData.map((link) => {
          const Icon = link.icon
          const isActive = link.href === activePath 

          return (
            <NavigationMenuItem key={link.href}>
              
              <NavigationMenuLink 
                href={link.href} 
                className={cn(
                  navigationMenuTriggerStyle(),
                  'flex items-center gap-5 mx-5 text-16 font-semibold border border-transparent',
                  isActive 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100 data-[active]:bg-red-100 data-[state=open]:bg-red-100' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-red-600', // تحويم خفيف للنصوص غير النشطة
                  'transition-all duration-300 transform hover:scale-[1.03]'
                )}   
                asChild
              >
                <a href={link.href} className="flex items-center"> 
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
        
      </NavigationMenuList>
    </NavigationMenu>
    <div className="container-custom ">
        {children}
    </div>
      </div>
      <Footer/>
    </div>
  );
}
