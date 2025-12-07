'use server'

import { createApiClient } from '@/lib/api/client'

export interface WallTestimonialsOptions {
    page?: number
    itemsPerPage?: number
    sort?: 'ASC' | 'DESC'
}

/**
 * Obtiene testimonios publicados de una organización para el muro público
 * No requiere autenticación (endpoint público)
 */
export async function getWallTestimonialsAction(
    organizationId: string,
    options?: WallTestimonialsOptions
) {
    try {
        // No necesita token porque el endpoint es público
        const apiClient = createApiClient()

        const response = await apiClient.testimonials.testimonialsControllerWallTestimonials(
            {
                organitationId: organizationId,
                page: options?.page || 1,
                itemsPerPage: options?.itemsPerPage || 20,
                sort: options?.sort || 'DESC'
            },
            { format: 'json' }
        )

        return {
            success: true,
            data: response.data || []
        }
    } catch (error: any) {
        console.error('Error fetching wall testimonials:', error)

        return {
            success: false,
            error: error.message || 'Error al cargar testimonios del muro',
            data: []
        }
    }
}
