'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createApiClient } from '@/lib/api/client'

// Tipo completo de Organization
interface Organization {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  logoUrl: string | null
  questionText: string | null
}

// Tipo completo de UserOrganization
interface UserOrganization {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  organizationId: string
  role: 'admin' | 'editor'
  organization: Organization
}

// Tipo que devuelve el backend en el login
interface RequestUser {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  username: string
  name: string
  token: string
  tokenExpiredAt: Date
  userOrganizations: UserOrganization[]
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  email: string
  password: string
  name?: string
  lastname?: string
}

export interface AuthResponse {
  token: string
  expiredAt: Date
  redirectPath: string
  user: {
    id: string
    username: string
    email: string
    name?: string
    lastname?: string
  }
}

export interface RegisterResponse {
  message: string
  success: boolean
}

export interface ActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function loginAction(
  credentials: LoginCredentials
): Promise<ActionResponse<AuthResponse>> {
  try {
    console.log('🔐 Intentando login con:', { username: credentials.username })

    // Usar el cliente API generado
    const apiClient = createApiClient()

    const response = await apiClient.auth.authControllerLogin(
      {
        username: credentials.username,
        password: credentials.password,
      },
      { format: 'json' }
    )

    const userData = response.data as unknown as RequestUser

    if (!userData || !userData.id) {
      console.error('❌ Datos de usuario inválidos:', userData)
      throw new Error('Respuesta inválida del servidor')
    }

    console.log('👤 Datos del usuario procesados:', {
      id: userData.id,
      username: userData.username,
      hasToken: !!userData.token,
      hasOrganizations: !!userData.userOrganizations,
      orgCount: userData.userOrganizations?.length || 0,
    })

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    }

    if (credentials.rememberMe) {
      (cookieOptions as any).maxAge = 60 * 60 * 24 * 7
    }

    // Guardar el token en cookies
    const cookieStore = await cookies()
    cookieStore.set('auth_token', userData.token, cookieOptions)

    // Guardar el usuario en cookies (sin el token por seguridad)
    const { token, tokenExpiredAt, ...userInfo } = userData
    cookieStore.set('user', JSON.stringify(userInfo), cookieOptions)

    // Guardar organizaciones completas en cookies
    cookieStore.set(
      'user_organizations',
      JSON.stringify(userData.userOrganizations || []),
      cookieOptions
    )

    // Seleccionar organización por defecto (la primera)
    if (userData.userOrganizations && userData.userOrganizations.length > 0) {
      const defaultOrg = userData.userOrganizations[0].organization
      cookieStore.set(
        'current_organization',
        JSON.stringify(defaultOrg),
        cookieOptions
      )
      console.log('🏢 Organización por defecto:', defaultOrg.name)
    } else {
      console.log('⚠️ Usuario sin organizaciones')
    }

    console.log('🍪 Cookies guardadas correctamente')

    // Revalida para limpiar cualquier dato de sesión cacheado
    revalidatePath('/', 'layout')

    // Determina la redirección basado en si tiene organizaciones
    const hasOrganizations = userData.userOrganizations && userData.userOrganizations.length > 0
    const redirectPath = hasOrganizations ? '/dashboard' : '/create-organization'

    console.log('🎯 Redirigiendo a:', redirectPath, { hasOrganizations, orgCount: userData.userOrganizations?.length || 0 })

    return {
      success: true,
      data: {
        token: userData.token,
        expiredAt: userData.tokenExpiredAt,
        user: userInfo,
        redirectPath,
      },
    }
  } catch (error: any) {
    console.error('❌ Login error:', error)

    // Extraer mensaje de error de la respuesta del API client
    let errorMessage = 'Error de conexión. Por favor intenta nuevamente.'
    if (error?.error?.message) {
      errorMessage = error.error.message
    } else if (typeof error?.error === 'string') {
      errorMessage = error.error
    } else if (error?.message) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function registerAction(
  data: RegisterData
): Promise<ActionResponse<RegisterResponse>> {
  try {
    // Concatenar name y lastname en un solo campo
    const fullName = data.lastname
      ? `${data.name} ${data.lastname}`.trim()
      : data.name || ''

    // Usar el cliente API generado
    const apiClient = createApiClient()

    const response = await apiClient.auth.authControllerRegister(
      {
        username: data.username,
        email: data.email,
        password: data.password,
        name: fullName,
      },
      { format: 'json' }
    )

    const result = response.data as unknown as RegisterResponse

    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    console.error('Register error:', error)

    // Extraer mensaje de error de la respuesta del API client
    let errorMessage = 'Error de conexión. Por favor intenta nuevamente.'
    if (error?.error?.message) {
      errorMessage = error.error.message
    } else if (typeof error?.error === 'string') {
      errorMessage = error.error
    } else if (error?.message) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  cookieStore.delete('user')
  cookieStore.delete('user_organizations')
  cookieStore.delete('current_organization')

  // Revalida para limpiar caché de sesión y dashboard
  revalidatePath('/', 'layout')
  revalidatePath('/dashboard', 'layout')

  redirect('/login')
}

/**
 * Cambia la contraseña del usuario actual
 */
export async function changePasswordAction(data: {
  oldPassword: string
  newPassword: string
}): Promise<ActionResponse<{ message: string }>> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return {
        success: false,
        error: 'No autenticado'
      }
    }

    const apiClient = createApiClient(token)

    await apiClient.auth.authControllerChangePassword(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      } as any,
      { format: 'json' }
    )

    return {
      success: true,
      data: { message: 'Contraseña actualizada exitosamente' }
    }
  } catch (error: any) {
    console.error('Change password error:', error)

    let errorMessage = 'Error al cambiar la contraseña'
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
 * Valida el token actual del usuario
 */
export async function validateTokenAction(): Promise<ActionResponse<{ valid: boolean }>> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return {
        success: false,
        error: 'No hay token'
      }
    }

    const apiClient = createApiClient(token)

    await apiClient.auth.authControllerValidateToken({ format: 'json' })

    return {
      success: true,
      data: { valid: true }
    }
  } catch (error: any) {
    console.error('Validate token error:', error)

    return {
      success: false,
      error: 'Token inválido o expirado'
    }
  }
}
