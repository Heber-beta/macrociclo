import json, os, sys
H = os.path.dirname(os.path.abspath(__file__))
shell = open(f'{H}/shell.html').read()
lib = open(f'{H}/library.js').read()
app = open(f'{H}/app.js').read()
data = open(f'{H}/data.json').read()
SUPA = '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>\n'
def body(cfg, supa=False):
    return (shell + '\n' + (SUPA if supa else '') +
      '<script>\nwindow.APP_CONFIG = ' + json.dumps(cfg) + ';\nwindow.V1_DATA = ' + data + ';\n' +
      lib + '\n</script>\n<script>\n' + app + '\n</script>\n')
PWA = '<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" type="image/png" href="icons/favicon-32.png">\n<link rel="apple-touch-icon" href="icons/apple-180.png">\n<meta name="theme-color" content="#0A7A73">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="Macrociclo">\n'
def wrap(b, pwa=False):
    head, _, rest = b.partition('<style>')
    return '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + (PWA if pwa else '') + head + '<style>' + rest.replace('</style>', '</style>\n</head>\n<body>', 1) + '</body>\n</html>\n'
open(f'{H}/macrociclo.html','w').write(body({}))
open(f'{H}/local.html','w').write(wrap(body({'local': True})))
url = sys.argv[1] if len(sys.argv) > 2 else 'SUPABASE_URL'
key = sys.argv[2] if len(sys.argv) > 2 else 'SUPABASE_ANON_KEY'
open(f'{H}/index.html','w').write(wrap(body({'supabaseUrl': url, 'supabaseKey': key}, True), pwa=True))
print('ok')
