#!/usr/bin/env sh

# Detener el script si ocurre algún error
set -e

# Construir el sitio estático
npm run build

# Navegar a la carpeta de salida
cd docs/.vitepress/dist

# Inicializar un nuevo repositorio de Git en la carpeta `dist`
git init
git add -A
git commit -m 'deploy'

# Empujar los cambios a la rama `main` o `master` de tu repositorio
git push -f git@github.com:Asorjs/asorjs.github.io.git main

# Regresar al directorio anterior
cd -
