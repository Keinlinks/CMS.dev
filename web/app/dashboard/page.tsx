import { getTestimonialStatsAction } from '@/lib/actions/sidebar'
import Link from 'next/link'
import { TrendingUp, Clock, CheckCircle2, Eye, XCircle } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await getTestimonialStatsAction()

  const statCards = [
    {
      title: 'Total',
      value: stats.total,
      href: '/dashboard/testimonials',
      gradient: 'from-blue-500 to-blue-600',
      icon: TrendingUp,
      description: 'Todos los testimonios',
      // change: '+12%'
    },
    {
      title: 'Pendientes',
      value: stats.pending,
      href: '/dashboard/testimonials?status=pending',
      gradient: 'from-yellow-500 to-orange-500',
      icon: Clock,
      description: 'Esperando revisión',
      change: `${stats.pending} nuevos`
    },
    {
      title: 'Aprobados',
      value: stats.approved,
      href: '/dashboard/testimonials?status=approved',
      gradient: 'from-blue-500 to-cyan-500',
      icon: CheckCircle2,
      description: 'Listos para publicar',
      change: 'Revisar'
    },
    {
      title: 'Publicados',
      value: stats.published,
      href: '/dashboard/testimonials?status=published',
      gradient: 'from-green-500 to-emerald-600',
      icon: Eye,
      description: 'Visibles en el muro',
      change: 'En vivo'
    },
    {
      title: 'Rechazados',
      value: stats.rejected,
      href: '/dashboard/testimonials?status=rejected',
      gradient: 'from-red-500 to-pink-600',
      icon: XCircle,
      description: 'No aprobados',
      change: `${stats.rejected} total`
    }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Resumen de tus testimonios y actividad reciente
        </p>
      </div>

      {/* Estadísticas con gradientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              <div className="relative p-6 space-y-3">
                {/* Icon y valor */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </div>
                  </div>
                </div>

                {/* Título y descripción */}
                <div>
                  <h3 className="font-semibold text-sm">{stat.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>

                {/* Indicador de hover */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Ver detalles</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Acciones Rápidas y Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Acciones Rápidas */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="border-b bg-muted/50 px-6 py-4">
            <h2 className="text-xl font-semibold">Acciones Rápidas</h2>
          </div>
          <div className="p-6 space-y-2">
            <Link
              href="/dashboard/testimonials?status=pending"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Revisar Pendientes</div>
                <div className="text-sm text-muted-foreground">
                  {stats.pending} testimonios esperando
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </div>
            </Link>

            <Link
              href="/dashboard/categories"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium">Gestionar Categorías</div>
                <div className="text-sm text-muted-foreground">
                  Organiza tus testimonios
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/embed"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-medium">Configurar Muro</div>
                <div className="text-sm text-muted-foreground">
                  Personaliza el embed
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="border-b bg-muted/50 px-6 py-4">
            <h2 className="text-xl font-semibold">Actividad Reciente</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                No hay actividad reciente
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Las acciones aparecerán aquí
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
