import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './users.controller';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    const salt = await bcrypt.genSalt();
    user.username = CreateUserDto.username;
    user.password = await bcrypt.hash(CreateUserDto.password, salt);
    user.email = CreateUserDto.email;
    return this.usersRepository.save(user).catch((e) => {
      if (e.driverError.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(
          'Account with this username or email address already exists.',
        );
      }
      return e;
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: parseInt(id) } });
  }

  async deleteById(id: number): Promise<string> {
    const user = await this.usersRepository.delete(id);
    if (user.affected === 0) return `No user with id: ${id}`;
    else return `Deleted user id: ${id}`;
  }

  async update(id: number, updateUserDto: any): Promise<any> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async getProfile(accessToken: string): Promise<any> {
    const user = this.jwtService.decode(accessToken);
    return this.findById(user.payload.sub);
  }
}
