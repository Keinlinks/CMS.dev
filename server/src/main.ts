import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
async function bootstrap() {
  const logger = new Logger('MAIN')
  const app = await NestFactory.create(AppModule,{
    logger: new ConsoleLogger({
      prefix: 'CMS_APP',
      timestamp: true,
      logLevels: ['log', 'error']
    }),
  });

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('CMS - testimonial')
    .setDescription('API para gestionar testimonios, usuarios y contenido del CMS.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha'
    },
    jsonDocumentUrl: '/docs/json'
  });


  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`app running on port http://localhost:${process.env.PORT}`)
  logger.log(`API-DOCUMENTATION: http://localhost:${process.env.PORT}/docs`)
}
bootstrap();
