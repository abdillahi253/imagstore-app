# Imagstore – Clone Google Photos

Ce projet est un clone simplifié de Google Photos utilisant React (frontend), Node.js/Express (backend) et PostgreSQL (base de données).

## Fonctionnalités principales
- Authentification utilisateur (inscription, connexion)
- Upload de photos (avec stockage local)
- Visualisation de la galerie personnelle
- API sécurisée par JWT

## Structure du projet
```
frontend/   # Application React (UI)
backend/    # API Node.js/Express + PostgreSQL
```

## Installation

### 1. Backend

1. Placez-vous dans le dossier backend :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez la base de données PostgreSQL :
   - Créez une base `imagstore`.
   - Modifiez `.env` avec vos identifiants PostgreSQL.
   - Exécutez le script SQL :
     ```bash
     psql -U <user> -d imagstore -f schema.sql
     ```
4. Lancez le serveur :
   ```bash
   npm run dev
   ```

### 2. Frontend

1. Placez-vous dans le dossier frontend :
   ```bash
   cd ../frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## API Backend (Express)

- `POST /api/auth/register` : inscription (email, password)
- `POST /api/auth/login` : connexion (retourne un JWT)
- `POST /api/photos/upload` : upload d'une photo (header Authorization: Bearer <token>)
- `GET /api/photos/` : liste des photos de l'utilisateur

## Configuration

- `.env` dans `backend/` :
  ```env
  DATABASE_URL=postgresql://user:password@localhost:5432/imagstore
  JWT_SECRET=supersecretkey
  PORT=5000
  ```

## À faire
- Gestion des albums
- Recherche de photos
- Stockage cloud (optionnel)
- UI avancée (albums, partage, etc.)

---

Projet pédagogique inspiré de Google Photos.
