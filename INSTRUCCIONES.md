# PWA — Test Ride Farellones
# Instrucciones de integración
# ══════════════════════════════════════════════

## ARCHIVOS A AGREGAR AL REPO (raíz del proyecto)

  manifest.json
  sw.js
  icons/
    icon-192.png
    icon-512.png

## LÍNEAS A AGREGAR EN CADA HTML (dentro de <head>)

Agregar esto en landing.html, index.html, registro.html y mapa.html
JUSTO ANTES del cierre de </head>:

<!-- PWA -->
<link rel="manifest" href="/TEST-RIDE-FARELLONES-2/manifest.json">
<meta name="theme-color" content="#e20613">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Test Ride">
<link rel="apple-touch-icon" href="/TEST-RIDE-FARELLONES-2/icons/icon-192.png">

## SCRIPT A AGREGAR EN CADA HTML (antes de </body>)

<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/TEST-RIDE-FARELLONES-2/sw.js')
      .then(r => console.log('[PWA] Service Worker registrado:', r.scope))
      .catch(e => console.log('[PWA] Error SW:', e));
  });
}
</script>

## RESULTADO FINAL

✓ Instalable en Android (Chrome): prompt automático "Agregar a pantalla de inicio"
✓ Instalable en iPhone (Safari): "Compartir → Agregar a pantalla de inicio"
✓ Instalable en pantallas moto Android (COKIMA, Carpuride, etc.)
✓ Funciona 100% offline una vez cargada: GPS activo sin internet
✓ Ícono en pantalla de inicio con branding Promobility/Test Ride
✓ Abre sin barra de navegador (standalone) — pantalla completa
✓ Tema rojo #e20613 en barra de estado del sistema
