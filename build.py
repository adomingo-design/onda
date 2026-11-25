"""Bundle the exact web client for Apps Script HTML Service; local D3 and geography are inlined for HTML Service."""
from pathlib import Path
import json
root = Path(__file__).resolve().parent
web = root / 'web'
html = (web/'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>'+(web/'style.css').read_text()+'</style>')
html = html.replace('<script src="core.js"></script>', '<script>'+(web/'core.js').read_text()+'</script>')
for source in ['vendor/d3.v7.min.js', 'globe.js', 'vendor/lucide-icons.js', 'vendor/hls.light.min.js', 'catalog.js', 'pwa.js']:
    html = html.replace('<script src="'+source+'"></script>', '<script>'+(web/source).read_text().replace('</script', '<\/script')+'</script>')
geo = json.loads((web/'data/countries.geojson').read_text())
html = html.replace('<script src="app.js"></script>', '<script>window.ONDA_COUNTRIES='+json.dumps(geo,ensure_ascii=False).replace('</', '<\/')+';</script><script src="app.js"></script>')
html = html.replace('<script src="app.js"></script>', '<script>'+(web/'app.js').read_text()+'</script>')
html = html.replace('<link rel="manifest" href="manifest.webmanifest">','').replace('<link rel="icon" href="icon.svg" type="image/svg+xml">','')
html = html.replace('<link rel="apple-touch-icon" href="icons/icon-180.png">','')
html = html.replace('<head>', '<head><base target="_top">')
(root/'apps-script'/'Index.html').write_text(html)
print('Apps Script: apps-script/Index.html generado')
