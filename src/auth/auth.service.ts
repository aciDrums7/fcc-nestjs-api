import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { AuthDto } from 'src/dto';
import { JwtDto } from 'src/dto/jwt.dto';
import { UsersService } from 'src/resources/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signup(authDto: AuthDto) {
        //1 generate the password hash
        const hashedPassword = await argon.hash(authDto.password);
        //2 save the new user in the db
        try {
            const user = await this.userService.createUser(
                { email: authDto.email, password: hashedPassword },
                {
                    id: false,
                    firstName: true,
                    lastName: true,
                    email: true,
                    password: false,
                    createdAt: true,
                    updatedAt: true,
                },
            );
            //3 return the new user
            return user;
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
            const user = await this.userService.findOne(authDto.email);
            if (!user) throw new ForbiddenException('Credentials Incorrect');

            //2 compare password
            //! if password incorrect throw exception
            const isPasswordCorrect = await argon.verify(
                user.password,
                authDto.password,
            );
            if (!isPasswordCorrect)
                throw new ForbiddenException('Credentials Incorrect');

            const payload = { sub: user.id, username: user.email };
            const accessToken = await this.jwtService.signAsync(payload);
            return new JwtDto(accessToken);
        } catch (error) {
            throw error;
        }
    }
}
