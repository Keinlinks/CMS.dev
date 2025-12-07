'use client'

import { useEffect, useState } from 'react'

type UserRole = 'admin' | 'editor' | null

interface UseUserRoleReturn {
    role: UserRole
    isAdmin: boolean
    isEditor: boolean
    isLoading: boolean
    hasRole: (requiredRole: 'admin' | 'editor') => boolean
}

/**
 * Hook para obtener el rol del usuario en la organización actual
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { role, isAdmin, isEditor, isLoading } = useUserRole()
 * 
 *   if (isLoading) return <div>Cargando...</div>
 *   if (!isAdmin) return <div>No tienes permisos</div>
 * 
 *   return <div>Bienvenido, administrador</div>
 * }
 * ```
 */
export function useUserRole(): UseUserRoleReturn {
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

                console.log('🔍 useUserRole - currentOrg:', currentOrg)
                console.log('🔍 useUserRole - userOrgs:', userOrgs)

                // Buscar el rol del usuario en la organización actual
                // Manejar dos formatos:
                // 1. { organization: {...}, role: 'admin' } - formato de login
                // 2. { id, name, ..., userOrganizations: [{role: 'admin'}] } - formato de crear org

                let userRole = null

                // Intentar encontrar por organization.id (formato de login)
                const userOrgByOrgId = userOrgs.find((uo: any) => {
                    if (uo.organization) {
                        return uo.organization.id === currentOrg.id
                    }
                    return false
                })

                if (userOrgByOrgId) {
                    userRole = userOrgByOrgId.role
                } else {
                    // Intentar encontrar por organizationId directo
                    const userOrgByDirectId = userOrgs.find((uo: any) => {
                        return uo.organizationId === currentOrg.id || uo.id === currentOrg.id
                    })

                    if (userOrgByDirectId) {
                        userRole = userOrgByDirectId.role || userOrgByDirectId.userOrganizations?.[0]?.role
                    }
                }

                console.log('✅ useUserRole - Rol detectado:', userRole)
                setRole(userRole || null)
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

    const hasRole = (requiredRole: 'admin' | 'editor'): boolean => {
        if (!role) return false
        // Admin tiene todos los permisos
        if (role === 'admin') return true
        // Editor solo tiene permisos de editor
        return role === requiredRole
    }

    return {
        role,
        isAdmin: role === 'admin',
        isEditor: role === 'editor',
        isLoading,
        hasRole,
    }
}
