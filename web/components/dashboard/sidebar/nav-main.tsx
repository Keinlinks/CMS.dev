"use client"

import { ChevronRight, SquareTerminal, Settings2, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

// Mapeo de nombres de iconos a componentes
const iconMap: Record<string, LucideIcon> = {
  SquareTerminal,
  Settings2,
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: string | LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      badge?: string | number
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Convertir string a componente de icono
          const IconComponent = typeof item.icon === 'string'
            ? iconMap[item.icon]
            : item.icon

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >

              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {IconComponent && <IconComponent />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url} className="flex justify-between items-center">
                            <span>{subItem.title}</span>
                            {subItem.badge && (
                              <span className="ml-auto text-xs font-medium text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                                {subItem.badge}
                              </span>
                            )}
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
