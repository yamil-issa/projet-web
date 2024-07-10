# Projet Web
- Nom : ISSA Yamil
- Groupe 8

[Etude de faisabilité](study.md)

# Documentation 
Il s'agit d'une plateforme de messagerie instantanée avec déploiement continu

## Stack 
- backend : Typescript, nestJs, Graphql, redis
- frontend: Typescript, react

## Acceder au projet 

### En ligne
La plateforme est hebergé sur render, vous pouvez y accéder avec cet url : `https://react-app-latest-4tgy.onrender.com`

### En local avec Docker
- Clonez le projet avec la commande `https://github.com/yamil-issa/projet-web.git`
- Lancez docker
- Placez-vous à la racine du projet et exécuter la commande : `docker compose up -d`
- Une fois les containers lancés vous pouvez accéder au projet avec cet url : ` http://localhost:3000`

### En local sans Docker 
- Clonez le projet avec la commande `https://github.com/yamil-issa/projet-web.git`
- Placez-vous dans le dossier frontend à la racine du projet : `cd frontend`
- Executez la commande `npm install` pour installer les dependances 
- Créez un fichier .env : `touch .env`
- Dans le fichier .env mettez ces lignes pour pouvoir vous conneccter à l'api  : 
  `REACT_APP_API_URL=https://nestjs-app-latest.onrender.com/api`
  `REACT_APP_SOCKET_URL=https://nestjs-app-latest.onrender.com`
- Lancer l'application avec la commande `npm start`
- Vous pouvez accéder au projet avec cet url : `http://localhost:3000`

