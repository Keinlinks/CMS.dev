import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/', '/login', '/register']
const authRoutes = ['/login', '/register']

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Obtener token y organizaciones de cookies
    const token = request.cookies.get('auth_token')?.value
    const userOrgsString = request.cookies.get('user_organizations')?.value

    let userOrganizations = []
    if (userOrgsString) {
        try {
            userOrganizations = JSON.parse(userOrgsString)
        } catch {
            // Cookie inválida
        }
    }

    const isAuthenticated = !!token
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
    const isCreateOrgRoute = pathname === '/create-organization'

    // Si autenticado e intenta acceder a login/register → redirigir según organizaciones
    if (isAuthenticated && isAuthRoute) {
        // Si no tiene organizaciones, ir a crear organización
        if (!userOrganizations || userOrganizations.length === 0) {
            return NextResponse.redirect(new URL('/create-organization', request.url))
        }
        // Si tiene organizaciones, ir al dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Si no autenticado e intenta acceder a rutas protegidas → redirigir a login
    if (!isAuthenticated && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Si autenticado y en create-organization
    if (isAuthenticated && isCreateOrgRoute) {
        // Si ya tiene organizaciones, redirigir al dashboard
        if (userOrganizations && userOrganizations.length > 0) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        // Si no tiene organizaciones, permitir acceso
        return NextResponse.next()
    }

    // Si autenticado y en dashboard, verificar organizaciones
    if (isAuthenticated && pathname.startsWith('/dashboard')) {
        // Si no tiene organizaciones, redirigir a crear
        if (!userOrganizations || userOrganizations.length === 0) {
            return NextResponse.redirect(new URL('/create-organization', request.url))
        }

        // Agregar headers de no-cache para páginas protegidas
        const response = NextResponse.next()
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
        return response
    }

    return NextResponse.next()
}

// Configurar en qué rutas se ejecuta el proxy
export const config = {
    matcher: [
        /*
         * Coincide con todas las rutas excepto:
         * - api (rutas API)
         * - _next/static (archivos estáticos)
         * - _next/image (archivos de optimización de imágenes)
         * - favicon.ico (archivo favicon)
         * - archivos de imágenes
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
