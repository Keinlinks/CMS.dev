"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useUserRole } from "@/components/providers/user-role-provider"
import { useToast } from "@/hooks/use-toast"
import { deleteCategoryAction } from "@/lib/actions/categories"

interface CategoryListProps {
    categories: any[]
}

export function CategoryList({ categories }: CategoryListProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null)
    const [isDeleting, setIsDeleting] = useState(false)


    const { isAdmin } = useUserRole()
    const router = useRouter()
    const { toast } = useToast()

    const handleDeleteClick = (category: any) => {
        setCategoryToDelete(category)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return

        setIsDeleting(true)

        try {
            const result = await deleteCategoryAction(categoryToDelete.id)

            if (result.success) {
                toast({
                    title: "Eliminada",
                    description: result.message,
                    variant: "destructive"
                })
                setDeleteDialogOpen(false)
                setCategoryToDelete(null)
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
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category: any, index: number) => (
                    <div
                        key={category.id}
                        className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-xl transition-all duration-300 hover:scale-105"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                        <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                        />
                                    </svg>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Editar
                                        </DropdownMenuItem>

                                        {isAdmin && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(category)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                            {category.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {category.description}
                                </p>
                            )}

                            <div className="mt-4 pt-4 border-t">
                                <div className="text-sm text-muted-foreground">
                                    {category.testimonialCount || 0} testimonios
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Eliminar Categoría"
                description={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? ${categoryToDelete?.testimonialCount > 0
                    ? 'Esta categoría tiene testimonios asociados y no podrá ser eliminada.'
                    : 'Esta acción no se puede deshacer.'
                    }`}
                onConfirm={handleConfirmDelete}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
                disabled={isDeleting}
            />
        </>
    )
}
