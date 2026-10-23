# Gestion de contacts avec Vue.js

Application réalisée pour le TP Vue.js de gestion des contacts.

## Fonctionnalités

- Affichage de cinq contacts avec leur photo, nom, prénom, téléphone et e-mail.
- Modification et ajout d'un contact.
- Validation des champs obligatoires et de l'adresse e-mail.
- Sélection d'une image dans la galerie avec aperçu immédiat.
- Accès à la caméra avec `getUserMedia`, capture d'une photo et solution de secours par galerie.
- Liens pour appeler (`tel:`) et envoyer un e-mail (`mailto:`).
- Conservation des contacts dans le `localStorage` du navigateur.

## Installation

Prérequis : Node.js 22 ou une version compatible.

```sh
npm install
```

## Lancer l'application

```sh
npm run dev
```

Ouvrir ensuite l'adresse indiquée par Vite, généralement `http://localhost:5173`.

Pour vérifier la version de production :

```sh
npm run build
```

## Utiliser la caméra

La caméra du navigateur fonctionne sur `localhost` ou en HTTPS. Sur téléphone, il faut accepter la permission demandée. Si la caméra n'est pas disponible, le bouton **Choisir une photo** permet de sélectionner une image dans la galerie.

## Organisation

- `src/views/ListeContacts.vue` : liste des contacts.
- `src/views/DetailContact.vue` : formulaire, galerie et caméra.
- `src/data/contacts.js` : données partagées et sauvegarde locale.
- `src/router/index.js` : routes de l'application.
