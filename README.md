# Automated tests for Weather Shopper

**Tech Stack**
Typescript, Playwright, Docker

## Prerequisites
1. Install Node.js from https://nodejs.org/en
2. Install Docker from https://docs.docker.com/engine/install/

## Project Structure At A Glance
```
│   .dockerignore
│   .gitignore
│   .prettierignore
│   .prettierrc.json
│   compose.yaml
│   Dockerfile
│   package-lock.json
│   package.json
│   playwright.config.ts
│   README.md
│   tsconfig.json
│
├───.github
│   └───workflows
│           main.yml
│           manual_run.yml
│
├───playwright-report
│       index.html
│
├───test-results
└───tests
    ├───e2e-tests
    │       weather-shopper.spec.js
    │
    ├───pages
    │       cartpage.ts
    │       homepage.ts
    │       productspage.ts
    │
    └───utilities
            functions.ts
            types.ts
```
## Getting Started

#### Clone the repo
```
git clone git@github.com:<repo_name>
```

#### Install requirements

```
npm i
```
#### Run tests

```
docker compose build
```

```
docker compose up
```

If any of the tests fails, user can see the HTML report from the browser by visiting http://localhost:9323/ 
Also the tests can be run from the Github actions. Use the Manually Run Weather Shopper Tests Github action.