'use client'

import { useState } from 'react'
import { changePasswordAction } from '@/lib/actions/auth'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface ChangePasswordDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
        // Limpiar error del campo al escribir
        if (errors[e.target.id]) {
            setErrors({ ...errors, [e.target.id]: '' })
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.oldPassword) {
            newErrors.oldPassword = 'La contraseña actual es requerida'
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña es requerida'
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la nueva contraseña'
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const result = await changePasswordAction({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            })

            if (result.success) {
                toast({
                    title: '¡Contraseña actualizada!',
                    description: result.data?.message || 'Tu contraseña ha sido cambiada exitosamente',
                })
                // Limpiar formulario y cerrar dialog
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                })
                onOpenChange(false)
            } else {
                toast({
                    title: 'Error',
                    description: result.error || 'No se pudo cambiar la contraseña',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Ocurrió un error inesperado',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cambiar Contraseña</DialogTitle>
                    <DialogDescription>
                        Ingresa tu contraseña actual y la nueva contraseña que deseas usar.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">Contraseña Actual</Label>
                            <Input
                                id="oldPassword"
                                type="password"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.oldPassword && (
                                <p className="text-sm text-red-500">{errors.oldPassword}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nueva Contraseña</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">{errors.newPassword}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Cambiar Contraseña
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
