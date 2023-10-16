import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //? needed to enable global pipes validation
    app.useGlobalPipes(
        new ValidationPipe({
            //? needed to exclude unwanted fields (not defined in dtos)
            //5 I.E. useful for malicious injection!
            whitelist: true,
        }),
    );
    await app.listen(3000);
}
bootstrap();
