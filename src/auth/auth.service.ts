import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { AuthDto, JwtDto } from 'src/dtos';
import { UsersService } from 'src/resources/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signup(authDto: AuthDto): Promise<JwtDto> {
        //1 generate the password hash
        const hashedPassword = await argon.hash(authDto.password);
        //2 save the new user in the db
        try {
            /* const user: Prisma.UserSelect = await this.userService.createUser(
                { email: authDto.email, password: hashedPassword },
                {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    password: false,
                    createdAt: true,
                    updatedAt: true,
                },
            ); */
            const user: User = await this.userService.createUser({
                email: authDto.email,
                password: hashedPassword,
            });
            //3 return a JWT based on the user just created
            return this.createJwt(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                //? Prisma has specific errors, P2022 -> "Unique constraint failed on the {constraint}"
                //5 https://www.prisma.io/docs/reference/api-reference/error-reference
                if (error.code == 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            } else {
                throw error;
            }
        }
    }

    async login(authDto: AuthDto): Promise<JwtDto> {
        //1 find the user by id
        //! if user doesn't exist throw exception
        try {
            const user = await this.userService.findUserByEmail(authDto.email);
            if (!user) throw new ForbiddenException('Credentials Incorrect');

            //2 compare password
            //! if password incorrect throw exception
            const isPasswordCorrect = await argon.verify(
                user.password,
                authDto.password,
            );
            if (!isPasswordCorrect)
                throw new ForbiddenException('Credentials Incorrect');

            return this.createJwt(user.id, user.email);
        } catch (error) {
            throw error;
        }
    }

    private async createJwt(userId: number, username: string): Promise<JwtDto> {
        const payload = { sub: userId, username: username };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '21m',
            secret: this.configService.get('JWT_SECRET'),
        });
        return new JwtDto(accessToken);
    }
}
