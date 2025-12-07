"use client"

import { createContext, useContext } from "react"

interface UserRoleContextType {
    role: string | null
    isAdmin: boolean
    isEditor: boolean
    hasRole: (requiredRole: 'admin' | 'editor') => boolean
}

const UserRoleContext = createContext<UserRoleContextType | null>(null)

export function UserRoleProvider({
    children,
    role
}: {
    children: React.ReactNode
    role: string | null
}) {
    const isAdmin = role === 'admin'
    const isEditor = role === 'editor'

    const hasRole = (requiredRole: 'admin' | 'editor'): boolean => {
        if (!role) return false
        // Admin tiene todos los permisos
        if (role === 'admin') return true
        // Editor solo tiene permisos de editor
        return role === requiredRole
    }

    const value: UserRoleContextType = {
        role,
        isAdmin,
        isEditor,
        hasRole,
    }

    console.log('🔧 UserRoleProvider initialized:', { role, isAdmin, isEditor })

    return (
        <UserRoleContext.Provider value={value}>
            {children}
        </UserRoleContext.Provider>
    )
}

export function useUserRole(): UserRoleContextType {
    const context = useContext(UserRoleContext)

    if (!context) {
        throw new Error('useUserRole must be used within UserRoleProvider')
    }

    console.log('📞 useUserRole called, context:', context)

    return context
}
