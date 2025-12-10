'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createApiClient } from '@/lib/api/client'
import { isCurrentUserAdmin } from '@/lib/utils/auth-utils'

/**
 * Obtiene el usuario actual desde el backend
 */
export async function getCurrentUserAction() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value
        const userCookie = cookieStore.get('user')?.value

        if (!token || !userCookie) {
            return { success: false, error: 'No autenticado' }
        }

        const user = JSON.parse(userCookie)
        const apiClient = createApiClient(token)

        // Obtener datos actualizados del usuario desde el backend
        const response = await apiClient.users.usersControllerFindMe(
            { format: 'json' }
        )

        return {
            success: true,
            data: response.data as unknown as any
        }
    } catch (error: any) {
        console.error('Error getting current user:', error)
        return {
            success: false,
            error: error.message || 'Error al obtener usuario'
        }
    }
}

/**
 * Actualiza el perfil del usuario actual
 */
export async function updateUserAction(data: {
    name?: string
    lastname?: string
    username?: string
    email?: string
}) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value
        const userCookie = cookieStore.get('user')?.value

        if (!token || !userCookie) {
            return { success: false, error: 'No autenticado' }
        }

        const user = JSON.parse(userCookie)
        const apiClient = createApiClient(token)

        // Actualizar usuario en el backend
        await apiClient.users.usersControllerUpdateMe(
            data as any,
            { format: 'json' }
        )

        // Actualizar cookie del usuario con los nuevos datos
        const updatedUser = {
            ...user,
            ...data,
            // Si se actualizó name o lastname, actualizar el nombre completo
            name: data.name || user.name,
        }

        cookieStore.set('user', JSON.stringify(updatedUser), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        })

        // Revalidar rutas
        revalidatePath('/dashboard/profile')

        return { success: true, message: 'Perfil actualizado exitosamente' }
    } catch (error: any) {
        console.error('Error updating user:', error)
        return {
            success: false,
            error: error.message || 'Error al actualizar perfil'
        }
    }
}
