# NestJS Kafka

## Installing

```bash
npm i @choewy/nestjs-kafka
```

> `app.enableShutdownHooks()` is essential when using the consumer

## Example

### Run kafak with docker

```bash
npm run docker
```

### Run Nest.js Application

```bash
cd example

npm run start:dev
```

```bash
# send a message(Buffer("hi, message topic 1")) to topic-1
curl http://localhost:3000/producer/1

# send a message(String("hi, message topic 2")) to topic-2
curl http://localhost:3000/producer/2

# send a message(String('{"message": "hi, message topic 3"}')) to topic-2
curl http://localhost:3000/producer/3
```
