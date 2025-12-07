/**
 * Genera las iniciales de un nombre
 * Ejemplos:
 * - "Juan Pérez" → "JP"
 * - "John" → "J"
 * - "María José García" → "MG" (primera y última)
 */
export function getInitials(name: string): string {
    if (!name) return '?'

    const words = name.trim().split(/\s+/)

    if (words.length === 1) {
        // Un solo nombre: primera letra
        return words[0][0].toUpperCase()
    }

    // Múltiples nombres: primera letra del primero + primera letra del último
    const first = words[0][0]
    const last = words[words.length - 1][0]

    return (first + last).toUpperCase()
}

/**
 * Genera un color de fondo basado en el nombre (para avatares)
 */
export function getAvatarColor(name: string): string {
    const colors = [
        '#3b82f6', // blue
        '#8b5cf6', // purple
        '#ec4899', // pink
        '#f59e0b', // amber
        '#10b981', // green
        '#06b6d4', // cyan
        '#f97316', // orange
        '#6366f1', // indigo
    ]

    // Generar índice basado en el nombre
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return colors[index % colors.length]
}
