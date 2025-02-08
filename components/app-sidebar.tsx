"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Package,
  Users,
  StickyNote,
  SquareTerminal,
  CheckCheck,
  Factory,
  Key,
  Group,
  Ungroup,
  FileInput,
  FileUp,
  FileUser,
  FilePen,
  FileCheck,
  FolderTree,
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
      name: "Cartas",
      url: "/dashboard/cartas",
      icon: FolderTree
    },
    {
      name: "Asignar Area",
      url: "/dashboard/asignar",
      icon: FileUp,
    },
    {
      name: "Pendientes",
      url: "/dashboard/pendientes",
      icon: FileUser,
    },
    {
      name: "Cargo",
      url: "/dashboard/cargo",
      icon: FileCheck,
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
      icon: Group,
    },
    {
      name: "Sub Áreas",
      url: "/dashboard/subareas",
      icon: Ungroup,
    },
    {
      name: "Temas",
      url: "/dashboard/temas",
      icon: StickyNote,
    },
    {
      name: "Roles",
      url: "/dashboard/roles",
      icon: Key,
    },
    {
      name: "Empresas",
      url: "/dashboard/empresas",
      icon: Factory,
    },
    {
      name: "Destinatarios",
      url: "/dashboard/destinatarios",
      icon: CheckCheck
    }
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
