'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Organization {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    description: string
    logoUrl: string | null
    questionText: string | null
}

interface UserOrganization {
    id: string
    createdAt: Date
    updatedAt: Date
    userId: string
    organizationId: string
    role: 'admin' | 'editor'
    organization: Organization
}

interface OrganizationContextType {
    currentOrganization: Organization | null
    userOrganizations: UserOrganization[]
    setCurrentOrganization: (org: Organization) => void
    isLoading: boolean
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: ReactNode }) {
    const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null)
    const [userOrganizations, setUserOrganizations] = useState<UserOrganization[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Leer de cookies
        const cookies = document.cookie.split('; ')

        const currentOrgCookie = cookies.find((c) => c.startsWith('current_organization='))
        const userOrgsCookie = cookies.find((c) => c.startsWith('user_organizations='))

        if (currentOrgCookie) {
            try {
                const org = JSON.parse(decodeURIComponent(currentOrgCookie.split('=')[1]))
                setCurrentOrganizationState(org)
            } catch {
                // Cookie inválida
            }
        }

        if (userOrgsCookie) {
            try {
                const orgs = JSON.parse(decodeURIComponent(userOrgsCookie.split('=')[1]))
                setUserOrganizations(orgs)
            } catch {
                // Cookie inválida
            }
        }

        setIsLoading(false)
    }, [])

    const setCurrentOrganization = (org: Organization) => {
        setCurrentOrganizationState(org)
        // Guardar en cookie
        document.cookie = `current_organization=${encodeURIComponent(JSON.stringify(org))}; path=/`
    }

    return (
        <OrganizationContext.Provider
            value={{
                currentOrganization,
                userOrganizations,
                setCurrentOrganization,
                isLoading,
            }}
        >
            {children}
        </OrganizationContext.Provider>
    )
}

export function useOrganization() {
    const context = useContext(OrganizationContext)
    if (!context) {
        throw new Error('useOrganization must be used within OrganizationProvider')
    }
    return context
}
