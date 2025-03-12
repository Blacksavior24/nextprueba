"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    name: string
    url: string
    icon: LucideIcon
    roles: string[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>PLATAFORMA</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (  
            <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                  {item.icon && <item.icon className="text-blue-600"/>}
                  <span className="text-sm">{item.name}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-blue-500" />
                  </Link>
                </SidebarMenuButton>
                
            </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
