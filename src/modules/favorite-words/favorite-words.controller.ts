import {
    Body,
    Controller,
    Delete,
    Get,
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
    getUserFavoriteWords(@Query() query: PaginationDto) {
        return this.favoriteWordsService.getAll(query);
    }

    @Get('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    getUserFavoriteWordById(@Param('id', ParseIntPipe) id: number) {
        return this.favoriteWordsService.getFavouriteWordById(id);
    }

    @Get('/my-words')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    getUserFavouriteWords(
        @CurrentUser() user: JwtPayload,
        @Query() query: PaginationDto,
    ) {
        return this.favoriteWordsService.getUserFavouriteWords(user.id, query);
    }

    @Get('/my-words/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    getUserFavouriteWordById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.favoriteWordsService.getUserFavouriteWordById(id, user.id);
    }

    @Post('/')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    createFavouriteWord(
        @Body('word') word: string,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.favoriteWordsService.createFavouriteWord(word, user.id);
    }

    @Patch('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    updateFavouriteWord(
        @Param('id', ParseIntPipe) id: number,
        @Body('word') word: string,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.favoriteWordsService.updateFavouriteWord(id, word, user.id);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.USER)
    deleteFavouriteWord(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.favoriteWordsService.deleteFavouriteWord(id, user.id);
    }
}
