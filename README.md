# Onda · Tu radio personal

Una aplicación web de radio para ordenador y Android. Explora emisoras de todo el mundo, filtra por país en un globo interactivo y encuentra música por estilos visuales.

## Escuchar e instalar

La dirección de la aplicación, cuando finalice el despliegue, es [adomingo-design.github.io/onda](https://adomingo-design.github.io/onda/).

Abre esa dirección en Chrome para Android o Chrome/Edge en el PC y pulsa **Instalar Onda**. Si no aparece el diálogo, usa «Instalar aplicación» o «Añadir a pantalla de inicio» en el menú del navegador. La PWA abre una ventana propia y conserva la interfaz y tus favoritas para consultarlas sin conexión. Escuchar radio requiere internet.

## Funciones

- Catálogo Radio Browser con filtros por nombre, país, idioma, etiquetas, calidad y formato.
- Globo giratorio con selección de país y búsqueda por nombre.
- 24 estilos con iconos Lucide; combinación de hasta cuatro estilos.
- Perfiles Trabajar, Correr, Descansar y Descubrir, favoritas por perfil y emisoras por URL.
- Rotación entre favoritas y programación semanal, incluidas franjas nocturnas.
- Audio HTTPS directo y HLS. Las emisoras que solo ofrecen HTTP se abren externamente.
- Controles multimedia compatibles con el navegador y actualizaciones de la PWA solicitadas por el usuario.

La disponibilidad de las emisoras depende de cada proveedor, su región y su configuración. Los cambios programados requieren una sesión activa; el sistema operativo puede retrasar la actividad de fondo.

## Datos personales

La edición de GitHub Pages guarda la biblioteca en el navegador de cada dispositivo. No sube tus favoritas ni tus horarios al repositorio. Puedes exportar e importar la biblioteca en JSON para pasarla a otro dispositivo. La instalación como PWA no sincroniza dispositivos automáticamente.

## Desarrollo

No se necesita instalar dependencias para servir la web:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory web
```

Abre `http://127.0.0.1:8765`. Ejecuta las pruebas con:

```sh
node --test tests/*.test.cjs
```

El workflow de GitHub Actions ejecuta las pruebas y publica exclusivamente `web/` en GitHub Pages. Consulta [PUBLICACION.md](PUBLICACION.md) para los detalles de instalación y despliegue.

`apps-script/` contiene un adaptador opcional para una biblioteca en Google Sheets; no se ejecuta ni se despliega con GitHub Pages. `python3 build.py` genera su interfaz a partir del cliente web.

## Fuentes y licencias de terceros

- [Radio Browser](https://docs.radio-browser.info/): catálogo y metadatos de emisoras.
- [D3](https://d3js.org/): representación geográfica.
- [Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/): datos del mapa de dominio público, a escala simplificada.
- [Lucide](https://lucide.dev/): iconos.
- [HLS.js](https://github.com/video-dev/hls.js): reproducción de HLS cuando no hay soporte nativo.

Las licencias de las librerías incluidas se encuentran en `web/vendor/`. La cobertura del mapa simplificado no sustituye a un mapa de fronteras y puede omitir países pequeños; el buscador por nombre permite seleccionarlos.
