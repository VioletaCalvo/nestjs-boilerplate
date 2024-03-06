import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'hashedPassword'>> {
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new UnprocessableEntityException('User with this email already exists');
    }
  
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      parseInt(this.configService.get('SALT_ROUNDS')),
    );

    const userInput = {
      email: createUserDto.email,
      hashedPassword,
    };
    const user = this.userRepository.create(userInput);
    const { hashedPassword: _, ...partialUser } = await this.userRepository.save(user);
    return partialUser;
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }
}
