#!/bin/bash

echo "=== Iniciando backend ==="
cd Back-end
npm install --save-dev wait-on
node server.js

# Esperar a que el backend esté disponible
echo "=== Esperando a que el backend responda en http://localhost:3000 ==="
npx wait-on http://localhost:10000

echo "=== Backend listo. Iniciando frontend ==="
cd ../frontend
npm start
