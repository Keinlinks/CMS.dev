'use client'

import { SpaceForm } from '@/components/forms/space-form'

export default function CreateOrganizationPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
            <div className="w-full max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2">Crea tu Organización</h1>
                    <p className="text-muted-foreground text-lg">
                        Para comenzar, necesitas crear tu primera organización
                    </p>
                </div>

                <SpaceForm />
            </div>
        </div>
    )
}
