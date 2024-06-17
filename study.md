# Etude de faisabilité sur l'utilisation de NestJS, GraphQL et Redis pour le développement d'une API

## NestJS

NestJS est un framework Node.js pour la construction d'applications serveur.

### Installation

NestJS requiert Node.js installé. On peut l'installer via npm : `npm i -g @nestjs/cli`  
Pour créer un nouveau projet : `nest new nom-projet`

### Architecture Modulaire

NestJS utilise une architecture modulaire inspirée d'Angular. Un module est une classe décorée avec `@Module()` qui fournit des métadonnées que Nest utilise pour organiser l'application.

Les modules regroupent les composants liés par un même domaine ou fonctionnalité. Ils peuvent importer d'autres modules pour réutiliser leurs services.

## GraphQL

GraphQL est un langage de requêtes pour API et un runtime pour exécuter ces requêtes avec des données existantes. Il permet de décrire les types d'objets et d'écrire des requêtes complexes tout en évitant sur/sous-récupération de données.

### Avantages

- Typage fort via le Schema
- Requêtes client flexibles et efficaces
- Unique point d'entrée pour les données
- Documentation facile à générer

### Inconvénients

- Sur-requêtes possibles sans optimisation
- Complexité du schéma et des résolveurs sur API volumineuse
- Courbe d'apprentissage plus importante

## Pertinence d'utiliser NestJS, GraphQL et Redis

L'utilisation de NestJS avec GraphQL permet de profiter des avantages des deux : la structure modulaire maintenable de NestJS, la flexibilité et l'efficacité des requêtes GraphQL. Redis est une excellente solution pour le caching et la mise en file d'attente avec Node.js. Il permet d'alléger la charge sur la base de données et d'améliorer les performances.

L'association de ces 3 technologies est pertinente pour développer une API robuste, performante et facilement maintenable. NestJS structure le code, GraphQL optimise les échanges de données, Redis gère le cache et la mise en file d'attente.
