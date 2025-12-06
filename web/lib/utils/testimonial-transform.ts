/**
 * Transforma los datos del backend al formato esperado por TestimonialCard
 */
export function transformTestimonialForCard(testimonial: any) {
    return {
        id: testimonial.id,
        title: testimonial.title,
        content: testimonial.content,
        stars_rating: testimonial.stars_rating || 5,
        media_type: testimonial.media_type || 'text',
        media_url: testimonial.media_url || null,
        created_at: testimonial.createdAt || new Date().toISOString(),
        author: {
            name: testimonial.client_name,
            title: testimonial.client_email,
            avatar: undefined // El backend no retorna avatar
        },
        category: testimonial.category_name ? {
            name: testimonial.category_name
        } : undefined,
        tags: testimonial.tagIds || []
    }
}
