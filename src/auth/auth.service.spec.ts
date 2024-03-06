import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';


describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        }
      ],  
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const userSignIn = {
        email: 'user@test.com',
        password: 'password',
      };
      const mockedDbUser = {
        id: 1,
        email: userSignIn.email,
        hashedPassword: 'hashedPassword',
      };
      const mockedToken = 'someToken';
      jest.spyOn(usersService, 'findOneByEmail').mockImplementation(async () => mockedDbUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true)
      jest.spyOn(jwtService, 'sign').mockImplementation(() => mockedToken)

      const expectedToken = {
        access_token: mockedToken,
      }
      const token = await authService.signIn(userSignIn);
      expect(token).toEqual(expectedToken);
    });

    it('should throw an exception if password is not valid', async () => {
      const userSignIn = {
        email: 'user@test.com',
        password: 'password',
      };
      const mockedDbUser = {
        id: 1,
        email: userSignIn.email,
        hashedPassword: 'hashedPassword',
      };
      const userServiceSpy = jest.spyOn(usersService, 'findOneByEmail').mockImplementation(async () => mockedDbUser);
      const bcryptSpy = jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false)
      const jwtServiceSpy = jest.spyOn(jwtService, 'sign').mockImplementation(() => 'someToken')

      await expect(authService.signIn(userSignIn)).rejects.toThrow();
      expect(userServiceSpy).toHaveBeenCalled();
      expect(bcryptSpy).toHaveBeenCalled();
      expect(jwtServiceSpy).not.toHaveBeenCalled();
    });
  });
});
