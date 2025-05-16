#!/bin/bash

echo "=== Iniciando backend ==="
cd backend
node server.js

# Esperar a que el backend esté disponible
echo "=== Esperando a que el backend responda en http://localhost:3000 ==="
npx wait-on https://hypertoys.onrender.com

echo "=== Backend listo. Iniciando frontend ==="
cd ../frontend
npm start
