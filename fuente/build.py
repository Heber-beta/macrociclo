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
def wrap(b):
    head, _, rest = b.partition('<style>')
    return '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + head + '<style>' + rest.replace('</style>', '</style>\n</head>\n<body>', 1) + '</body>\n</html>\n'
open(f'{H}/macrociclo.html','w').write(body({}))
open(f'{H}/local.html','w').write(wrap(body({'local': True})))
url = sys.argv[1] if len(sys.argv) > 2 else 'SUPABASE_URL'
key = sys.argv[2] if len(sys.argv) > 2 else 'SUPABASE_ANON_KEY'
open(f'{H}/index.html','w').write(wrap(body({'supabaseUrl': url, 'supabaseKey': key}, True)))
print('ok')
