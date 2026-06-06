import { Module } from '@nestjs/common';
import { FavoriteWordsController } from './favorite-words.controller';
import { FavoriteWordsService } from './favorite-words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteWords } from './entites/favorite-words.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FavoriteWords])],
    controllers: [FavoriteWordsController],
    providers: [FavoriteWordsService],
})
export class FavoriteWordsModule {}
