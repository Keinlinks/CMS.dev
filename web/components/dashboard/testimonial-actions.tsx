"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TestimonialPreviewDialog } from "@/components/dashboard/testimonial-preview-dialog"

interface TestimonialActionsProps {
    testimonial: any
}

export function TestimonialActions({ testimonial }: TestimonialActionsProps) {
    const [showPreview, setShowPreview] = useState(false)

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="h-8 w-8 p-0"
            >
                <Eye className="h-4 w-4" />
            </Button>

            <TestimonialPreviewDialog
                open={showPreview}
                onOpenChange={setShowPreview}
                testimonial={testimonial}
            />
        </>
    )
}
