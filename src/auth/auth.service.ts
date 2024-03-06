import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const passwordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordValid) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, sub: user.id };

    return {
        access_token: this.jwtService.sign(payload),
    };
  }
}
