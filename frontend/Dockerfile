# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Déclarer les variables d'environnement pour le build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build de production
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Installer serve pour servir les fichiers statiques
RUN npm install -g serve

# Copier les fichiers buildés depuis le stage builder
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 3000

# Servir l'application
CMD ["serve", "-s", "dist", "-l", "3000"]