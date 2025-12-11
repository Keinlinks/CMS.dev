import { Suspense } from 'react'
import Link from 'next/link'
import { getTestimonialsAction } from '@/lib/actions/testimonials'
import { TestimonialActions } from '@/components/dashboard/testimonial-actions'
import { UserAvatar } from '@/components/ui/user-avatar'
import { Pagination } from '@/components/ui/pagination'
import { CheckCircle2, Clock, Eye, XCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'
import { getUserRoleInCurrentOrg } from '@/lib/actions/user-role'
import { TestimonialFilters } from '@/components/dashboard/testimonials-filters'

// Función para obtener el color del badge según el status
function getStatusBadgeColor(status: string) {
  const statusUpper = status?.toUpperCase()
  switch (statusUpper) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'APPROVED':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'REJECTED':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

// Función para obtener el icono del status
function getStatusIcon(status: string) {
  const statusUpper = status?.toUpperCase()
  switch (statusUpper) {
    case 'PUBLISHED':
      return Eye
    case 'APPROVED':
      return CheckCircle2
    case 'PENDING':
      return Clock
    case 'REJECTED':
      return XCircle
    default:
      return Clock
  }
}

// Función para obtener el texto del status en español
function getStatusText(status: string) {
  const statusUpper = status?.toUpperCase()
  switch (statusUpper) {
    case 'PUBLISHED':
      return 'Publicado'
    case 'APPROVED':
      return 'Aprobado'
    case 'PENDING':
      return 'Pendiente'
    case 'REJECTED':
      return 'Rechazado'
    default:
      return status
  }
}

async function TestimonialsContent({
  status,
  page,
  from,
  to,
  rating
}: {
  status?: string
  page?: string
  from?: string
  to?: string
  rating?: string
}) {
  // Obtener rol del usuario
  const userRole = await getUserRoleInCurrentOrg()

  // Obtener testimonios del backend
  // La API espera el status en minúsculas: "pending", "approved", "published", "rejected"
  const statusFilter = status?.toLowerCase()
  const result = await getTestimonialsAction({
    status: statusFilter,
    page: parseInt(page || '1'),
    itemsPerPage: 50,
    from: from,
    to: to,
    rating: rating ? parseInt(rating) : undefined
  })

  const testimonials = result.success ? result.data : []
  const pagination = result.success && result.pagination ? result.pagination : null

  // Determinar el título según el filtro
  const getTitle = () => {
    if (!status) return 'Todos los Testimonios'
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Testimonios Pendientes'
      case 'approved':
        return 'Testimonios Aprobados'
      case 'published':
        return 'Testimonios Publicados'
      case 'rejected':
        return 'Testimonios Rechazados'
      default:
        return 'Testimonios'
    }
  }

  return (
    <div className="p-0">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{getTitle()}</h1>
            <p className="text-muted-foreground">
              {status
                ? `Mostrando ${testimonials.length} testimonio(s) con estado "${getStatusText(status)}"`
                : `Mostrando todos los ${testimonials.length} testimonios`}
            </p>
          </div>

          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/embed" target="_blank">
              <ExternalLink className="w-4 h-4" />
              Ver mi Muro
            </Link>
          </Button>
        </div>

        <TestimonialFilters />
      </div>

      {!result.success && (
        <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-lg mb-6">
          <p className="text-lg text-red-600 dark:text-red-400">
            Error al cargar testimonios: {result.error}
          </p>
        </div>
      )}

      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-lg text-muted-foreground">
            No hay testimonios {status ? `con estado "${getStatusText(status)}"` : 'disponibles'}
          </p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {/* Título - Siempre visible */}
                <th className="text-left p-4 font-semibold">Título</th>

                {/* Autor - Oculto en móvil, visible desde md (768px+) */}
                <th className="hidden md:table-cell text-left p-4 font-semibold">Autor</th>

                {/* Categoría - Oculto hasta lg (1024px+) */}
                <th className="hidden lg:table-cell text-left p-4 font-semibold">Categoría</th>

                {/* Rating - Oculto en móvil, visible desde md */}
                <th className="hidden md:table-cell text-left p-4 font-semibold">Rating</th>

                {/* Estado - Siempre visible */}
                <th className="text-left p-4 font-semibold">Estado</th>

                {/* Fecha - Oculto hasta lg */}
                <th className="hidden lg:table-cell text-left p-4 font-semibold">Fecha</th>

                {/* Acciones - Siempre visible */}
                <th className="text-left p-4 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial: any, index: number) => {
                const StatusIcon = getStatusIcon(testimonial.status)
                return (
                  <tr
                    key={testimonial.id}
                    className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                      }`}
                  >
                    {/* Título - Siempre visible */}
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-xs">{testimonial.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {testimonial.content}
                        </div>
                        {/* Info adicional visible solo en móvil */}
                        <div className="md:hidden mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="text-yellow-500">★ {testimonial.stars_rating || 5}</span>
                          <span>•</span>
                          <span>{testimonial.client_name}</span>
                        </div>
                      </div>
                    </td>

                    {/* Autor - Oculto en móvil */}
                    <td className="hidden md:table-cell p-4 mx-2">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={testimonial.client_name} size="xs" />
                        <div>
                          <div className="text-xs font-medium">
                            {testimonial.client_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {testimonial.client_email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Categoría - Oculto hasta lg */}
                    <td className="hidden lg:table-cell p-4">
                      <span className="text-xs">{testimonial.category_name || 'Sin categoría'}</span>
                    </td>

                    {/* Rating - Oculto en móvil */}
                    <td className="hidden md:table-cell p-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs font-medium">
                          {testimonial.stars_rating || 5}
                        </span>
                      </div>
                    </td>

                    {/* Estado - Siempre visible */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium ${getStatusBadgeColor(
                          testimonial.status
                        )}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{getStatusText(testimonial.status)}</span>
                      </span>
                    </td>

                    {/* Fecha - Oculto hasta lg */}
                    <td className="hidden lg:table-cell p-4">
                      <span className="text-xs text-muted-foreground">
                        {testimonial.createdAt
                          ? new Date(testimonial.createdAt).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          })
                          : 'N/A'}
                      </span>
                    </td>

                    {/* Acciones - Siempre visible */}
                    <td className="p-4">
                      <TestimonialActions testimonial={testimonial} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default async function TestimonialsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; page?: string; from?: string; to?: string; rating?: string }>
}) {
  const params = await searchParams
  return (
    <Suspense fallback={<div>Cargando testimonios...</div>}>
      <TestimonialsContent
        status={params.status}
        page={params.page}
        from={params.from}
        to={params.to}
        rating={params.rating}
      />
    </Suspense>
  )
}