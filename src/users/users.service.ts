import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async findOne(email: string): Promise<User | undefined> {
        return await this.prismaService.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async createUser(data: any, selectArgs: any) {
        return await this.prismaService.user.create({
            data: data,
            select: selectArgs,
        });
    }
}
