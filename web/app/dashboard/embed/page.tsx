import { cookies } from 'next/headers'
import { EmbedEditor } from '@/components/dashboard/embed-editor'

export default async function EmbedPage() {
    // Obtener organización actual
    const cookieStore = await cookies()
    const currentOrgCookie = cookieStore.get('current_organization')?.value

    if (!currentOrgCookie) {
        return (
            <div className="p-0">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Muro de Testimonios</h1>
                    <p className="text-muted-foreground">
                        Selecciona una organización para configurar el muro
                    </p>
                </div>
            </div>
        )
    }

    const currentOrg = JSON.parse(currentOrgCookie)

    return (
        <div className="p-0">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Muro de Testimonios</h1>
                <p className="text-muted-foreground">
                    Personaliza y obtén el código para insertar el muro en tu sitio web
                </p>
            </div>

            <EmbedEditor organizationId={currentOrg.id} />
        </div>
    )
}
