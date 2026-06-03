import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteWordsService } from './favorite-words.service';

describe('FavoriteWordsService', () => {
  let service: FavoriteWordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteWordsService],
    }).compile();

    service = module.get<FavoriteWordsService>(FavoriteWordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
