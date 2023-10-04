import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'postgresql://postgres:Postgres1!@postgres:5432/fcc-nestjs-api?schema=public',
                },
            },
        });
    }
}
