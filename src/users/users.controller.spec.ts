import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UnprocessableEntityException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user and return a partial user', async () => {
      const user = {
        email: 'user@test.com',
        password: 'password',
      };
      const result = {
        id: 1,
        email: user.email,
      };
      jest.spyOn(service, 'create').mockImplementation(async () => result);

      const res = await controller.create(user);
      expect(res).toBe(result);
    });

    it('should throw an error if user already exists', async () => {
      const user = {
        email: 'user@test.com',
        password: 'password',
      };
      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new UnprocessableEntityException('User with this email already exists');
      });

      expect(controller.create(user)).rejects.toThrow(UnprocessableEntityException);
    });
  });
});
