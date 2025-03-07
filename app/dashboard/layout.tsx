'use client';
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
  } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
  
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/auth.store"
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react"

export default function Page({children}: {children: ReactNode}) {

  const { user, fetchProfile } = useAuthStore()

  useEffect(()=>{
    if (!user) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchProfile()
      }
    }
  },[user, fetchProfile])

  const router = useRouter()

  const handleDashboard = () => {

    router.push('/dashboard')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                  <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                    <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-sm font-medium"
                      onClick={handleDashboard}
                    >
                      <Home className="h-4 w-4" />
                      <span className="hidden md:inline">GRUPO SUR - SISTEMA DE CARTAS</span>
                    </Button>
                                    </BreadcrumbItem>
                                  </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>
       {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
