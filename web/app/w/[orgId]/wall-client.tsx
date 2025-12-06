'use client'

import { useEffect } from 'react'
import Masonry from 'react-masonry-css'
import { TestimonialCard, CardLayout } from '@/components/testimonial-card'
import { transformTestimonialForCard } from '@/lib/utils/testimonial-transform'

export interface Testimonial {
  id: string
  client_name: string
  client_email?: string
  title: string
  content: string
  stars_rating?: number
  media_url?: string
  media_type?: 'text' | 'image' | 'video'
  category_name?: string
  createdAt?: string
}

interface WallClientProps {
  testimonials: Testimonial[]
  theme: 'light' | 'dark'
  cardType: CardLayout
  primaryColor: string
  error?: string
}

export function WallClient({
  testimonials,
  theme,
  cardType,
  primaryColor,
  error
}: WallClientProps) {
  const isDark = theme === 'dark'

  // Auto-resize: Enviar altura al parent (iframe)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const sendHeight = () => {
      const height = document.documentElement.scrollHeight

      // Enviar mensaje al parent window
      window.parent.postMessage({
        type: 'testimonial-wall-resize',
        height: height
      }, '*')
    }

    // Enviar altura inicial
    setTimeout(sendHeight, 100)

    // Observar cambios en el DOM
    const observer = new ResizeObserver(() => {
      sendHeight()
    })

    observer.observe(document.body)

    // Enviar altura periódicamente (fallback)
    const interval = setInterval(sendHeight, 1000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [testimonials])

  // Breakpoints para masonry
  const breakpointColumns = {
    default: 3,
    1024: 2,
    640: 1
  }

  if (error) {
    return (
      <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center p-12 rounded-xl ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
            }`}>
            <p className="text-xl mb-2">Error al cargar testimonios</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return (
      <div className={`min-h-screen p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center p-12 rounded-xl ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
            }`}>
            <p className="text-xl mb-2">Aún no hay testimonios</p>
            <p className="text-sm">¡Sé el primero en compartir tu experiencia!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-2 sm:p-4 md:p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <style jsx global>{`
        :root {
          --primary-color: ${primaryColor};
        }
        
        /* Estilos para masonry */
        .masonry-grid {
          display: flex;
          margin-left: -1.5rem;
          width: auto;
        }
        
        .masonry-grid_column {
          padding-left: 1.5rem;
          background-clip: padding-box;
        }
        
        .masonry-grid_column > div {
          margin-bottom: 1.5rem;
        }
        
        @media (max-width: 640px) {
          .masonry-grid {
            margin-left: -1rem;
          }
          .masonry-grid_column {
            padding-left: 1rem;
          }
          .masonry-grid_column > div {
            margin-bottom: 1rem;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center px-2">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
            }`}>
            Lo que dicen nuestros clientes
          </h2>
          <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
            {testimonials.length} testimonios
          </p>
        </div>

        {/* Masonry Grid */}
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id}>
              <TestimonialCard
                testimonial={transformTestimonialForCard(testimonial)}
                layout={cardType}
                fontSize="medium"
                theme={theme}
              />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  )
}
