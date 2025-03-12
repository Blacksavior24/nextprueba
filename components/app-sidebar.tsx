"use client"

import * as React from "react"
import {
  Users,
  StickyNote,
  CheckCheck,
  Factory,
  Key,
  Group,
  Ungroup,
  FileUser,
  FolderTree,
  NotepadText,
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
import { useEffect, useState } from "react"
import { NavReports } from "./nav-reports"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"

// This is sample data.
const data = {
  user: {
    name: "Emerson",
    email: "evillalta@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [],
  navMain: [
    {
      name: "Cartas",
      url: "/dashboard/cartas",
      icon: FolderTree,
      roles: ["admin"],
    },
    {
      name: "Pendientes",
      url: "/dashboard/pendientes",
      icon: FileUser,
      roles: ["admin", "user"],
    },
  ],
  reports: [
    {
      name: "Reporte",
      url: "/dashboard/reportes",
      icon: NotepadText,
      roles: ["admin", "user"],
    }
  ],
  projects: [
    {
      name: "Usuarios",
      url: "/dashboard/usuarios",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Áreas",
      url: "/dashboard/areas",
      icon: Group,
      roles: ["admin"],
    },
    {
      name: "Sub Áreas",
      url: "/dashboard/subareas",
      icon: Ungroup,
      roles: ["admin"],
    },
    {
      name: "Temas",
      url: "/dashboard/temas",
      icon: StickyNote,
      roles: ["admin"],
    },
    {
      name: "Roles",
      url: "/dashboard/roles",
      icon: Key,
      roles: ["admin"],
    },
    {
      name: "Empresas",
      url: "/dashboard/empresas",
      icon: Factory,
      roles: ["admin"],
    },
    {
      name: "Destinatarios",
      url: "/dashboard/destinatarios",
      icon: CheckCheck,
      roles: ["admin"],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, token, logout, fetchProfile, initializeAuth } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    initializeAuth(); // Restaurar el estado de autenticación desde localStorage
  }, [initializeAuth]);

  useEffect(() => {
    if (isClient) {
      const tokenStorage = localStorage.getItem('token');

      // Si no hay token, redirigir al login
      if (!token || !tokenStorage) {
        logout();
        router.push("/");
        return;
      }

      // Verificar si el token sigue activo llamando a fetchProfile
      const checkTokenValidity = async () => {
        try {
          await fetchProfile(); // Si fetchProfile falla, el token ha expirado
        } catch (error) {
          if (error instanceof AxiosError && error.response?.status === 401) {
            logout();
            router.push("/");
          }
        }
      };

      checkTokenValidity();
    }
  }, [token, isClient, router, logout, fetchProfile]);

  // Filtrar elementos de navegación en función del rol del usuario
  const filteredNavMain = data.navMain.filter(item => {
    return item.roles.includes(user?.rol?.nombre || "");
  });

  const filteredProjects = data.projects.filter(item => {
    return item.roles.includes(user?.rol?.nombre || "");
  });

  const filteredReports = data.reports.filter(item => {
    return item.roles.includes(user?.rol?.nombre || "");
  });

  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
    >
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavReports reports={filteredReports} />
        <NavProjects projects={filteredProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.nombre || 'Usuario',
          email: user?.email || 'email@mail.com',
          avatar: "/avatars/shadcn.jpg",
          id: user?.id || 0
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}