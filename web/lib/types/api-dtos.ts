/**
 * DTO para cambiar el estado de un testimonio
 * Definido manualmente porque el generador de API lo dejó como 'object'
 */
export interface ChangeStatusDto {
    testimonialId: string
    status: 'pending' | 'approved' | 'rejected' | 'published'
}
