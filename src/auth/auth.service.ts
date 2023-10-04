import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    signup() {
        return { msg: `I'm signed up` };
    }

    login() {
        return { msg: `I've logged in` };
    }
}
