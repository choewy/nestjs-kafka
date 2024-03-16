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
# send a message(Buffer("hi, message topic 1")) to message-topic-1
curl http://localhost:3000/producer/message/1

# send a message(String("hi, message topic 2")) to message-topic-2
curl http://localhost:3000/producer/message/2

# send a message(String('{"message": "hi, message topic 3"}')) to message-topic-3
curl http://localhost:3000/producer/message/3
```
