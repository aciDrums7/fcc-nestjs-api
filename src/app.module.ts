import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
    imports: [
        AuthModule,
        UserModule,
        BookmarkModule,
        PrismaModule,
        NestjsFormDataModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
