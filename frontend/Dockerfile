# Image Node.js légère
FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Fichiers de dépendances
COPY package.json package-lock.json* ./

# Installation des packages
RUN npm install

# Copie du code source
COPY . .

# Port pour accéder à l'application
EXPOSE 5173

# Démarrage avec accès depuis l'extérieur
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]