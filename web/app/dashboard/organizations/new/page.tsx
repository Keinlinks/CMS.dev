'use client'

import { SpaceForm } from '@/components/forms/space-form'
import { useEffect, useState } from 'react'

export default function NewOrganizationPage() {
    const [hasOrganizations, setHasOrganizations] = useState(true)

    useEffect(() => {
        // Leer cookies del cliente
        const cookies = document.cookie.split('; ')
        const orgCookie = cookies.find((c) => c.startsWith('user_organizations='))

        if (orgCookie) {
            try {
                const orgs = JSON.parse(decodeURIComponent(orgCookie.split('=')[1]))
                setHasOrganizations(orgs && orgs.length > 0)
            } catch {
                setHasOrganizations(false)
            }
        } else {
            setHasOrganizations(false)
        }
    }, [])

    return (
        <div className="p-0">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">
                    {hasOrganizations ? 'Nueva Organización' : 'Crea tu Organización'}
                </h1>
                <p className="text-muted-foreground">
                    {hasOrganizations
                        ? 'Completa el formulario para agregar una nueva organización'
                        : 'Para comenzar, necesitas crear tu primera organización'}
                </p>
            </div>

            <SpaceForm />
        </div>
    )
}
