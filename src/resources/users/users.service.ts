import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { EditUserDto } from 'src/dtos';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async getAllUsers(): Promise<Array<User> | undefined> {
        return await this.prismaService.user.findMany({});
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        return await this.prismaService.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async createUser(data: any): Promise<User> {
        return await this.prismaService.user.create({
            data: data,
        });
    }

    async editUser(userId: number, userDto: EditUserDto): Promise<User> {
        const editedUser = await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                ...userDto,
            },
        });

        delete editedUser.password;
        return editedUser;
    }
}
