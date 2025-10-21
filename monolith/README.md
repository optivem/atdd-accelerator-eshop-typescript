# System - Monolith (TypeScript)

## Instructions

Open up the 'monolith' folder

```shell
cd monolith
```

Check that you have Powershell 7

```shell
$PSVersionTable.PSVersion
```

Check that you have Node.js 22 installed

```shell
node -v
```

Install dependencies

```shell
npm install
```

Install NestJS CLI

```shell
npm install -g @nestjs/cli
```

Set the port

```shell
$env:PORT = "8080"
```

Build the application

```shell
npm run build
```

Run the application

```shell
npm run start
```

Restart the application

```shell
npm run build && npm run start
```

App should now be running on:
http://localhost:8080/
