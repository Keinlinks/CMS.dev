import { getWallTestimonialsAction } from '@/lib/actions/wall'
import { WallClient, type Testimonial } from './wall-client'
import type { CardLayout } from '@/components/testimonial-card'

interface WallPageProps {
    params: Promise<{ orgId: string }>
    searchParams: Promise<{
        theme?: 'light' | 'dark'
        card?: 'base' | 'minimal' | 'detailed' | 'compact'
        color?: string
        page?: string
        sort?: 'ASC' | 'DESC'
    }>
}

export default async function WallPage({ params, searchParams }: WallPageProps) {
    const { orgId } = await params
    const search = await searchParams

    // Opciones de personalización desde URL
    const theme = search.theme || 'light'
    const cardType: CardLayout = (search.card === 'minimal' || search.card === 'detailed') ? search.card : 'base'
    const primaryColor = search.color || '#3b82f6'
    const page = parseInt(search.page || '1')
    const sort = search.sort || 'DESC'

    // Obtener testimonios del backend
    const result = await getWallTestimonialsAction(orgId, {
        page,
        itemsPerPage: 20,
        sort
    })

    const testimonials = result.success ? (result.data as Testimonial[]) : []

    return (
        <WallClient
            testimonials={testimonials}
            theme={theme}
            cardType={cardType}
            primaryColor={primaryColor}
            error={result.success ? undefined : result.error}
        />
    )
}
