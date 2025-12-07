'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createApiClient } from '@/lib/api/client'
import { ActionResponse } from './auth'

export interface CreateOrganizationData {
  name: string
  description?: string
  questionText?: string
}

export interface Organization {
  id: string
  name: string
  description: string
  logoUrl?: string
  questionText?: string
  createdAt: Date
  updatedAt: Date
}

export async function createOrganizationAction(
  data: CreateOrganizationData
): Promise<ActionResponse<Organization>> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      redirect('/login')
    }

    const apiClient = createApiClient(token)

    // 1. Crear la organización
    const response = await apiClient.organizations.organizationsControllerCreate(
      {
        name: data.name,
        description: data.description,
        questionText: data.questionText,
      },
      { format: 'json' }
    )

    const organization = response.data as unknown as Organization

    console.log('✅ Organización creada:', organization)

    // 2. Obtener las organizaciones actualizadas del usuario
    const userOrgsResponse = await apiClient.organizations.organizationsControllerFindUserOrganizations(
      { format: 'json' }
    )

    // La respuesta del backend es un array de UserOrganization (con organization anidado)
    const userOrganizations = userOrgsResponse.data as unknown as any[]

    console.log('📋 Organizaciones del usuario actualizadas:', userOrganizations)

    // 3. Actualizar cookies con las organizaciones
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    }

    // Guardar organizaciones completas en cookies (mismo formato que en login)
    cookieStore.set(
      'user_organizations',
      JSON.stringify(userOrganizations || []),
      cookieOptions
    )

    // Establecer la organización recién creada como actual
    // Si userOrganizations tiene elementos, usar el primero (que debería ser el recién creado)
    if (userOrganizations && userOrganizations.length > 0) {
      const currentOrg = userOrganizations[0].organization || organization
      cookieStore.set(
        'current_organization',
        JSON.stringify(currentOrg),
        cookieOptions
      )
      console.log('🏢 Organización actual establecida:', currentOrg.name)
    } else {
      // Fallback: usar la organización que acabamos de crear
      cookieStore.set(
        'current_organization',
        JSON.stringify(organization),
        cookieOptions
      )
    }

    console.log('🍪 Cookies actualizadas con nueva organización')

    // 4. Revalidar rutas
    revalidatePath('/dashboard/organizations')
    revalidatePath('/dashboard')
    revalidatePath('/', 'layout')

    return {
      success: true,
      data: organization,
    }
  } catch (error: any) {
    console.error('Create organization error:', error)

    // Extract error message from response
    let errorMessage = 'Error de conexión. Por favor intenta nuevamente.'
    if (error?.error?.message) {
      errorMessage = error.error.message
    } else if (error?.error?.error) {
      errorMessage = error.error.error
    } else if (typeof error?.error === 'string') {
      errorMessage = error.error
    }

    // If unauthorized, redirect to login
    if (error?.error?.statusCode === 401 || error?.status === 401) {
      redirect('/login')
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

// arreglar el erro de in organizacion, no muestra el boton de organizacion
// ver el error, de volver sin credenciales al dashboar, controlar desde la pagina dashboard,