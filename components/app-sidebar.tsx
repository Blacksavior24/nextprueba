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
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Prueba",
          url: "/dashboard/prueba",
        },
        {
          title: "Cartas Recibidos",
          url: "/dashboard/recibidas",
        },
        {
          title: "Asignación de Area",
          url: "/dashboard/asignacion",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentación",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Introducción",
          url: "/dashboard/intro",
        },
        {
          title: "Como empezar",
          url: "/dashboard/iniciar",
        },
        {
          title: "Versión",
          url: "/dashboard/version",
        },
      ],
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
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
