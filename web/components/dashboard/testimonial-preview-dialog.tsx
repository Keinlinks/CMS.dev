"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Check, X, Eye, EyeOff, Trash2, Star } from "lucide-react"
import { useUserRole } from "@/components/providers/user-role-provider"
import { useToast } from "@/hooks/use-toast"
import {
    changeTestimonialStatusAction,
    deleteTestimonialAction
} from "@/lib/actions/testimonials"
import { TestimonialStatus } from "@/lib/types/testimonial-status"

interface TestimonialPreviewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    testimonial: any
}

export function TestimonialPreviewDialog({
    open,
    onOpenChange,
    testimonial,
}: TestimonialPreviewDialogProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const { isAdmin, hasRole } = useUserRole()
    const router = useRouter()
    const { toast } = useToast()

    const currentStatus = testimonial.status?.toUpperCase()

    // Helper para obtener color del badge según estado
    const getStatusColor = (status: string) => {
        const s = status?.toUpperCase()
        switch (s) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            case 'APPROVED':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            case 'REJECTED':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        }
    }

    const getStatusText = (status: string) => {
        const s = status?.toUpperCase()
        switch (s) {
            case 'PENDING': return 'Pendiente'
            case 'APPROVED': return 'Aprobado'
            case 'PUBLISHED': return 'Publicado'
            case 'REJECTED': return 'Rechazado'
            default: return status
        }
    }

    const handleAction = async (action: string) => {
        if (action === 'delete') {
            setShowDeleteConfirm(true)
            return
        }

        setIsProcessing(true)
        let newStatus: TestimonialStatus | null = null

        // Mapear acción de UI a estado del enum
        switch (action) {
            case 'approve':
                newStatus = TestimonialStatus.APPROVED
                break
            case 'reject':
                newStatus = TestimonialStatus.REJECTED
                break
            case 'publish':
                newStatus = TestimonialStatus.PUBLISHED
                break
            case 'unpublish':
                // Despublicar = volver a approved
                newStatus = TestimonialStatus.APPROVED
                break
            default:
                setIsProcessing(false)
                return
        }

        try {
            // ✅ Usar la función unificada
            const result = await changeTestimonialStatusAction(testimonial.id, newStatus)

            if (result.success) {
                toast({
                    title: "Éxito",
                    description: result.message,
                })
                onOpenChange(false) // Cerrar modal
                router.refresh() // Actualizar datos
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Ocurrió un error inesperado",
                variant: "destructive"
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleConfirmDelete = async () => {
        setIsProcessing(true)

        try {
            const result = await deleteTestimonialAction(testimonial.id)

            if (result.success) {
                toast({
                    title: "Eliminado",
                    description: result.message,
                    variant: "destructive"
                })
                setShowDeleteConfirm(false)
                onOpenChange(false)
                router.refresh()
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Ocurrió un error al eliminar",
                variant: "destructive"
            })
        } finally {
            setIsProcessing(false)
        }
    }

    // Determinar qué botones mostrar según estado y rol
    const renderActionButtons = () => {
        const buttons = []

        // PENDING: Aprobar o Rechazar (Editor+)
        if (currentStatus === 'PENDING' && hasRole('editor')) {
            buttons.push(
                <Button
                    key="approve"
                    onClick={() => handleAction('approve')}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Check className="w-4 h-4 mr-2" />
                    Aprobar
                </Button>,
                <Button
                    key="reject"
                    variant="outline"
                    onClick={() => handleAction('reject')}
                    disabled={isProcessing}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                    <X className="w-4 h-4 mr-2" />
                    Rechazar
                </Button>
            )
        }

        // APPROVED: Publicar (Solo Admin)
        if (currentStatus === 'APPROVED' && isAdmin) {
            buttons.push(
                <Button
                    key="publish"
                    onClick={() => handleAction('publish')}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Eye className="w-4 h-4 mr-2" />
                    Publicar
                </Button>
            )
        }

        // PUBLISHED: Despublicar (Solo Admin)
        if (currentStatus === 'PUBLISHED' && isAdmin) {
            buttons.push(
                <Button
                    key="unpublish"
                    variant="outline"
                    onClick={() => handleAction('unpublish')}
                    disabled={isProcessing}
                >
                    <EyeOff className="w-4 h-4 mr-2" />
                    Despublicar
                </Button>
            )
        }

        // REJECTED: Aprobar (Admin) o Eliminar (Admin)
        if (currentStatus === 'REJECTED' && isAdmin) {
            buttons.push(
                <Button
                    key="approve"
                    onClick={() => handleAction('approve')}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Check className="w-4 h-4 mr-2" />
                    Aprobar
                </Button>,
                <Button
                    key="delete"
                    variant="destructive"
                    onClick={() => handleAction('delete')}
                    disabled={isProcessing}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                </Button>
            )
        }

        return buttons
    }

    // Debug: Log del rol del usuario
    console.log('🔍 useUserRole:', { isAdmin, hasEditor: hasRole('editor') })
    console.log('📋 Testimonio:', { id: testimonial.id, status: currentStatus })

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-start justify-between gap-4 pr-6">
                            <DialogTitle className="text-lg sm:text-xl">Vista Previa del Testimonio</DialogTitle>
                            <Badge className={`${getStatusColor(testimonial.status)} shrink-0`}>
                                {getStatusText(testimonial.status)}
                            </Badge>
                        </div>
                    </DialogHeader>

                    {/* Card del testimonio como aparecería en el muro */}
                    <Card className="border-2">
                        <CardContent className="pt-6">
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                                {Array.from({ length: testimonial.stars_rating || 5 }).map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Título */}
                            <h3 className="text-xl font-semibold mb-2">
                                {testimonial.title}
                            </h3>

                            {/* Contenido */}
                            <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                                {testimonial.content}
                            </p>

                            {/* Autor */}
                            <div className="flex items-center gap-3 pt-4 border-t">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                        {(testimonial.client_name || 'U')[0].toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">
                                        {testimonial.client_name || 'Usuario'}
                                    </p>
                                    {testimonial.client_email && (
                                        <p className="text-xs text-muted-foreground">
                                            {testimonial.client_email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Categoría y fecha */}
                            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                                {testimonial.category_name && (
                                    <span className="px-2 py-1 bg-muted rounded">
                                        {testimonial.category_name}
                                    </span>
                                )}
                                {testimonial.created_at && (
                                    <span>
                                        {new Date(testimonial.created_at).toLocaleDateString('es-ES')}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botones de acción */}
                    {renderActionButtons().length > 0 && (
                        <div className="flex gap-2 justify-end pt-4 border-t">
                            {renderActionButtons()}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Eliminar Testimonio"
                description="¿Estás seguro de que deseas eliminar este testimonio? Esta acción no se puede deshacer."
                onConfirm={handleConfirmDelete}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
            />
        </>
    )
}
