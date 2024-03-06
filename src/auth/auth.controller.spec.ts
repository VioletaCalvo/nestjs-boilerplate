import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        JwtService,
        ConfigService,
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return a token', async () => {
      const user = {
        email: 'user@test.com',
        password: 'password',
      };
      const result = {
        access_token: 'token',
      };
      jest.spyOn(service, 'signIn').mockImplementation(async () => result);
      
      const res = await controller.signIn(user);
      expect(res).toEqual(result);
    });
  });
});
