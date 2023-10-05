import { Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    signup(dto: AuthDto) {
        return dto;
    }

    login() {
        return { msg: `I've logged in` };
    }
}
