from django.db import models
from django.contrib.auth.models import User
from django.forms import ValidationError

class Item(models.Model):
    nombre = models.CharField(max_length=255, verbose_name="Nombre")
    imagen = models.ImageField(upload_to='items/', blank=True, null=True, verbose_name="Imagen", default='items/default.jpg')
    descripcion = models.CharField(max_length=255, verbose_name="Descripción")
    numero_serie = models.CharField(max_length=255, verbose_name="Número de Serie")
    fecha_vencimiento = models.DateField(blank=True, null=True, verbose_name="Fecha de Vencimiento")
    ubicacion = models.CharField(max_length=255, verbose_name="Ubicación")
    stock_minimo = models.IntegerField(default=0, verbose_name="Stock Mínimo")
    cantidad = models.IntegerField(default=0, verbose_name="Cantidad Disponible")
    
    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"
        ordering = ['nombre']
        
    def __str__(self):
        return self.nombre

    def is_stock_low(self):
        return self.cantidad < self.stock_minimo

class Etiqueta(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre de la Etiqueta")
    items = models.ManyToManyField(Item, related_name='etiquetas')
    
    class Meta:
        verbose_name = "Etiqueta"
        verbose_name_plural = "Etiquetas"
        ordering = ['nombre']
        
    def __str__(self):
        return self.nombre

class Lote(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='lotes')
    imagen = models.ImageField(upload_to='lotes/', blank=True, null=True, verbose_name="Imagen", default='lotes/default.jpg')
    numero_lote = models.CharField(max_length=100, verbose_name="Número de Lote")
    descripcion_lote = models.CharField(max_length=255, verbose_name="Descripción")
    cantidad = models.IntegerField(default=0, verbose_name="Cantidad")
    stock_minimo = models.IntegerField(default=0, verbose_name="Stock Mínimo")
    fecha_vencimiento = models.DateField(blank=True, null=True, verbose_name="Fecha de Vencimiento")
    
    class Meta:
        verbose_name = "Lote"
        verbose_name_plural = "Lotes"
        ordering = ['fecha_vencimiento']
        
    def __str__(self):
        return f"Lote {self.numero_lote} - {self.item}"

    def is_stock_low(self):
        return self.cantidad < self.stock_minimo

class Kit(models.Model):
    nombre = models.CharField(max_length=255, verbose_name="Nombre")
    imagen = models.ImageField(upload_to='kits/', blank=True, null=True, verbose_name="Imagen", default='kits/default.jpg')
    descripcion = models.CharField(max_length=255, verbose_name="Descripción")
    cantidad = models.IntegerField(default=0, verbose_name="Cantidad")
    stock_minimo = models.IntegerField(default=0, verbose_name="Stock Mínimo")
    items = models.ManyToManyField(Item, related_name='kits')
    
    class Meta:
        verbose_name = "Kit"
        verbose_name_plural = "Kits"
        ordering = ['nombre']
        
    def __str__(self):
        return self.nombre

    def is_stock_low(self):
        return self.cantidad < self.stock_minimo


class Proveedor(models.Model):
    nombre = models.CharField(max_length=255, verbose_name="Nombre")
    direccion = models.CharField(max_length=255, verbose_name="Dirección")
    telefono = models.CharField(max_length=20, verbose_name="Teléfono")
    email = models.EmailField(max_length=255, verbose_name="Correo Electrónico")
    etiquetas = models.ForeignKey('Etiqueta', on_delete=models.CASCADE, related_name='proveedores')
    
    class Meta:
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"
        ordering = ['nombre']
        
    def __str__(self):
        return self.nombre
    
class Movimiento_Entrada(models.Model):
    Articles_options = (
        ('Item', 'Item'),
        ('Lote', 'Lote'),
        ('Kit', 'Kit'),
    )
    
    tipo = models.CharField(max_length=255, choices=Articles_options, verbose_name="Tipo de Artículo")
    item = models.ForeignKey('Item', on_delete=models.CASCADE, related_name='movimientos_entrada', verbose_name="Item", null=True, blank=True)
    lote = models.ForeignKey('Lote', on_delete=models.CASCADE, related_name='movimientos_entrada', verbose_name="Lote", null=True, blank=True)
    kit = models.ForeignKey('Kit', on_delete=models.CASCADE, related_name='movimientos_entrada', verbose_name="Kit", null=True, blank=True)
    cantidad = models.IntegerField(default=0, verbose_name="Cantidad")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha")
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, related_name='movimientos_entrada', verbose_name="Proveedor")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    encargado_entrada = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movimientos_entrada', verbose_name="Encargado de la Entrada")
    descripcion = models.TextField(verbose_name="Descripción", null=True, blank=True)

    class Meta:
        verbose_name = "Movimiento de Entrada"
        verbose_name_plural = "Movimientos de Entrada"
        ordering = ['-fecha']
        
    def __str__(self):
        return f"{self.tipo} - {self.fecha}"
    
    def clean(self):
        super().clean()
        if self.tipo == 'Item' and not self.item:
            raise ValidationError({'item': 'Debe seleccionar un Item cuando el tipo es Item.'})
        if self.tipo == 'Lote' and not self.lote:
            raise ValidationError({'lote': 'Debe seleccionar un Lote cuando el tipo es Lote.'})
        if self.tipo == 'Kit' and not self.kit:
            raise ValidationError({'kit': 'Debe seleccionar un Kit cuando el tipo es Kit.'})
        
        if self.tipo != 'Item' and self.item:
            raise ValidationError({'item': 'Item debe ser None a menos que el tipo sea Item.'})
        if self.tipo != 'Lote' and self.lote:
            raise ValidationError({'lote': 'Lote debe ser None a menos que el tipo sea Lote.'})
        if self.tipo != 'Kit' and self.kit:
            raise ValidationError({'kit': 'Kit debe ser None a menos que el tipo sea Kit.'})
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class Movimiento_Salida(models.Model):
    Articles_options = (
        ('Item', 'Item'),
        ('Lote', 'Lote'),
        ('Kit', 'Kit'),
    )
    
    tipo = models.CharField(max_length=255, choices=Articles_options, verbose_name="Tipo de Artículo")
    item = models.ForeignKey('Item', on_delete=models.CASCADE, related_name='movimientos_salida', verbose_name="Item", null=True, blank=True)
    lote = models.ForeignKey('Lote', on_delete=models.CASCADE, related_name='movimientos_salida', verbose_name="Lote", null=True, blank=True)
    kit = models.ForeignKey('Kit', on_delete=models.CASCADE, related_name='movimientos_salida', verbose_name="Kit", null=True, blank=True)
    cantidad = models.IntegerField(default=0, verbose_name="Cantidad")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha")
    solicitante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movimientos_solicitados', verbose_name="Solicitante")
    encargado_salida = models.ForeignKey(User, on_delete=models.CASCADE, related_name='movimientos_despachados', verbose_name="Encargado de la Salida")
    descripcion = models.TextField(verbose_name="Descripción", null=True, blank=True)

    class Meta:
        verbose_name = "Movimiento de Salida"
        verbose_name_plural = "Movimientos de Salida"
        ordering = ['-fecha']
        
    def __str__(self):
        return f"{self.tipo} - {self.fecha}"
    
    def clean(self):
        super().clean()
        if self.tipo == 'Item' and not self.item:
            raise ValidationError({'item': 'Debe seleccionar un Item cuando el tipo es Item.'})
        if self.tipo == 'Lote' and not self.lote:
            raise ValidationError({'lote': 'Debe seleccionar un Lote cuando el tipo es Lote.'})
        if self.tipo == 'Kit' and not self.kit:
            raise ValidationError({'kit': 'Debe seleccionar un Kit cuando el tipo es Kit.'})
        
        if self.tipo != 'Item' and self.item:
            raise ValidationError({'item': 'Item debe ser None a menos que el tipo sea Item.'})
        if self.tipo != 'Lote' and self.lote:
            raise ValidationError({'lote': 'Lote debe ser None a menos que el tipo sea Lote.'})
        if self.tipo != 'Kit' and self.kit:
            raise ValidationError({'kit': 'Kit debe ser None a menos que el tipo sea Kit.'})
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)