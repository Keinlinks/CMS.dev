'use client'

import { useState } from 'react'
import { updateUserAction } from '@/lib/actions/users'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ChangePasswordDialog } from './change-password-dialog'
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
    user: {
        id: string
        name: string
        username: string
        email: string
    }
    userRole: string
}

export function ProfileForm({ user, userRole }: ProfileFormProps) {
    const { toast } = useToast()
    const [formData, setFormData] = useState({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
    })
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSave = async () => {
        setIsLoading(true)

        try {
            const result = await updateUserAction({
                name: formData.name,
                username: formData.username,
                email: formData.email,
            })

            if (result.success) {
                setIsEditing(false)
                toast({
                    title: "Perfil actualizado",
                    description: result.message || "Tus cambios han sido guardados correctamente",
                })
                // Recargar la página para actualizar los datos
                window.location.reload()
            } else {
                toast({
                    title: "Error",
                    description: result.error || "No se pudo actualizar el perfil",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Ocurrió un error inesperado",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            name: user.name || '',
            username: user.username || '',
            email: user.email || '',
        })
        setIsEditing(false)
    }

    return (
        <>
            <div className="grid gap-6 max-w-2xl">
                {/* Información Personal */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                        <CardDescription>
                            Actualiza tu información de perfil
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing || isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!isEditing || isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!isEditing || isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Rol</Label>
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userRole === 'admin'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                        : userRole === 'editor'
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                    }`}>
                                    {userRole === 'admin' ? 'Administrador' : userRole === 'editor' ? 'Editor' : 'Viewer'}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    (No editable)
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} disabled={isLoading}>
                                    Editar Perfil
                                </Button>
                            ) : (
                                <>
                                    <Button onClick={handleSave} disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Guardar Cambios
                                    </Button>
                                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                                        Cancelar
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Seguridad */}
                <Card>
                    <CardHeader>
                        <CardTitle>Seguridad</CardTitle>
                        <CardDescription>
                            Gestiona la seguridad de tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Contraseña</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="password"
                                    value="••••••••"
                                    disabled
                                    className="max-w-xs"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPasswordDialog(true)}
                                >
                                    Cambiar Contraseña
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Mantén tu cuenta segura con una contraseña fuerte
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <ChangePasswordDialog
                open={showPasswordDialog}
                onOpenChange={setShowPasswordDialog}
            />
        </>
    )
}
