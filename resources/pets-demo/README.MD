# DEMO PETS service

## Installation

```
npm install
```


## Run the project

```
npm install
npm start
```

## Service URL

```
http://localhost:3000/
```

## Swagger URL

```
http://localhost:3000/api-docs
```

## Ejecutar en Docker

Desde `resources/pets-demo` puedes construir y ejecutar la imagen Docker:

```
docker build -t pets-demo .
docker run -p 3000:3000 --name pets-demo -v "$(pwd)/pets.json:/usr/src/app/pets.json" pets-demo
```

Esto expone la API en `http://localhost:3000` y el Swagger en `http://localhost:3000/api-docs`.

## Ejecutar con docker-compose

Si usas `docker compose` desde el root del repositorio, ejecuta:

```
docker compose up --build pets-demo
```

Esto levanta el servicio como un contenedor y te permite integrarlo luego con otros servicios en el mismo servidor.



