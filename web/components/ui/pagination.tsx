"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalItems: number
    itemsPerPage: number
    baseUrl: string
}

export function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    baseUrl
}: PaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // Si solo hay una página, no mostrar paginación
    if (totalPages <= 1) {
        return null
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`${baseUrl}?${params.toString()}`)
    }

    const canGoPrevious = currentPage > 1
    const canGoNext = currentPage < totalPages

    return (
        <div className="flex items-center justify-between border-t pt-4 mt-6">
            <div className="text-sm text-muted-foreground">
                Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} testimonios
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!canGoPrevious}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                </Button>

                <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                            // Mostrar primera página, última página, página actual y páginas adyacentes
                            return (
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - currentPage) <= 1
                            )
                        })
                        .map((page, index, array) => {
                            // Agregar "..." si hay un salto
                            const showEllipsis = index > 0 && page - array[index - 1] > 1

                            return (
                                <div key={page} className="flex items-center gap-1">
                                    {showEllipsis && (
                                        <span className="px-2 text-muted-foreground">...</span>
                                    )}
                                    <Button
                                        variant={page === currentPage ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className="w-9"
                                    >
                                        {page}
                                    </Button>
                                </div>
                            )
                        })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!canGoNext}
                >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}
