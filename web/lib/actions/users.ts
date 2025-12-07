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
        const response = await apiClient.users.usersControllerFindOne(
            user.id,
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
        await apiClient.users.usersControllerUpdate(
            user.id,
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

/**
 * Obtiene la lista de todos los usuarios (Solo Admin)
 */
export async function getUsersAction() {
    try {
        // Verificar permisos - Solo Admin puede ver todos los usuarios
        const isAdmin = await isCurrentUserAdmin()

        if (!isAdmin) {
            return {
                success: false,
                error: 'Solo los administradores pueden ver todos los usuarios'
            }
        }

        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return { success: false, error: 'No autenticado' }
        }

        const apiClient = createApiClient(token)

        const response = await apiClient.users.usersControllerFindAll({
            format: 'json'
        })

        return {
            success: true,
            data: response.data as unknown as any[]
        }
    } catch (error: any) {
        console.error('Error getting users:', error)
        return {
            success: false,
            error: error.message || 'Error al obtener usuarios'
        }
    }
}

/**
 * Elimina un usuario (Solo Admin)
 */
export async function deleteUserAction(userId: string) {
    try {
        // Verificar permisos - Solo Admin puede eliminar usuarios
        const isAdmin = await isCurrentUserAdmin()

        if (!isAdmin) {
            return {
                success: false,
                error: 'Solo los administradores pueden eliminar usuarios'
            }
        }

        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return { success: false, error: 'No autenticado' }
        }

        const apiClient = createApiClient(token)

        // Eliminar usuario
        await apiClient.users.usersControllerRemove(userId)

        return { success: true, message: 'Usuario eliminado exitosamente' }
    } catch (error: any) {
        console.error('Error deleting user:', error)
        return {
            success: false,
            error: error.message || 'Error al eliminar usuario'
        }
    }
}
