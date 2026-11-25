# Publicación de Onda

Se prepara un repositorio independiente llamado `onda` para el código y la aplicación web. La cuenta confirmada por la conexión de GitHub es `adomingo-design`. El repositorio público se ha creado el 25 de noviembre de 2026. La publicación de la web debe verificarse al terminar el workflow.

## Contenido

El repositorio incluye `web/`, `tests/`, `apps-script/`, documentación, herramientas de construcción y `.github/workflows/pages.yml`. Excluye `output/`, credenciales, `.clasp.json`, ficheros de entorno y cualquier otro proyecto del workspace. Las favoritas se guardan en el navegador y no forman parte del código.

## Despliegue

El workflow valida las pruebas y publica exclusivamente `web/` al recibir cambios en `main`. En Settings → Pages hay que seleccionar **GitHub Actions** como origen. El workflow utiliza el token temporal de Actions, con permisos de publicación limitados al job de despliegue; no necesita un token personal guardado como secreto.

Una vez creado y publicado el repositorio en esa cuenta y con ese nombre, la dirección prevista es `https://adomingo-design.github.io/onda/`. Verificar el resultado del workflow y abrir la URL antes de darla por publicada.

GitHub Pages sirve la versión estática: favoritos, perfiles y horarios permanecen en cada navegador. Para pasar la biblioteca de PC a móvil se puede exportar/importar el JSON. La sincronización mediante Sheets sigue siendo una implementación separada en Apps Script, sin desplegar.

La aplicación utiliza rutas relativas para el manifiesto, el service worker, los iconos y los datos del globo; es compatible con el prefijo `/onda/` de GitHub Pages. No publica los datos de Apps Script ni ejecuta `clasp push`.

## Instalación como PWA

Abre la URL HTTPS publicada en Chrome para Android o Chrome/Edge en PC y utiliza «Instalar Onda» o la opción de instalación del navegador. El botón muestra instrucciones si el navegador no proporciona el diálogo de instalación. El manifiesto declara iconos PNG de 192 y 512 px compatibles con recorte maskable. La aplicación se abre en ventana propia, dentro de su ruta de GitHub Pages.

El service worker conserva la interfaz, los iconos y el mapa para abrirlos sin conexión, excluyendo las peticiones al catálogo, logos remotos y audio. Las cachés están separadas por la ruta de la aplicación para no interferir con otras webs alojadas en el mismo dominio. Las versiones nuevas esperan a que pulses «Actualizar Onda» antes de recargar. Instalarla no sincroniza datos entre dispositivos ni garantiza los cambios de emisora con Android suspendido.
