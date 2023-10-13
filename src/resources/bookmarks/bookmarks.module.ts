import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';

@Module({
    providers: [BookmarksService],
    exports: [BookmarksService],
    controllers: [BookmarksController],
})
export class BookmarksModule {}
