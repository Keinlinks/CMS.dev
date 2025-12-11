"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CalendarIcon, Star } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function TestimonialFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        const from = searchParams.get("from")
        const to = searchParams.get("to")
        if (from && to) {
            return { from: new Date(from), to: new Date(to) }
        }
        return undefined
    })

    // Update URL when date changes
    const onDateSelect = (newDate: DateRange | undefined) => {
        setDate(newDate)
        const params = new URLSearchParams(searchParams.toString())
        if (newDate?.from) {
            params.set("from", newDate.from.toISOString())
        } else {
            params.delete("from")
        }
        if (newDate?.to) {
            params.set("to", newDate.to.toISOString())
        } else {
            params.delete("to")
        }
        router.push(`?${params.toString()}`)
    }

    const onRatingChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "all") {
            params.set("rating", value)
        } else {
            params.delete("rating")
        }
        router.push(`?${params.toString()}`)
    }

    const currentRating = searchParams.get("rating") || "all"

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="grid gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[260px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                                        {format(date.to, "LLL dd, y", { locale: es })}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y", { locale: es })
                                )
                            ) : (
                                <span>Filtrar por fecha</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={onDateSelect}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Select value={currentRating} onValueChange={onRatingChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por Rating" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los ratings</SelectItem>
                    <SelectItem value="5">5 Estrellas</SelectItem>
                    <SelectItem value="4">4 Estrellas</SelectItem>
                    <SelectItem value="3">3 Estrellas</SelectItem>
                    <SelectItem value="2">2 Estrellas</SelectItem>
                    <SelectItem value="1">1 Estrella</SelectItem>
                </SelectContent>
            </Select>

            {(date || currentRating !== "all") && (
                <Button
                    variant="ghost"
                    onClick={() => {
                        setDate(undefined)
                        router.push("?")
                    }}
                >
                    Limpiar filtros
                </Button>
            )}
        </div>
    )
}