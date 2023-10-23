import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import {
    AuthDto,
    CreateBookmarkDto,
    EditBookmarkDto,
    EditUserDto,
} from 'src/dtos';
import { PrismaService } from 'src/prisma/prisma.service';

const PORT = 3001;
const URL = `http://localhost:${PORT}/`;

const AUTH = 'auth/';
const USERS = 'users/';
const BOOKMARKS = 'bookmarks/';

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
        await app.listen(parseInt(`${PORT}`));

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
                    email: 'test-edit@gmail.com',
                };
                return pactum
                    .spec()
                    .patch(`${USERS}`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .withBody(userDto)
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains(userDto.firstName)
                    .expectBodyContains(userDto.email);
            });
        });
    });

    describe('Bookmarks', () => {
        const createBookmarkDto: CreateBookmarkDto = {
            title: 'First Bookmark',
            description: 'test bookmark',
            link: 'https://youtu.be/GHTA143_b-s?si=sas0vfStgC7eW5U9',
        };
        const editBookmarkDto: EditBookmarkDto = {
            description: 'test edit description',
        };

        describe('Get empty bookmarks list', () => {
            it('should get empty bookmarks list', () => {
                return pactum
                    .spec()
                    .get(`${BOOKMARKS}`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .expectStatus(HttpStatus.OK)
                    .expectBody([]);
            });
        });

        describe('Create bookmark', () => {
            it('should create bookmark', () => {
                return pactum
                    .spec()
                    .post(`${BOOKMARKS}`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .withBody(createBookmarkDto)
                    .expectStatus(HttpStatus.CREATED)
                    .expectBodyContains(createBookmarkDto.title)
                    .expectBodyContains(createBookmarkDto.description)
                    .expectBodyContains(createBookmarkDto.link)
                    .stores('bookmarkId', 'id');
            });
        });

        describe('Get bookmarks', () => {
            it('should get bookmarks list with 1 element', () => {
                return pactum
                    .spec()
                    .get(`${BOOKMARKS}`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .expectStatus(HttpStatus.OK)
                    .expectJsonLength(1);
            });
        });

        describe('Get bookmark by id', () => {
            it('should get bookmark by id', () => {
                return pactum
                    .spec()
                    .get(`${BOOKMARKS}{id}`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .withPathParams('id', '$S{bookmarkId}')
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains('$S{bookmarkId}');
            });
        });

        //TODO: fix this following tests!
        describe('Edit bookmark by id', () => {
            it('should get bookmark by id', () => {
                return pactum
                    .spec()
                    .patch(`${BOOKMARKS}{id}`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .withPathParams('id', '$S{bookmarkId}')
                    .withBody(editBookmarkDto)
                    .expectStatus(HttpStatus.OK)
                    .expectBodyContains(editBookmarkDto.description)
                    .expectBodyContains(createBookmarkDto.title)
                    .expectBodyContains(createBookmarkDto.link)
            });
        });

        describe('Delete bookmark by id', () => {
            it('should delete a bookmark', () => {
                return pactum
                    .spec()
                    .delete(`${BOOKMARKS}{id}`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .withPathParams('id', '$S{bookmarkId}')
                    .expectStatus(HttpStatus.NO_CONTENT);
            });

            it('should get empty bookmarks list', () => {
                return pactum
                    .spec()
                    .get(`${BOOKMARKS}`)
                    .withHeaders({ Authorization: 'Bearer $S{jwt}' })
                    .expectStatus(HttpStatus.OK)
                    .expectJsonLength(0);
            });
        });
    });
});
