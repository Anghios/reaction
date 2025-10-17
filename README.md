# Juego de Reacción

Una aplicación web interactiva para medir tu tiempo de reacción. Pon a prueba tus reflejos y compite contra tus propios récords.

## Características

- Interfaz intuitiva con cambio de colores
- Sistema de estados: espera (rojo) → reacción (verde)
- Detección de clics prematuros
- Panel de estadísticas en tiempo real
- Mensajes personalizados según tu rendimiento
- Diseño responsive y moderno
- Iconos de Iconify

## Tecnologías

- **React** - Framework de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos principales
- **Iconify** - Biblioteca de iconos

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/Anghios/reaction.git
cd reaction
```

Instala las dependencias:

```bash
npm install
```

## Uso

### Modo desarrollo

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilar para producción

Para compilar la aplicación:

```bash
npm run build
```

Esto generará una carpeta `/dist` con los archivos optimizados listos para producción.

### Desplegar

Sube el contenido de la carpeta `/dist` generada a tu hosting o servidor web.

## Cómo jugar

1. Haz clic en la pantalla para empezar
2. Espera a que el fondo se ponga verde (¡no hagas clic en rojo!)
3. Haz clic lo más rápido posible cuando veas el verde
4. Observa tus estadísticas y trata de mejorar tu récord

## Rangos de rendimiento

- **Menos de 200ms**: ¡Increíble! Reflejos de ninja
- **200-250ms**: ¡Excelente! Muy rápido
- **250-300ms**: ¡Bien hecho! Buen tiempo
- **300-400ms**: No está mal, puedes mejorar
- **Más de 400ms**: Un poco lento, inténtalo otra vez

## Licencia

MIT
