import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { AuthDto, EditUserDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

const URL = 'http://localhost:3337/';
const AUTH = 'auth/';
const USERS = 'users/';

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
        await app.listen(3337);

        prisma = app.get(PrismaService);
        await prisma.cleanDb();
        pactum.request.setBaseUrl(`${URL}`);
    });

    afterAll(() => {
        app.close();
    });

    describe('Auth', () => {
        const authDto: AuthDto = {
            email: 'test@email.com',
            password: '123',
        };
        describe('Signup', () => {
            it('should throw error if email empty', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}signup`)
                    .withBody({ password: authDto.password })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw error if password empty', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}signup`)
                    .withBody({ email: authDto.email })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw error if email is not valid', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}signup`)
                    .withBody({ email: 'email@.com' })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw error if no body is provided', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}signup`)
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should signup', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}signup`)
                    .withBody(authDto)
                    .expectStatus(HttpStatus.CREATED);
                //? needed to show request and response payloads
            });
        });

        //? Since these are e2e tests, all this describe are executed consequentially
        //? so that when I call the 'Login' describe, the user created with 'Signup' describe
        //? still exists
        describe('Login', () => {
            it('should throw error if email empty', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}login`)
                    .withBody({ password: authDto.password })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw error if password empty', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}login`)
                    .withBody({ email: authDto.email })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw error if email is not valid', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}login`)
                    .withBody({ email: 'email@.com' })
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should throw error if no body is provided', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}login`)
                    .expectStatus(HttpStatus.BAD_REQUEST);
            });
            it('should login', () => {
                return pactum
                    .spec()
                    .post(`${AUTH}login`)
                    .withBody(authDto)
                    .expectStatus(HttpStatus.OK)
                    .stores('jwt', 'access_token');
            });
        });
    });

    describe('Users', () => {
        describe('Get current user', () => {
            it('should get current user', () => {
                return pactum
                    .spec()
                    .get(`${USERS}currentUser`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .expectStatus(HttpStatus.OK);
            });
        });

        describe('Edit user', () => {
            it('should edit current user', () => {
                const userDto: EditUserDto = {
                    firstName: 'Edoardo',
                    email: 'acidrums7@gmail.com',
                };
                return pactum
                    .spec()
                    .patch(`${USERS}`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .withBody(userDto)
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains(userDto.firstName)
                    .expectBodyContains(userDto.email);
                // .inspect();
            });
        });
    });

    describe('Bookmarks', () => {
        describe('Get bookmarks', () => {});

        describe('Get bookmark by id', () => {});

        describe('Edit bookmark by id', () => {});

        describe('Create bookmark', () => {});

        describe('Delete bookmark by id', () => {});
    });
});
