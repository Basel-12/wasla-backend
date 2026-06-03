import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteWordsController } from './favorite-words.controller';

describe('FavoriteWordsController', () => {
  let controller: FavoriteWordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteWordsController],
    }).compile();

    controller = module.get<FavoriteWordsController>(FavoriteWordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
