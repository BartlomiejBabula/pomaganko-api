import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: number, username: string) {
    const payload = { username: username, sub: userId };
    return {
      accessToken: this.jwtService.sign(
        {
          payload,
        },
        {
          secret: process.env.TOKEN,
          expiresIn: '15m',
        },
      ),
      refreshToken: this.jwtService.sign(
        {
          payload,
        },
        {
          secret: process.env.REFRESH_TOKEN,
          expiresIn: '3d',
        },
      ),
    };
  }

  async login(user: User): Promise<any> {
    const TOKENS = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, TOKENS.refreshToken);
    return TOKENS;
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const TOKENS = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, TOKENS.refreshToken);
    return TOKENS;
  }
}
