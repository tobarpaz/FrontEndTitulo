# Sistema de Control de Inventarios para Maestranzas Unidos S.A.

## Descripción del Proyecto

Este proyecto tiene como objetivo desarrollar un sistema de control de inventarios para Maestranzas Unidos S.A., una empresa dedicada a la fabricación y mantenimiento de equipos pesados utilizados en la construcción de infraestructura y la minería. Utilizando Django como framework y el panel administrativo Jazzmin, el sistema proporcionará una solución eficiente y precisa para la gestión de inventarios, optimizando el flujo de trabajo y garantizando la disponibilidad de piezas y componentes cuando se necesiten.

## Funcionalidades Principales

1. **Registro de Inventario**: Permitir el registro detallado de todas las piezas y componentes, incluyendo descripción, número de serie y ubicación.
2. **Seguimiento de Movimiento de Inventarios**: Rastrear los movimientos de entrada y salida del inventario en tiempo real.
3. **Alertas de Stock Bajo**: Generar alertas automáticas cuando los niveles de stock alcancen un umbral crítico.
4. **Notificación de Niveles Mínimos de Inventario**: Notificar automáticamente al equipo de aprovisionamiento cuando los niveles de inventario alcancen un umbral mínimo.
5. **Control de Lotes y Fechas de Vencimiento**: Permitir un seguimiento preciso de los lotes de componentes con fechas de vencimiento.
6. **Gestión de Kits y Conjuntos**: Admitir la gestión de kits o conjuntos de piezas.
7. **Generación de Informes de Inventarios**: Permitir la generación de informes personalizados.
8. **Gestión de Proveedores**: Incluir una base de datos de proveedores.
9. **Integración con Sistemas de Compra**: Automatizar la creación de órdenes de compra.

## Tecnologías Utilizadas

- **Django**: Framework web de alto nivel que permite el desarrollo rápido y limpio de aplicaciones web.
- **Jazzmin**: Tema de administración para Django que proporciona una interfaz de usuario moderna y amigable.
- **SQLite**: Base de datos relacional ligera utilizada para almacenar datos de inventario.

## Instalación y Configuración

### Prerrequisitos

- Python 3.8 o superior
- Git

### Pasos para la Instalación

1. **Clonar el Repositorio**
    ```bash
    git clone https://github.com/tu-usuario/sistema-control-inventarios.git
    cd sistema-control-inventarios
    ```

2. **Crear y Activar un Entorno Virtual**
    ```bash
    python -m venv env
    source env/bin/activate  # En Windows usa `env\Scripts\activate`
    ```

3. **Instalar las Dependencias**
    ```bash
    pip install -r requirements.txt
    ```

4. **Configurar las Variables de Entorno**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:
    ```plaintext
    SECRET_KEY=tu_clave_secreta
    DEBUG=True
    ```

5. **Aplicar Migraciones y Crear Superusuario**
    ```bash
    python manage.py migrate
    python manage.py createsuperuser
    ```

6. **Ejecutar la Aplicación**
    ```bash
    python manage.py runserver
    ```

