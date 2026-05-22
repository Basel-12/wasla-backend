import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

    const config = new DocumentBuilder()
        .setTitle('Wasla')
        .setDescription('Wasla API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    if (process.env.NODE_ENV !== 'production') {
        SwaggerModule.setup('api/docs', app, document);
    }
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
