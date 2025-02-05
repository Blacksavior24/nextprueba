"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Package,
  Users,
  StickyNote,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/store/auth.store"
import { useEffect } from "react"

// This is sample data.
const data = {
  user: {
    name: "Emerson",
    email: "evillalta@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
  ],
  navMain: [
    {
      name: "Cartas Recibidos",
      url: "/dashboard/recibidas",
      icon: Users,
    },
    {
      name: "Asignar Area",
      url: "/dashboard/asignar",
      icon: Users,
    },
    {
      name: "Pendientes",
      url: "/dashboard/pendientes",
      icon: Users,
    },
    {
      name: "Emisión de Carta",
      url: "/dashboard/emision",
      icon: Users,
    },
    {
      name: "Cargo",
      url: "/dashboard/cargo",
      icon: Users,
    },
  ],
  projects: [
    {
      name: "Usuarios",
      url: "/dashboard/usuarios",
      icon: Users,
    },
    {
      name: "Áreas",
      url: "/dashboard/areas",
      icon: Package,
    },
    {
      name: "Sub Áreas",
      url: "/dashboard/subareas",
      icon: StickyNote,
    },
    {
      name: "Temas",
      url: "/dashboard/temas",
      icon: StickyNote,
    },
    {
      name: "Roles",
      url: "/dashboard/roles",
      icon: StickyNote,
    },
    {
      name: "Empresas",
      url: "/dashboard/empresas",
      icon: StickyNote,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { user } = useAuthStore();


  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
    >
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.nombre || 'Usuario',
          email: user?.email || 'email@mail.com',
          avatar: "/avatars/shadcn.jpg"
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
