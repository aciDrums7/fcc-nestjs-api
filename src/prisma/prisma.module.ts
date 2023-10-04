import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
    providers: [PrismaService],
    //? needed to use classed declared here in other modules
    exports: [PrismaService],
})
export class PrismaModule {}
