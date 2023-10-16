import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Bookmark } from '@prisma/client';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/dtos';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarksService {
    constructor(private prismaService: PrismaService) {}

    async getBookmarks(userId: number): Promise<Bookmark[]> {
        return await this.prismaService.bookmark.findMany({
            where: {
                //? equivalent to userId: userId
                userId,
            },
        });
    }

    async getBookmarkById(bookmarkId: number): Promise<Bookmark> {
        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId,
            },
        });
        if (!bookmark)
            throw new NotFoundException(
                `Bookmark with id: ${bookmarkId} not found`,
            );
        return bookmark;
    }

    async createBookmark(
        userId: number,
        createBookmarkDto: CreateBookmarkDto,
    ): Promise<Bookmark> {
        return await this.prismaService.bookmark.create({
            data: {
                userId,
                ...createBookmarkDto,
            },
        });
    }

    async editBookmarkById(
        userId: number,
        bookmarkId: number,
        editBookmarkDto: EditBookmarkDto,
    ): Promise<Bookmark> {
        const bookmark = await this.getBookmarkById(bookmarkId);
        if (!bookmark || bookmark.id !== userId)
            throw new ForbiddenException('Access to resource denied');
        return await this.prismaService.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: { ...editBookmarkDto },
        });
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.getBookmarkById(bookmarkId);
        if (!bookmark || bookmark.id !== userId)
            throw new ForbiddenException('Access to resource denied');
        return await this.prismaService.bookmark.delete({
            where: {
                id: bookmarkId,
            },
        });
    }
}
