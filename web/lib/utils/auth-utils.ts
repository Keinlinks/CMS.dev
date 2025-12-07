import { cookies } from 'next/headers'

/**
 * Obtiene el rol del usuario en la organización actual
 * @returns El rol del usuario ('admin' | 'editor') o null si no se encuentra
 */
export async function getCurrentUserRole(): Promise<'admin' | 'editor' | null> {
    try {
        const cookieStore = await cookies()

        const currentOrgCookie = cookieStore.get('current_organization')?.value
        const userOrgsCookie = cookieStore.get('user_organizations')?.value

        if (!currentOrgCookie || !userOrgsCookie) {
            return null
        }

        const currentOrg = JSON.parse(currentOrgCookie)
        const userOrgs = JSON.parse(userOrgsCookie)

        const currentUserOrg = userOrgs.find(
            (uo: any) => uo.organizationId === currentOrg.id
        )

        return currentUserOrg?.role || null
    } catch (error) {
        console.error('Error getting current user role:', error)
        return null
    }
}

/**
 * Verifica si el usuario es admin en la organización actual
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
    const role = await getCurrentUserRole()
    return role === 'admin'
}

/**
 * Verifica si el usuario tiene un rol específico en la organización actual
 */
export async function hasRole(requiredRole: 'admin' | 'editor'): Promise<boolean> {
    const role = await getCurrentUserRole()
    if (!role) return false

    // Admin tiene todos los permisos
    if (role === 'admin') return true

    // Editor solo tiene permisos de editor
    return role === requiredRole
}
