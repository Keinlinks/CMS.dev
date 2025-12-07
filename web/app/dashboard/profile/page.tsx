import { getCurrentUserAction } from '@/lib/actions/users'
import { getCurrentOrganization } from '@/lib/actions/sidebar'
import { ProfileForm } from '@/components/profile/profile-form'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
    // Obtener usuario actual desde el backend
    const userResult = await getCurrentUserAction()

    if (!userResult.success || !userResult.data) {
        redirect('/login')
    }

    const user = userResult.data

    // Obtener organización actual para determinar el rol
    const currentOrg = await getCurrentOrganization()

    // Determinar el rol del usuario en la organización actual
    let userRole = 'viewer'
    if (currentOrg && user.userOrganizations) {
        const orgMembership = user.userOrganizations.find(
            (uo: any) => uo.organizationId === currentOrg.id
        )
        if (orgMembership) {
            userRole = orgMembership.role
        }
    }

    return (
        <div className="p-0">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Perfil de Usuario</h1>
                <p className="text-muted-foreground">
                    Gestiona tu información personal y configuración de cuenta
                </p>
            </div>

            <ProfileForm
                user={{
                    id: user.id,
                    name: user.name || '',
                    username: user.username || '',
                    email: user.email || '',
                }}
                userRole={userRole}
            />
        </div>
    )
}
