import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(4)
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
