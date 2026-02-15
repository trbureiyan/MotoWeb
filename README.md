# MotoTaller 🏍️

Proyecto pequeño de web de taller de motos con branding empleando el framework de UIKit para exposición del curso de Lenguajes para la web.

## Descripción

MotoTaller es un sitio web moderno y profesional diseñado para un taller de motocicletas. El proyecto utiliza el framework UIKit para crear una interfaz atractiva y responsive, con un diseño personalizado que no se parece a WordPress.

## Características

- ✨ Diseño moderno y personalizado
- 📱 Totalmente responsive (móvil, tablet, escritorio)
- 🎨 Branding único con paleta de colores personalizada
- 🚀 Framework UIKit 3.17.11
- ⚡ Animaciones fluidas y transiciones
- 📋 Formulario de contacto funcional
- 🖼️ Galería de trabajos
- 📍 Secciones: Inicio, Servicios, Nosotros, Galería, Contacto

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados y responsive
- **JavaScript**: Interactividad y validación de formularios
- **UIKit 3**: Framework CSS y JavaScript

## Estructura del Proyecto

```
MotoAPP/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos personalizados
├── js/
│   └── script.js      # JavaScript personalizado
├── .gitignore         # Archivos a ignorar en git
└── README.md          # Este archivo
```

## Instalación y Uso

1. Clona el repositorio:
   ```bash
   git clone https://github.com/trbureiyan/MotoAPP.git
   ```

2. Navega al directorio:
   ```bash
   cd MotoAPP
   ```

3. Abre el archivo `index.html` en tu navegador:
   - Doble clic en el archivo
   - O usa un servidor local como Live Server en VS Code

## Secciones del Sitio

### 1. Inicio (Hero)
Sección de bienvenida con llamada a la acción y diseño impactante.

### 2. Servicios
Muestra los 6 servicios principales del taller:
- Mantenimiento Preventivo
- Reparación de Motor
- Neumáticos y Frenos
- Sistema Eléctrico
- Personalización
- Inspección Técnica

### 3. Nosotros
Información sobre el taller, experiencia y estadísticas.

### 4. Galería
Galería visual de trabajos realizados.

### 5. Contacto
Formulario de contacto con validación e información de ubicación.

## Personalización

### Colores
Los colores principales se definen en `css/style.css`:
```css
:root {
    --primary-color: #FF6B35;    /* Naranja */
    --secondary-color: #2C3E50;  /* Azul oscuro */
    --accent-color: #F7931E;     /* Naranja claro */
    --dark-color: #1A1A1A;       /* Negro */
    --light-color: #F4F4F4;      /* Gris claro */
}
```

### Contenido
Puedes modificar fácilmente el contenido en `index.html`:
- Textos de servicios
- Información de contacto
- Enlaces de redes sociales
- Horarios y dirección

## Características de UIKit Utilizadas

- **Navbar**: Navegación responsive con menú móvil
- **Grid System**: Sistema de rejilla flexible
- **Cards**: Tarjetas para servicios
- **Buttons**: Botones estilizados
- **Forms**: Formularios validados
- **Offcanvas**: Menú lateral móvil
- **Scrollspy**: Navegación activa según scroll
- **Smooth Scroll**: Desplazamiento suave
- **Notifications**: Mensajes de notificación

## Compatibilidad

- ✅ Chrome (última versión)
- ✅ Firefox (última versión)
- ✅ Safari (última versión)
- ✅ Edge (última versión)
- ✅ Dispositivos móviles (iOS/Android)

## Desarrollo Futuro

Posibles mejoras:
- [ ] Integración con backend para formulario
- [ ] Galería con imágenes reales
- [ ] Sistema de citas online
- [ ] Blog de noticias y consejos
- [ ] Área de clientes
- [ ] Integración con Google Maps

## Autor

Proyecto desarrollado para el curso de Lenguajes para la Web.

## Licencia

Este proyecto es de código abierto y está disponible para fines educativos.
