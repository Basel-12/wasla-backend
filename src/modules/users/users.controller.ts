import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Get('/me')
    @Version('1')
    getProfile() {
        return 'This is the user profile';
    }
}
