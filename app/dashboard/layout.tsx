import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
  } from "@/components/ui/breadcrumb"
  
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ReactNode } from "react"

export default function Page({children}: {children: ReactNode}) {
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
                                        GRUPO SUR - SISTEMA DE CARTAS
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
