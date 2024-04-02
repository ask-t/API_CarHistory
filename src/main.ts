import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Specify the allowed origin
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Optionally specify allowed methods
    allowedHeaders: 'Content-Type, Authorization', // Optionally specify allowed headers
  });
  const config = new DocumentBuilder()
    .setTitle('Car History')
    .setDescription('')
    .setVersion('1.0')
    .addTag('')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3100);
}
bootstrap();
