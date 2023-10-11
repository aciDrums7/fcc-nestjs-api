import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './resources/users/users.module';
import { BookmarksModule } from './resources/bookmarks/bookmarks.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UsersModule,
        BookmarksModule,
        PrismaModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
