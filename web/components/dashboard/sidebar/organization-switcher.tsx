"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, GalleryVerticalEnd, type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { switchOrganizationAction } from "@/lib/actions/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

// Mapeo de nombres de iconos a componentes
const iconMap: Record<string, LucideIcon> = {
    GalleryVerticalEnd,
}

export function OrganizationSwitcher({
    teams,
    currentOrgId,
}: {
    teams: {
        id: string // Key único (orgId-role)
        orgId: string // ID real de la organización
        name: string
        logo: string | React.ElementType
        plan: string
        role: string // Rol del usuario en esta org
    }[]
    currentOrgId?: string
}) {
    const { isMobile } = useSidebar()
    const router = useRouter()

    // Encontrar la organización actual (comparar con orgId, no con id)
    const activeTeam = teams.find(t => t.orgId === currentOrgId) || teams[0]

    const [mounted, setMounted] = React.useState(false)
    const [isSwitching, setIsSwitching] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const handleSwitchOrganization = async (team: any) => {
        if (team.orgId === activeTeam?.orgId && team.role === activeTeam?.role) return // Ya está en esta org con este rol

        setIsSwitching(true)

        try {
            // Pasar el orgId real, no el id compuesto
            const result = await switchOrganizationAction(team.orgId)

            if (result.success) {
                // Refrescar la página para actualizar el sidebar con los nuevos datos
                router.refresh()
            } else {
                console.error('Error switching organization:', result.error)
            }
        } catch (error) {
            console.error('Error switching organization:', error)
        } finally {
            setIsSwitching(false)
        }
    }

    // Convertir logo string a componente
    const LogoComponent = typeof activeTeam?.logo === 'string'
        ? (iconMap[activeTeam.logo] || GalleryVerticalEnd)
        : (activeTeam?.logo || GalleryVerticalEnd)

    if (!activeTeam) {
        return null
    }

    if (!mounted) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg">
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <LogoComponent className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{activeTeam.name}</span>
                            <span className="truncate text-xs">{activeTeam.plan}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto" />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            disabled={isSwitching}
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <LogoComponent className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{activeTeam.name}</span>
                                <span className="truncate text-xs">{activeTeam.plan}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Organizaciones
                        </DropdownMenuLabel>
                        {teams.map((team, index) => {
                            const TeamLogo = typeof team.logo === 'string'
                                ? (iconMap[team.logo] || GalleryVerticalEnd)
                                : (team.logo || GalleryVerticalEnd)

                            return (
                                <DropdownMenuItem
                                    key={team.id}
                                    onClick={() => handleSwitchOrganization(team)}
                                    className="gap-2 p-2"
                                    disabled={isSwitching}
                                >
                                    <div className="flex size-6 items-center justify-center rounded-md border">
                                        <TeamLogo className="size-3.5 shrink-0" />
                                    </div>
                                    {team.name}
                                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            )
                        })}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 p-2"
                            onClick={() => router.push('/dashboard/organizations/new')}
                            disabled={isSwitching}
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <div className="text-muted-foreground font-medium">Agregar</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
