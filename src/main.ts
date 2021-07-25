import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const whitelist = ['http://localhost:8080'];
  app.enableCors({
    origin(origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Square Cup Labs API')
    .setDescription('This is the API doc for the square cup labs api')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // SwaggerModule.setup('api', app, document);
  const redocOptions: RedocOptions = {
    title: 'Square Cup Labs API',
    logo: {
      url: 'https://redocly.github.io/redoc/petstore-logo.png',
      backgroundColor: '#F0F0F0',
      altText: 'Square Labs API logo',
    },
    untrustedSpec: true,
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    // auth: {
    //   enabled: true,
    //   user: 'admin',
    //   password: '123',
    // },
    tagGroups: [
      {
        name: 'default',
        tags: ['auth', 'health', 'users', 'connectors', 'office365'],
      },
    ],
  };
  // Instead of using SwaggerModule.setup() you call this module
  await RedocModule.setup('/api', app, document, redocOptions);

  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
