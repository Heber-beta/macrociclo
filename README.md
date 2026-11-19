# Macrociclo

Plataforma personal para crear, editar y controlar macrociclos de entrenamiento: asistente de creación, biblioteca de 274 ejercicios con animaciones que resaltan los músculos trabajados, registro serie por serie, tests, control corporal y métricas de carga (sRPE, ACWR, Hooper, tonelaje).

- `index.html`: la app publicada en GitHub Pages (login con Supabase, autoguardado).
- `supabase.sql`: tablas y políticas de seguridad (cada usuario solo ve sus datos).
- `fuente/`: código fuente (`anim.js`, `anim_t.js` y `anim_map.js` dibujan las animaciones de la biblioteca). `python3 fuente/build.py <SUPABASE_URL> <ANON_KEY>` regenera la app.
