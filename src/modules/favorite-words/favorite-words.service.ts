import { Injectable, NotFoundException } from '@nestjs/common';
import { FavoriteWords } from './entites/favorite-words.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/types/paginated-result';

@Injectable()
export class FavoriteWordsService {
    constructor(
        @InjectRepository(FavoriteWords)
        private readonly favoriteWordsRepository: Repository<FavoriteWords>,
    ) {}

    async getAll(dto: PaginationDto): Promise<PaginatedResult<FavoriteWords>> {
        const [rows, total] = await this.favoriteWordsRepository.findAndCount({
            skip: dto.skip,
            take: dto.limit,
            order: { createdAt: 'DESC' },
            relations: ['user'],
        });
        return {
            data: rows,
            meta: {
                total,
                page: dto.page,
                limit: dto.limit,
                totalPages: Math.ceil(total / dto.limit),
            },
        };
    }

    async getFavouriteWordById(id: number) {
        return await this.favoriteWordsRepository.findOne({
            where: { id },
            relations: ['user'],
        });
    }

    async getUserFavouriteWords(
        userId: number,
        dto: PaginationDto,
    ): Promise<PaginatedResult<FavoriteWords>> {
        const [rows, total] = await this.favoriteWordsRepository.findAndCount({
            where: { user: { id: userId } },
            relations: ['user'],
            skip: dto.skip,
            take: dto.limit,
            order: { createdAt: 'DESC' },
        });
        return {
            data: rows,
            meta: {
                total,
                page: dto.page,
                limit: dto.limit,
                totalPages: Math.ceil(total / dto.limit),
            },
        };
    }

    async getUserFavouriteWordById(id: number, userId: number) {
        const favoriteWord = await this.favoriteWordsRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!favoriteWord) {
            throw new NotFoundException('Favorite word not found');
        }
        return favoriteWord;
    }

    async createFavouriteWord(word: string, userId: number) {
        const favoriteWord = this.favoriteWordsRepository.create({
            word,
            user: { id: userId },
        });
        return await this.favoriteWordsRepository.save(favoriteWord);
    }

    async updateFavouriteWord(id: number, newWord: string, userId: number) {
        const favoriteWord = await this.favoriteWordsRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!favoriteWord) {
            throw new NotFoundException('Favorite word not found');
        }
        Object.assign(favoriteWord, { word: newWord });
        return await this.favoriteWordsRepository.save(favoriteWord);
    }

    async deleteFavouriteWord(id: number, userId: number) {
        const favoriteWord = await this.favoriteWordsRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!favoriteWord) {
            throw new NotFoundException('Favorite word not found');
        }
        await this.favoriteWordsRepository.delete(id);
    }
}
