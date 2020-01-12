# MitaTanaanSyotaisiin

## Developing

1. Create .env file.

   .Env file contains postgres connectionstring and apikey. you can copy example.env.

2. (optional) Start dev database with docker

   ./docker/ contains docker-compose file. You can navigate to that folder and run

```Powershell
docker-compose up
#docker-compose up -d for detached mode
```

On first run scripts from ./db/tablescripts are executed.

If you start docker-compose with detached mode remember to stop it

```Powershell
docker-compose stop
#docker-compose down for shutting down and deleting data
```

3. Start application with single command

```Powershell
npm run start:dev
```

Command starts concurrently

```Powershell
ng serve
nodemon api/index.js
```

Commands can also be run manually.

4. Open app
   Go to [http://localhost:4200]
