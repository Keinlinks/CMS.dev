import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Definir rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register']
const authRoutes = ['/login', '/register']

// Definir mapeos de rutas basadas en roles



export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Obtener token y usuario de las cookies
   /* const token = request.cookies.get('auth_token')?.value
    const userCookie = request.cookies.get('user')?.value

    let user: { role: string } | null = null
    if (userCookie) {
        try {
            user = JSON.parse(userCookie)
        } catch {
            // Cookie de usuario inválida
        }
    }

    const isAuthenticated = !!token && !!user
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    // Si el usuario está autenticado e intenta acceder a rutas de autenticación, redirigir al dashboard
    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Si el usuario no está autenticado e intenta acceder a rutas protegidas
    if (!isAuthenticated && !isPublicRoute) {
        // No usar callbackUrl, simplemente redirigir al login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Comprobar acceso basado en el rol
    if (isAuthenticated && user) {
        const userRole = user.role as string
        const allowedRoutes = roleRoutes[userRole] || []

        // Permitir acceso a la página dashboard principal para que pueda hacer la redirección
        if (pathname === '/dashboard') {
            return NextResponse.next()
        }

        // Comprobar si la ruta actual requiere un rol específico
        const requiresAuth = !isPublicRoute
        const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route)) ||
            isPublicRoute ||
            pathname === '/'

        if (requiresAuth && !hasAccess) {
            // El usuario no tiene acceso a esta ruta, redirigir a su ruta predeterminada
            const defaultPath = defaultRolePaths[userRole] || '/dashboard'
            return NextResponse.redirect(new URL(defaultPath, request.url))
        }
    }

    return NextResponse.next()*/
}

// Configurar en qué rutas se ejecuta el middleware
export const config = {
    matcher: [
        /*
         * Coincide con todas las rutas de solicitud excepto:
         * - api (rutas API)
         * - _next/static (archivos estáticos)
         * - _next/image (archivos de optimización de imágenes)
         * - favicon.ico (archivo favicon)
         * - carpeta public
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}