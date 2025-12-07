'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Copy, Check, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface EmbedEditorProps {
    organizationId: string
}

export function EmbedEditor({ organizationId }: EmbedEditorProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [cardType, setCardType] = useState<'base' | 'minimal' | 'detailed' | 'compact'>('base')
    const [primaryColor, setPrimaryColor] = useState('#3b82f6')
    const [copied, setCopied] = useState(false)
    const [wallUrl, setWallUrl] = useState('')
    const [embedCode, setEmbedCode] = useState('')
    const { toast } = useToast()

    // Generar URL y código solo en el cliente para evitar hydration mismatch
    useEffect(() => {
        const url = `${window.location.origin}/w/${organizationId}?theme=${theme}&card=${cardType}&color=${encodeURIComponent(primaryColor)}`
        setWallUrl(url)

        const code = `<!-- Testimonials Wall -->
<div id="testimonials-wall"></div>
<script>
  (function() {
    const iframe = document.createElement('iframe');
    iframe.src = '${url}';
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '600px';
    iframe.id = 'testimonials-wall-iframe';
    
    document.getElementById('testimonials-wall').appendChild(iframe);
    
    // Auto-resize
    window.addEventListener('message', function(e) {
      if (e.data.type === 'testimonial-wall-resize') {
        iframe.style.height = e.data.height + 'px';
      }
    });
  })();
</script>`

        setEmbedCode(code)
    }, [organizationId, theme, cardType, primaryColor])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode)
        setCopied(true)
        toast({
            title: "Código copiado",
            description: "El código embed ha sido copiado al portapapeles"
        })
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6">
            {/* Configuración */}
            <Card>
                <CardHeader>
                    <CardTitle>Personalización</CardTitle>
                    <CardDescription>
                        Configura cómo se verá el muro de testimonios en tu sitio web
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Tema */}
                    <div className="space-y-2">
                        <Label>Tema</Label>
                        <Select value={theme} onValueChange={(v: 'light' | 'dark') => setTheme(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Claro</SelectItem>
                                <SelectItem value="dark">Oscuro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tipo de Tarjeta */}
                    <div className="space-y-2">
                        <Label>Tipo de Tarjeta</Label>
                        <Select value={cardType} onValueChange={(v: any) => setCardType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="base">Estándar</SelectItem>
                                <SelectItem value="minimal">Minimalista</SelectItem>
                                <SelectItem value="detailed">Detallada</SelectItem>
                                <SelectItem value="compact">Compacta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Color Primario */}
                    <div className="space-y-2">
                        <Label>Color Primario</Label>
                        <div className="flex gap-2">
                            <Input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-20 h-10"
                            />
                            <Input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                placeholder="#3b82f6"
                                className="flex-1"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Vista Previa</CardTitle>
                            <CardDescription>
                                Así se verá el muro en tu sitio web
                            </CardDescription>
                        </div>
                        {wallUrl && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={wallUrl} target="_blank" rel="noopener noreferrer">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Abrir en nueva pestaña
                                </a>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden bg-muted/30">
                        {wallUrl ? (
                            <iframe
                                src={wallUrl}
                                className="w-full border-0"
                                style={{ minHeight: '600px' }}
                                title="Preview del muro"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-96 text-muted-foreground">
                                Cargando preview...
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Código Embed */}
            <Card>
                <CardHeader>
                    <CardTitle>Código para Embed</CardTitle>
                    <CardDescription>
                        Copia y pega este código en tu sitio web donde quieras mostrar el muro
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{embedCode || 'Generando código...'}</code>
                        </pre>
                        {embedCode && (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="absolute top-2 right-2"
                                onClick={copyToClipboard}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Copiado
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copiar
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {/* URL Directa */}
                    <div className="space-y-2">
                        <Label>URL Directa del Muro</Label>
                        <div className="flex gap-2">
                            <Input
                                value={wallUrl}
                                readOnly
                                className="flex-1 font-mono text-sm"
                                placeholder="Generando URL..."
                            />
                            {wallUrl && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(wallUrl)
                                        toast({ title: "URL copiada" })
                                    }}
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
