import { getCategoriesAction } from '@/lib/actions/categories'
import { CategoryList } from '@/components/dashboard/category-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function CategoriesPage() {
    const result = await getCategoriesAction()
    const categories = result.success ? result.data : []

    return (
        <div className="p-0">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Categorías</h1>
                    <p className="text-muted-foreground">
                        Organiza tus testimonios en categorías para mejor gestión
                    </p>
                </div>

                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva Categoría
                </Button>
            </div>

            {!result.success && (
                <div className="text-center py-12 bg-red-50 dark:bg-red-900/10 rounded-lg mb-6">
                    <p className="text-lg text-red-600 dark:text-red-400">
                        Error al cargar categorías: {result.error}
                    </p>
                </div>
            )}

            {categories.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                    <p className="text-lg text-muted-foreground mb-4">
                        No hay categorías creadas
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                        Crea tu primera categoría para organizar tus testimonios
                    </p>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Crear Primera Categoría
                    </Button>
                </div>
            ) : (
                <CategoryList categories={categories} />
            )}
        </div>
    )
}
