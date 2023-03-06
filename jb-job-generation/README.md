# OpenAI - JobBoard - Job Generation

## Setup Dev Environment

Prerequisites:

- Docker + Docker-compose
- [Node Version Manager](https://github.com/nvm-sh/nvm)

Copy example .env

```bash
cp .env.example .env
```

Install NodeJS

```bash
nvm install node # installs latest nodejs version
node -v > .nvmrc # saves current nodejs version for later use
nvm use # loads and uses saved nodejs version
npm install # installs nodejs packages
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod

# access swagger docs
open http://localhost:3000/api/v1 
```