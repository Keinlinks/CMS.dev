import * as React from "react"

import { NavMain } from "@/components/dashboard/sidebar/nav-main";
import { NavUser } from "@/components/dashboard/sidebar/nav-user";
import { OrganizationSwitcher } from "@/components/dashboard/sidebar/organization-switcher";
import { EditorInvite } from "@/components/dashboard/sidebar/editor-invite";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { SidebarLogo } from "@/components/dashboard/sidebar/sidebar-logo";
import {
  getCurrentUserData,
  getUserOrganizations,
  getCurrentOrganization,
  getTestimonialStatsAction
} from "@/lib/actions/sidebar";

export async function AppSidebar({ organizations, ...props }: React.ComponentProps<typeof Sidebar> & {
  organizations?: any[]
}) {
  // Obtener datos reales del servidor
  const user = await getCurrentUserData()
  // organizations ya viene como prop desde el layout
  const currentOrg = await getCurrentOrganization()
  const stats = await getTestimonialStatsAction()

  // TODO: Obtener miembros de la organización actual cuando implementemos las funciones
  const members: any[] = []

  // Transformar organizaciones al formato que espera OrganizationSwitcher
  // Agregar indicador de rol al nombre para distinguir múltiples roles en la misma org
  const teams = (organizations || []).map((org: any) => {
    const roleIndicator = org.role === 'admin' ? '(A)' : org.role === 'editor' ? '(E)' : '(V)'
    return {
      id: org.userOrganizationId, // Key único: ID de la relación user-org
      orgId: org.id, // ID real de la organización para switchOrganizationAction
      name: `${org.name} ${roleIndicator}`,
      logo: org.logoUrl || "GalleryVerticalEnd",
      plan: org.role === 'admin' ? 'Administrador' : org.role === 'editor' ? 'Editor' : 'Viewer',
      role: org.role, // Guardar el rol para usarlo después
    }
  })

  // Datos del usuario
  const userData = user ? {
    name: user.name,
    email: user.email,
  } : {
    name: "Usuario",
    email: "user@example.com",
  }

  const navMain = [
    {
      title: "Testimonios",
      url: "#",
      icon: "SquareTerminal",
      items: [
        {
          title: "Todos",
          url: "/dashboard/testimonials",
          badge: stats.total
        },
        {
          title: "Pendientes",
          url: "/dashboard/testimonials?status=pending",
          badge: stats.pending
        },
        {
          title: "Aprobados",
          url: "/dashboard/testimonials?status=approved",
          badge: stats.approved
        },
        {
          title: "Publicados",
          url: "/dashboard/testimonials?status=published",
          badge: stats.published
        },
        {
          title: "Rechazados",
          url: "/dashboard/testimonials?status=rejected",
          badge: stats.rejected
        },
      ],
    },
    {
      title: "Configuraciones",
      url: "#",
      icon: "Settings2",
      items: [
        {
          title: "Categorias",
          url: "/dashboard/categories",
        },
        {
          title: "Muro",
          url: "/dashboard/embed",
        },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher teams={teams} currentOrgId={currentOrg?.id} />
        <EditorInvite
          editors={members}
          currentOrgId={currentOrg?.id}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarLogo src="/logo.webp" alt="My CMS" />

        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
