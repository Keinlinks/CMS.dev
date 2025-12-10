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

interface ReviewInviteProps {
    currentOrgId?: string
}

export function ReviewInvite({ currentOrgId }: ReviewInviteProps) {
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [emails, setEmails] = useState("")
    const [inviteType, setInviteType] = useState<"PRODUCT" | "CATEGORY">("PRODUCT")

    const handleSubmit = (e: React.FormEvent) => {
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

        // Call API
        fetch('/api/testimonials/invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emails: emailArray,
                inviteType,
                organizationId: currentOrgId
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error)
                alert(`Solicitud enviada a ${emailArray.length} destinatarios.`)
                setEmails("")
                setShowReviewForm(false)
            })
            .catch((error) => {
                alert(`Error al enviar: ${error.message}`)
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

                            {/* Selector de Tipo (Producto / Categoria) */}
                            <div className="flex bg-muted p-1 rounded-md mb-3">
                                <button
                                    type="button"
                                    onClick={() => setInviteType("PRODUCT")}
                                    className={`flex-1 text-xs py-1 rounded-sm transition-all ${inviteType === "PRODUCT"
                                            ? "bg-background shadow text-foreground font-medium"
                                            : "text-muted-foreground hover:bg-background/50"
                                        }`}
                                >
                                    Producto
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setInviteType("CATEGORY")}
                                    className={`flex-1 text-xs py-1 rounded-sm transition-all ${inviteType === "CATEGORY"
                                            ? "bg-background shadow text-foreground font-medium"
                                            : "text-muted-foreground hover:bg-background/50"
                                        }`}
                                >
                                    Categoría
                                </button>
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
