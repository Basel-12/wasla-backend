import { Module } from '@nestjs/common';
import { FavoriteWordsController } from './favorite-words.controller';
import { FavoriteWordsService } from './favorite-words.service';

@Module({
  controllers: [FavoriteWordsController],
  providers: [FavoriteWordsService]
})
export class FavoriteWordsModule {}
