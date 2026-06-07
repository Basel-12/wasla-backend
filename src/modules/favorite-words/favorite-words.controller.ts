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
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { FavoriteWordsService } from './favorite-words.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt.paylpad';

@Controller('favorite-words')
export class FavoriteWordsController {
    constructor(private readonly favoriteWordsService: FavoriteWordsService) {}

    @Get('/')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getUserFavoriteWords(@Query() query: PaginationDto) {
        const result = await this.favoriteWordsService.getAll(query);
        return {
            success: true,
            message: 'Fetched Successfully',
            data: result,
        };
    }

    @Get('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getUserFavoriteWordById(@Param('id', ParseIntPipe) id: number) {
        const result = await this.favoriteWordsService.getFavouriteWordById(id);
        return {
            success: true,
            message: 'Fetched Successfully',
            data: result,
        };
    }

    @Get('/my-words')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    async getUserFavouriteWords(
        @CurrentUser() user: JwtPayload,
        @Query() query: PaginationDto,
    ) {
        const result = await this.favoriteWordsService.getUserFavouriteWords(
            user.id,
            query,
        );
        return {
            success: true,
            message: 'Fetched Successfully',
            data: result,
        };
    }

    @Get('/my-words/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    async getUserFavouriteWordById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtPayload,
    ) {
        const result = await this.favoriteWordsService.getUserFavouriteWordById(
            id,
            user.id,
        );
        return {
            success: true,
            message: 'Fetched Successfully',
            data: result,
        };
    }

    @Post('/')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    @HttpCode(HttpStatus.CREATED)
    async createFavouriteWord(
        @Body('word') word: string,
        @CurrentUser() user: JwtPayload,
    ) {
        const result = await this.favoriteWordsService.createFavouriteWord(
            word,
            user.id,
        );
        return {
            success: true,
            message: 'Created Successfully',
            data: result,
        };
    }

    @Patch('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    async updateFavouriteWord(
        @Param('id', ParseIntPipe) id: number,
        @Body('word') word: string,
        @CurrentUser() user: JwtPayload,
    ) {
        const result = await this.favoriteWordsService.updateFavouriteWord(
            id,
            word,
            user.id,
        );
        return {
            success: true,
            message: 'Updated Successfully',
            data: result,
        };
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    async deleteFavouriteWord(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtPayload,
    ) {
        await this.favoriteWordsService.deleteFavouriteWord(id, user.id);
        return {
            success: true,
            message: 'Deleted Successfully',
        };
    }
}
