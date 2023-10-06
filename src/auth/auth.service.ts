import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signup(dto: AuthDto) {
        //1 generate the password hash
        const hashedPassword = await argon.hash(dto.password);
        //2 save the new user in the db
        try {
            const user = await this.prisma.user.create({
                data: { email: dto.email, password: hashedPassword },
                select: {
                    id: false,
                    firstName: true,
                    lastName: true,
                    email: true,
                    password: false,
                    createdAt: true,
                    updatedAt: true,
                },
            });
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

    async login(dto: AuthDto) {
        //1 find the user by id
        //! if user doesn't exist throw exception
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) throw new ForbiddenException('Credentials Incorrect');

        //2 compare password
        //! if password incorrect throw exception
        const isPasswordCorrect = await argon.verify(
            user.password,
            dto.password,
        );
        if (!isPasswordCorrect)
            throw new ForbiddenException('Credentials Incorrect');

        //3 send back the user
        delete user.password;
        return user;
    }
}
