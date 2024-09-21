#!/bin/bash

# Detener el script en caso de que ocurra un error
set -e

# Mensaje que indica el inicio del despliegue
echo "Iniciando el proceso de despliegue..."

# Construir el proyecto
echo "Construyendo el sitio con VitePress..."
npm run build

# Navegar al directorio de salida de la build
cd docs/.vitepress/dist

# Inicializar un nuevo repositorio Git (si no existe)
git init

# Añadir todos los archivos al repositorio
git add -A

# Confirmar los cambios con un mensaje
git commit -m "Deploying updated documentation"

# Desplegar al repositorio en GitHub (reemplaza con tu usuario y repositorio)
# Desplegar a la rama main
git push -f git@github.com:Asorjs/asorjs.github.io.git main

# Volver al directorio raíz del proyecto
cd -

# Mensaje de finalización
echo "Despliegue completado con éxito."
