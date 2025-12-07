import { cookies } from 'next/headers'

/**
 * Obtiene el rol del usuario en la organización actual desde las cookies del servidor
 */
export async function getUserRoleInCurrentOrg(): Promise<string | null> {
    try {
        const cookieStore = await cookies()
        const currentOrgCookie = cookieStore.get('current_organization')?.value
        const userOrgsCookie = cookieStore.get('user_organizations')?.value

        if (!currentOrgCookie || !userOrgsCookie) {
            return null
        }

        const currentOrg = JSON.parse(currentOrgCookie)
        const userOrgs = JSON.parse(userOrgsCookie)

        // Buscar el rol del usuario en la organización actual
        const userOrgRelation = userOrgs.find((uo: any) => {
            if (uo.organization) {
                return uo.organization.id === currentOrg.id
            }
            return uo.organizationId === currentOrg.id
        })

        const role = userOrgRelation?.role || null

        console.log('✅ getUserRoleInCurrentOrg:', {
            currentOrgId: currentOrg.id,
            role,
            hasRelation: !!userOrgRelation
        })

        return role
    } catch (error) {
        console.error('❌ Error getting user role:', error)
        return null
    }
}
