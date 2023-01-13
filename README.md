# Next.js Teslo-shop App
Para correr localmente se necesita la base de datos
```
docker-compose up -d
```

* El -d, significa __detached__

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__
```
MONGO_URL=mongodb://localhost:27017/teslodb
```

* Reconstruir los modulos de node y levantar Next
```
yarn install
yarn dev
```

## Llenar la base de datos con informacion de pruebas

Llamara:
```
http://localhost:3000/api/seed
```




### Despliegue NextAuth
Es escencial agregar NEXAUTH_URL en caso de no desplegar en Vercel y tmb en los settings de Github