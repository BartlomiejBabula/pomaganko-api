import { Controller, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.userService.deleteById(Number(id));
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req) {
    const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    return this.userService.getProfile(accessToken);
  }
}
