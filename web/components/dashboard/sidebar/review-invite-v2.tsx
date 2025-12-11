"use client"

import * as React from "react"
import { useState } from "react"
import { MessageSquare } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

import { getCategoriesAction } from "@/lib/actions/categories"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { inviteTestimonialAction } from "@/lib/actions/testimonials"
import { toast } from "@/hooks/use-toast"

interface ReviewInviteProps {
    currentOrgId?: string
}

export function ReviewInvite({ currentOrgId }: ReviewInviteProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [emails, setEmails] = useState("")
    const [categories, setCategories] = useState<any[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")

    React.useEffect(() => {
        setIsMounted(true)
        if (currentOrgId) {
            getCategoriesAction().then(res => {
                if (res.success) {
                    setCategories(res.data)
                }
            })
        }
    }, [currentOrgId])

    if (!isMounted) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!currentOrgId) {
            alert('No se encontró la organización actual')
            return
        }

        const emailArray = emails
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email.length > 0)

        if (emailArray.length === 0) {
            alert('Por favor ingresa al menos un email')
            return
        }

        if (!selectedCategoryId) {
            alert('Por favor selecciona una categoría')
            return
        }

        // Call API
        let res = await inviteTestimonialAction({
            categoryId: selectedCategoryId,
            emails: emailArray,
            organizationId:currentOrgId
        });
        toast({
          title: res.message,
        })
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu open={showReviewForm} onOpenChange={setShowReviewForm}>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="w-full text-left rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition text-sm font-medium flex items-center gap-2"
                        >
                            <div className="bg-[#66F9C4] text-[#0F111A] flex aspect-square size-8 items-center justify-center rounded-lg">
                                <MessageSquare className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">Solicitud de Reviews</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="min-w-[20rem] p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <h3 className="font-medium text-sm mb-1">Invitar Clientes</h3>
                                <p className="text-xs text-muted-foreground">Envía invitaciones para dejar una reseña.</p>
                            </div>

                            <div className="mb-3">
                                <label className="text-xs font-medium block mb-2">Categoría</label>
                                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <label className="text-xs font-medium block mb-2">Correos electrónicos</label>
                            <textarea
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                                placeholder="cliente1@email.com, cliente2@email.com"
                                className="w-full px-3 py-2 border rounded-md bg-transparent text-sm min-h-[100px] resize-none mb-3 focus:outline-none focus:ring-1 focus:ring-ring"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-3 py-1.5 rounded-md text-xs hover:bg-accent transition"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:brightness-90 transition">
                                    Enviar Invitaciones
                                </button>
                            </div>
                        </form>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}