/**
 * Estados posibles de un testimonio en el sistema
 * 
 * @enum {string}
 */
export enum TestimonialStatus {
    /** Testimonio recién creado, esperando revisión */
    PENDING = 'pending',

    /** Testimonio aprobado por Editor o Admin, listo para publicación */
    APPROVED = 'approved',

    /** Testimonio rechazado, puede ser eliminado por Admin */
    REJECTED = 'rejected',

    /** Testimonio publicado y visible en el muro público */
    PUBLISHED = 'published',
}

/**
 * Obtiene el texto en español para mostrar en la UI
 */
export function getStatusText(status: string): string {
    const statusUpper = status?.toUpperCase()
    switch (statusUpper) {
        case 'PENDING':
            return 'Pendiente'
        case 'APPROVED':
            return 'Aprobado'
        case 'PUBLISHED':
            return 'Publicado'
        case 'REJECTED':
            return 'Rechazado'
        default:
            return status
    }
}

/**
 * Obtiene el mensaje de éxito apropiado según el estado aplicado
 */
export function getSuccessMessage(status: TestimonialStatus): string {
    switch (status) {
        case TestimonialStatus.APPROVED:
            return 'Testimonio aprobado exitosamente'
        case TestimonialStatus.REJECTED:
            return 'Testimonio rechazado'
        case TestimonialStatus.PUBLISHED:
            return 'Testimonio publicado exitosamente'
        case TestimonialStatus.PENDING:
            return 'Estado actualizado a pendiente'
        default:
            return 'Estado actualizado'
    }
}
