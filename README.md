# Macrociclo

Plataforma personal para crear, editar y controlar macrociclos de entrenamiento: asistente de creación, biblioteca de 192 ejercicios, registro serie por serie, tests, control corporal y métricas de carga (sRPE, ACWR, Hooper, tonelaje).

- `index.html`: la app publicada en GitHub Pages (login con Supabase, autoguardado).
- `supabase.sql`: tablas y políticas de seguridad (cada usuario solo ve sus datos).
- `fuente/`: código fuente. `python3 fuente/build.py <SUPABASE_URL> <ANON_KEY>` regenera la app.
