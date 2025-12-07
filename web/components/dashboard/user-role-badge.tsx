'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Shield, Edit3 } from 'lucide-react'

type UserRole = 'admin' | 'editor' | null

interface UserRoleBadgeProps {
    /**
     * Tamaño del badge
     * @default 'default'
     */
    size?: 'sm' | 'default' | 'lg'

    /**
     * Mostrar icono junto al texto
     * @default true
     */
    showIcon?: boolean

    /**
     * Clase CSS adicional
     */
    className?: string
}

/**
 * Badge que muestra el rol del usuario en la organización actual
 * 
 * @example
 * ```tsx
 * <UserRoleBadge />
 * <UserRoleBadge size="sm" showIcon={false} />
 * ```
 */
export function UserRoleBadge({
    size = 'default',
    showIcon = true,
    className = ''
}: UserRoleBadgeProps) {
    const [role, setRole] = useState<UserRole>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getUserRole = () => {
            try {
                // Obtener cookies del cliente
                const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
                    const [key, value] = cookie.split('=')
                    acc[key] = value
                    return acc
                }, {} as Record<string, string>)

                const currentOrgCookie = cookies['current_organization']
                const userOrgsCookie = cookies['user_organizations']

                if (!currentOrgCookie || !userOrgsCookie) {
                    setRole(null)
                    setIsLoading(false)
                    return
                }

                const currentOrg = JSON.parse(decodeURIComponent(currentOrgCookie))
                const userOrgs = JSON.parse(decodeURIComponent(userOrgsCookie))

                const currentUserOrg = userOrgs.find(
                    (uo: any) => uo.organizationId === currentOrg.id
                )

                setRole(currentUserOrg?.role || null)
            } catch (error) {
                console.error('Error getting user role:', error)
                setRole(null)
            } finally {
                setIsLoading(false)
            }
        }

        getUserRole()

        // Escuchar cambios en las cookies (cuando cambia de organización)
        const interval = setInterval(getUserRole, 1000)
        return () => clearInterval(interval)
    }, [])

    if (isLoading) {
        return (
            <Badge variant="outline" className={className}>
                <span className="animate-pulse">Cargando...</span>
            </Badge>
        )
    }

    if (!role) {
        return null
    }

    const roleConfig = {
        admin: {
            label: 'Administrador',
            variant: 'default' as const,
            icon: Shield,
            color: 'bg-blue-500 text-white hover:bg-blue-600',
        },
        editor: {
            label: 'Editor',
            variant: 'secondary' as const,
            icon: Edit3,
            color: 'bg-purple-500 text-white hover:bg-purple-600',
        },
    }

    const config = roleConfig[role]
    const Icon = config.icon

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        default: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
    }

    return (
        <Badge
            variant={config.variant}
            className={`${config.color} ${sizeClasses[size]} ${className} flex items-center gap-1.5`}
        >
            {showIcon && <Icon className="h-3 w-3" />}
            <span>{config.label}</span>
        </Badge>
    )
}
