#!/bin/bash

# Script d'installation et de lancement du projet Imagstore (hors Docker)
# Usage : ./setup.sh

set -e

# Variables à adapter
PG_USER="postgres"
PG_DB="imagstore"
PG_PASSWORD="postgres"

# 1. Création de la base de données (si elle n'existe pas)
echo "Création de la base de données..."
psql -U "$PG_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$PG_DB'" | grep -q 1 || psql -U "$PG_USER" -c "CREATE DATABASE $PG_DB;"

# 2. Création des tables
if [ -f backend/schema.sql ]; then
  echo "Création des tables..."
  psql -U "$PG_USER" -d "$PG_DB" -f backend/schema.sql
else
  echo "Fichier backend/schema.sql introuvable."
  exit 1
fi

# 3. Configuration du .env
cat > backend/.env <<EOF
DATABASE_URL=postgresql://$PG_USER:$PG_PASSWORD@localhost:5432/$PG_DB
JWT_SECRET=supersecretkey
PORT=5050
EOF

echo ".env généré dans backend/.env"

# 4. Libération du port backend

# 5. Installation des dépendances
cd backend && npm install && cd ../frontend && npm install && cd ..

echo "Installation terminée."

echo "Lancement du backend..."
cd backend && npm run dev &
BACK_PID=$!

sleep 3

echo "Lancement du frontend..."
cd frontend && npm run dev &
FRONT_PID=$!

sleep 3

echo "Accès :"
echo "- Frontend : http://localhost:5173"
echo "- Backend : http://localhost:5050"
echo "Pour arrêter : kill $BACK_PID $FRONT_PID"
