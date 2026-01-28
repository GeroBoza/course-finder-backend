import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Prefijo global /api
    app.setGlobalPrefix('api');

    // Validación global
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Manejo centralizado de errores
    app.useGlobalFilters(new HttpExceptionFilter());

    // Interceptor para respuestas consistentes
    app.useGlobalInterceptors(new TransformInterceptor());

    // Configuración de Swagger
    const config = new DocumentBuilder()
        .setTitle('API Plataforma de Cursos')
        .setDescription('API REST para la plataforma de cursos')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // Habilitar CORS para desarrollo
    app.enableCors();

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}/api`);
    console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
