'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createApiClient } from '@/lib/api/client'
import { isCurrentUserAdmin, hasRole } from '@/lib/utils/auth-utils'
import { TestimonialStatus, getSuccessMessage } from '@/lib/types/testimonial-status'
import type { ChangeStatusDto } from '@/lib/types/api-dtos'

/**
 * Obtiene la lista de testimonios con filtros opcionales
 */
export async function getTestimonialsAction(filters?: {
    status?: string
    categoryId?: string
    page?: number
    itemsPerPage?: number
}) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value
        const currentOrgCookie = cookieStore.get('current_organization')?.value

        if (!token || !currentOrgCookie) {
            return { success: false, error: 'No autenticado', data: [] }
        }

        const currentOrg = JSON.parse(currentOrgCookie)
        const apiClient = createApiClient(token)

        const response = await apiClient.testimonials.testimonialsControllerFindAll(
            {
                organitationId: currentOrg.id,
                status: filters?.status,
                page: filters?.page || 1,
                itemsPerPage: filters?.itemsPerPage || 10,
            },
            { format: 'json' }
        )

        const testimonials = response.data as unknown as any[]

        // La API no devuelve metadata de paginación, así que calculamos el total
        // Nota: Esto es una limitación - idealmente la API debería devolver el total
        return {
            success: true,
            data: testimonials,
            pagination: {
                page: filters?.page || 1,
                itemsPerPage: filters?.itemsPerPage || 10,
                total: testimonials.length, // Esto solo muestra los items de la página actual
            }
        }
    } catch (error: any) {
        console.error('Error getting testimonials:', error)
        return {
            success: false,
            error: error.message || 'Error al obtener testimonios',
            data: []
        }
    }
}

/**
 * Obtiene un testimonio por ID
 */
export async function getTestimonialByIdAction(id: string) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return { success: false, error: 'No autenticado' }
        }

        const apiClient = createApiClient(token)

        const response = await apiClient.testimonials.testimonialsControllerFindOne(
            id,
            { format: 'json' }
        )

        return {
            success: true,
            data: response.data as unknown as any
        }
    } catch (error: any) {
        console.error('Error getting testimonial:', error)
        return {
            success: false,
            error: error.message || 'Error al obtener testimonio'
        }
    }
}

/**
 * Cambia el estado de un testimonio usando el endpoint correcto del backend
 * 
 * @param testimonialId - ID del testimonio a actualizar
 * @param newStatus - Nuevo estado del testimonio
 * @returns Resultado de la operación con success y mensaje
 */
export async function changeTestimonialStatusAction(
    testimonialId: string,
    newStatus: TestimonialStatus
) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return { success: false, error: 'No autenticado' }
        }

        const apiClient = createApiClient(token)

        // ✅ Usar el endpoint correcto POST /testimonials/change-status
        const payload: ChangeStatusDto = {
            testimonialId,
            status: newStatus
        }

        await apiClient.testimonials.testimonialsControllerChangeStatus(
            payload as any, // El DTO está como 'object' en Api.ts generado
            { format: 'json' }
        )

        // Revalidar rutas para actualizar datos
        revalidatePath('/dashboard/testimonials')
        revalidatePath('/dashboard')

        return {
            success: true,
            message: getSuccessMessage(newStatus)
        }
    } catch (error: any) {
        console.error('Error changing testimonial status:', error)

        // Extraer mensaje de error del backend
        let errorMessage = 'Error al cambiar el estado del testimonio'
        if (error?.error?.message) {
            errorMessage = error.error.message
        } else if (typeof error?.error === 'string') {
            errorMessage = error.error
        } else if (error?.message) {
            errorMessage = error.message
        }

        return {
            success: false,
            error: errorMessage
        }
    }
}

/**
 * Elimina un testimonio rechazado (Solo Admin)
 */
export async function deleteTestimonialAction(testimonialId: string) {
    try {
        // Verificar permisos - Solo Admin puede eliminar
        const isAdmin = await isCurrentUserAdmin()

        if (!isAdmin) {
            return {
                success: false,
                error: 'Solo los administradores pueden eliminar testimonios'
            }
        }

        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return { success: false, error: 'No autenticado' }
        }

        const apiClient = createApiClient(token)

        // Eliminar testimonio
        await apiClient.testimonials.testimonialsControllerRemove(testimonialId)

        // Revalidar rutas
        revalidatePath('/dashboard/testimonials')
        revalidatePath('/dashboard')

        return { success: true, message: 'Testimonio eliminado exitosamente' }
    } catch (error: any) {
        console.error('Error deleting testimonial:', error)
        return {
            success: false,
            error: error.message || 'Error al eliminar testimonio'
        }
    }
}

/**
 * Actualiza los datos de un testimonio
 */
export async function updateTestimonialAction(
    testimonialId: string,
    data: any
) {
    try {
        // Verificar permisos - Editor y Admin pueden actualizar
        const canUpdate = await hasRole('editor')

        if (!canUpdate) {
            return {
                success: false,
                error: 'No tienes permisos para actualizar testimonios'
            }
        }

        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return { success: false, error: 'No autenticado' }
        }

        const apiClient = createApiClient(token)

        // Actualizar testimonio
        await apiClient.testimonials.testimonialsControllerUpdate(
            testimonialId,
            data,
            { format: 'json' }
        )

        // Revalidar rutas
        revalidatePath('/dashboard/testimonials')
        revalidatePath('/dashboard')

        return { success: true, message: 'Testimonio actualizado exitosamente' }
    } catch (error: any) {
        console.error('Error updating testimonial:', error)
        return {
            success: false,
            error: error.message || 'Error al actualizar testimonio'
        }
    }
}
