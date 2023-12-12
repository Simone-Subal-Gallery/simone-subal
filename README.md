#simone-subal

## Stack

### Requirements

Node.js (v14.18.0 for `/web`), NPM, and Yarn.

# Web (Front-end App)

## Development

in /web → run  

`yarn dev`

## Staging & Production

production build command:

`npm run generate`

## Netlify branches and deploy context

Deploy contexts are branch-based environments that enable you to configure builds depending on the context. This includes production and preview environments. (Set in Netlify)

**Production branch: main**

**Branch deploys: Deploy only the production branch**

**Deploy Previews: Any pull request against your production branch/ branch deploy branches**

## Deployment Settings / Requirements

Node Version 14.18.0

(set on Netlify using an environment variable: `NODE_VERSION=14.18.0`)

# CMS

## Development

in `/studio` → run:

1. Run `sanity start` after yarn install or sanity install to view CMS locally. 
Local dev version of the CMS is at: `http://localhost:3333`
2. Once ready to deploy to Sanity servers for access by editors and other contributors at https://simone-subal.sanity.studio, run `sanity deploy`

- For first-time Sanity installation, you need to install the sanity command line package:
`npm install -g @sanity/cli`
**Please note these instructions are for Sanity v2, which is no longer well-documented on the Sanity site documentation.* If you’re using a newer version of Sanity or want to upgrade to v3, [please refer to this guide](https://www.sanity.io/help/studio-v2-vs-v3).

## Account Management/Admin

Use Sanity admin tools at [https://manage.sanity.io](https://manage.sanity.io) to manage members and editor access to the CMS, CORS Origin permissions, and edit/create Webhooks.

## Frontend

### Queries

Front-end queries to Sanity use GROQ:

[https://www.sanity.io/docs/query-cheat-sheet](https://www.sanity.io/docs/query-cheat-sheet)
