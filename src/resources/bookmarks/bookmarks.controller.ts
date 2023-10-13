import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CreateBookmarkDto } from 'src/dtos';
import { GetUser } from 'src/decorators';
import { EditBookmarkDto } from 'src/dtos';
import { JwtGuard } from 'src/guards';
import { BookmarksService } from './bookmarks.service';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarksController {
    constructor(private bookmarksService: BookmarksService) {}

    @Get()
    getBookmarks(@GetUser('sub') userId: number) {
        return this.bookmarksService.getBookmarks(userId);
    }

    @Get(':id')
    getBookmarkById(@Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarksService.getBookmarkById(bookmarkId);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('/')
    createBookmark(
        @GetUser('sub') userId: number,
        @Body() createBookmarkDto: CreateBookmarkDto,
    ) {
        return this.bookmarksService.createBookmark(userId, createBookmarkDto);
    }

    @Patch(':id')
    editBookmarkById(
        @GetUser('sub') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() editBookmarkDto: EditBookmarkDto,
    ) {
        return this.bookmarksService.editBookmarkById(
            userId,
            bookmarkId,
            editBookmarkDto,
        );
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(
        @GetUser('sub') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
    ) {
        return this.bookmarksService.deleteBookmarkById(userId, bookmarkId);
    }
}
