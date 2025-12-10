'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createApiClient } from '@/lib/api/client'
import { isCurrentUserAdmin, hasRole } from '@/lib/utils/auth-utils'

/**
 * Obtiene la lista de categorías de la organización actual
 */
export async function getCategoriesAction() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value
        const currentOrgCookie = cookieStore.get('current_organization')?.value

        if (!token || !currentOrgCookie) {
            console.log('⚠️ No token or current organization found')
            return { success: false, error: 'No autenticado', data: [] }
        }

        const currentOrg = JSON.parse(currentOrgCookie)
        console.log('📊 Fetching categories for organization:', currentOrg.id)
        const apiClient = createApiClient(token)

        // El endpoint de categorías filtra automáticamente por organización del token
        const response = await apiClient.categories.categoriesControllerFindAll(
            {
                page: 1,
                itemsPerPage: 100,
            },
            { format: 'json' }
        )

        // Asegurarse de que tenemos un array
        const categories = Array.isArray(response.data) ? response.data : []

        console.log('📦 Categories response:', {
            status: response.status,
            categoriesCount: categories.length,
            isArray: Array.isArray(categories)
        })

        console.log(`✅ Found ${categories.length} categories`)

        return {
            success: true,
            data: categories
        }
    } catch (error: any) {
        console.error('❌ Error getting categories:', {
            message: error.message,
            status: error.status,
            response: error.response
        })
        return {
            success: false,
            error: error.message || 'Error al obtener categorías',
            data: []
        }
    }
}

/**
 * Obtiene una categoría por ID
 */
export async function getCategoryByIdAction(id: string) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('auth_token')?.value

        if (!token) {
            return { success: false, error: 'No autenticado' }
        }

        const apiClient = createApiClient(token)

        const response = await apiClient.categories.categoriesControllerFindOne(
            id,
            { format: 'json' }
        )

        return {
            success: true,
            data: response.data as unknown as any
        }
    } catch (error: any) {
        console.error('Error getting category:', error)
        return {
            success: false,
            error: error.message || 'Error al obtener categoría'
        }
    }
}

