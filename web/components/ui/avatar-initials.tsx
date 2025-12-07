/**
 * Componente de Avatar con iniciales
 * Muestra la imagen del avatar si existe, o genera uno con iniciales
 */
interface AvatarProps {
    name: string
    avatar?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export function Avatar({ name, avatar, size = 'md', className = '' }: AvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    }

    const getInitials = (fullName: string): string => {
        if (!fullName) return '?'

        const words = fullName.trim().split(/\s+/)

        if (words.length === 1) {
            return words[0][0].toUpperCase()
        }

        const first = words[0][0]
        const last = words[words.length - 1][0]

        return (first + last).toUpperCase()
    }

    const getAvatarColor = (fullName: string): string => {
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

        const index = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return colors[index % colors.length]
    }

    if (avatar) {
        return (
            <img
                src={avatar}
                alt={name}
                className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            />
        )
    }

    // Avatar con iniciales
    return (
        <div
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white ${className}`}
            style={{ backgroundColor: getAvatarColor(name) }}
        >
            {getInitials(name)}
        </div>
    )
}
