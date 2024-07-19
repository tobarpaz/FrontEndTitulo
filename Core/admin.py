from django.contrib import admin
from django.db import models
from django.http import HttpResponse
from .models import *
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from django.contrib import messages

# Filtro personalizado para "Stock Bajo"
class StockBajoFilter(admin.SimpleListFilter):
    title = 'Stock Bajo'
    parameter_name = 'stock_bajo'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Sí'),
            ('no', 'No'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.filter(cantidad__lt=models.F('stock_minimo'))
        if self.value() == 'no':
            return queryset.filter(cantidad__gte=models.F('stock_minimo'))
        return queryset

class ItemAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'stock_minimo', 'cantidad', 'is_stock_low')
    search_fields = ('nombre', 'descripcion')
    list_filter = (StockBajoFilter, 'nombre')
    actions = ['generar_informe_pdf']

    def is_stock_low(self, obj):
        return obj.cantidad < obj.stock_minimo

    is_stock_low.boolean = True
    is_stock_low.short_description = 'Stock Bajo'

    def generar_informe_pdf(self, request, queryset):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="informe_inventario.pdf"'

        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4

        p.setFont("Helvetica", 12)
        y = height - inch

        for item in queryset:
            p.drawString(inch, y, f"Nombre: {item.nombre}")
            p.drawString(inch, y - 14, f"Cantidad: {item.cantidad}")
            p.drawString(inch, y - 28, f"Stock Mínimo: {item.stock_minimo}")
            p.drawString(inch, y - 42, f"Descripción: {item.descripcion}")
            p.drawString(inch, y - 56, "-"*80)
            y -= 70
            if y < inch:
                p.showPage()
                p.setFont("Helvetica", 12)
                y = height - inch

        p.showPage()
        p.save()
        return response

    generar_informe_pdf.short_description = 'Generar informe de inventario en PDF'

class LoteAdmin(admin.ModelAdmin):
    list_display = ('item', 'numero_lote', 'cantidad', 'is_stock_low')
    search_fields = ('numero_lote', 'descripcion')
    list_filter = (StockBajoFilter, 'numero_lote')
    actions = ['generar_informe_pdf']

    def is_stock_low(self, obj):
        return obj.cantidad < obj.stock_minimo

    is_stock_low.boolean = True
    is_stock_low.short_description = 'Stock Bajo'

    def generar_informe_pdf(self, request, queryset):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="informe_inventario_lotes.pdf"'

        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4

        p.setFont("Helvetica", 12)
        y = height - inch

        for lote in queryset:
            p.drawString(inch, y, f"Número de Lote: {lote.numero_lote}")
            p.drawString(inch, y - 14, f"Item: {lote.item.nombre}")
            p.drawString(inch, y - 28, f"Cantidad: {lote.cantidad}")
            p.drawString(inch, y - 42, f"Stock Mínimo: {lote.stock_minimo}")
            p.drawString(inch, y - 56, f"Descripción: {lote.descripcion_lote}")
            p.drawString(inch, y - 70, "-"*80)
            y -= 84
            if y < inch:
                p.showPage()
                p.setFont("Helvetica", 12)
                y = height - inch

        p.showPage()
        p.save()
        return response

    generar_informe_pdf.short_description = 'Generar informe de inventario en PDF'

class KitAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'stock_minimo', 'cantidad', 'is_stock_low')
    search_fields = ('nombre', 'descripcion')
    list_filter = (StockBajoFilter, 'nombre')
    actions = ['generar_informe_pdf']

    def is_stock_low(self, obj):
        return obj.cantidad < obj.stock_minimo

    is_stock_low.boolean = True
    is_stock_low.short_description = 'Stock Bajo'

    def generar_informe_pdf(self, request, queryset):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="informe_inventario_kits.pdf"'

        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4

        p.setFont("Helvetica", 12)
        y = height - inch

        for kit in queryset:
            p.drawString(inch, y, f"Nombre: {kit.nombre}")
            p.drawString(inch, y - 14, f"Cantidad: {kit.cantidad}")
            p.drawString(inch, y - 28, f"Stock Mínimo: {kit.stock_minimo}")
            p.drawString(inch, y - 42, f"Descripción: {kit.descripcion}")
            p.drawString(inch, y - 56, "-"*80)
            y -= 70
            if y < inch:
                p.showPage()
                p.setFont("Helvetica", 12)
                y = height - inch

        p.showPage()
        p.save()
        return response

    generar_informe_pdf.short_description = 'Generar informe de inventario en PDF'

class MovimientoAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'get_nombre_articulo', 'fecha', 'cantidad', 'get_tipo_movimiento', 'descripcion', 'get_usuario')
    list_filter = ('tipo', 'fecha')
    search_fields = ('descripcion',)
    actions = ['generar_informe_movimientos_pdf']

    def get_nombre_articulo(self, obj):
        if obj.tipo == 'Item':
            return obj.item.nombre if obj.item else "-"
        elif obj.tipo == 'Lote':
            return obj.lote.numero_lote if obj.lote else "-"
        elif obj.tipo == 'Kit':
            return obj.kit.nombre if obj.kit else "-"
        else:
            return "-"

    get_nombre_articulo.short_description = "Nombre del Artículo"

    def get_tipo_movimiento(self, obj):
        return "Entrada" if isinstance(obj, Movimiento_Entrada) else "Salida"

    get_tipo_movimiento.short_description = "Tipo de Movimiento"

    def get_usuario(self, obj):
        if isinstance(obj, Movimiento_Entrada):
            return obj.encargado_entrada.username
        elif isinstance(obj, Movimiento_Salida):
            return obj.encargado_salida.username
        return "-"

    get_usuario.short_description = "Usuario"

    def save_model(self, request, obj, form, change):
        if isinstance(obj, Movimiento_Entrada):
            tipo_movimiento = 'entrada'
        else:
            tipo_movimiento = 'salida'

        if tipo_movimiento == 'entrada':
            if obj.tipo == 'Item':
                objeto = obj.item
            elif obj.tipo == 'Lote':
                objeto = obj.lote
            elif obj.tipo == 'Kit':
                objeto = obj.kit

            objeto.cantidad += obj.cantidad
            objeto.save()
        elif tipo_movimiento == 'salida':
            if obj.tipo == 'Item':
                objeto = obj.item
            elif obj.tipo == 'Lote':
                objeto = obj.lote
            elif obj.tipo == 'Kit':
                objeto = obj.kit

            objeto.cantidad -= obj.cantidad
            objeto.save()

        # Verificar el stock después de guardar
        if hasattr(objeto, 'is_stock_low') and objeto.is_stock_low():
            self.message_user(request, f'Advertencia: el stock del {obj.tipo.lower()} "{objeto}" es bajo.', messages.WARNING)
        
        super().save_model(request, obj, form, change)

    def generar_informe_movimientos_pdf(self, request, queryset):
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="informe_movimientos.pdf"'

        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4

        p.setFont("Helvetica", 12)
        y = height - inch

        for movimiento in queryset:
            p.drawString(inch, y, f"Fecha: {movimiento.fecha.strftime('%Y-%m-%d %H:%M:%S')}")
            p.drawString(inch, y - 14, f"Artículo: {self.get_nombre_articulo(movimiento)}")
            p.drawString(inch, y - 28, f"Cantidad: {movimiento.cantidad}")
            p.drawString(inch, y - 42, f"Tipo de Movimiento: {self.get_tipo_movimiento(movimiento)}")
            p.drawString(inch, y - 56, f"Descripción: {movimiento.descripcion}")
            p.drawString(inch, y - 70, f"Usuario: {self.get_usuario(movimiento)}")
            if isinstance(movimiento, Movimiento_Entrada):
                p.drawString(inch, y - 84, f"Precio de Compra: {movimiento.precio}")
                y -= 98
            else:
                y -= 84
            p.drawString(inch, y, "-"*80)
            y -= 14
            if y < inch:
                p.showPage()
                p.setFont("Helvetica", 12)
                y = height - inch

        p.showPage()
        p.save()
        return response

    generar_informe_movimientos_pdf.short_description = 'Generar informe de movimientos en PDF'
    

admin.site.register(Movimiento_Entrada, MovimientoAdmin)
admin.site.register(Movimiento_Salida, MovimientoAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(Lote, LoteAdmin)
admin.site.register(Etiqueta)
admin.site.register(Kit, KitAdmin)
admin.site.register(Proveedor)
