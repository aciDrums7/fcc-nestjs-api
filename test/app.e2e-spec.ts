import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();

        prisma = app.get(PrismaService);
        await prisma.cleanDb();
    });

    afterAll(() => {
        app.close();
    });

    describe('Auth', () => {
        describe('Signup', () => {
            it.todo('should signup');
        });

        describe('Login', () => {
            it.todo('should login');
        });
    });

    describe('Users', () => {
        describe('Get current user', () => {});

        describe('Edit user', () => {});
    });

    describe('Bookmarks', () => {
        describe('Get bookmarks', () => {});

        describe('Get bookmark by id', () => {});

        describe('Edit bookmark', () => {});

        describe('Create bookmark', () => {});

        describe('Delete bookmark', () => {});
    });
});
