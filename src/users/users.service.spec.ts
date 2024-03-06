import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException } from '@nestjs/common';

describe('UserService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        }
      ],      
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });
  describe('create', () => {
    it('should create a user', async () => {
      const user = {
        email: 'user@test.com',
        password: 'password',
      };
      const mockedDbUser = {
        id: 'uuid',
        email: user.email,
        hashedPassword: 'hashedPassword',
      };
      jest.spyOn(repository, 'findOneBy').mockImplementation(async () => Promise.resolve(null));
      jest.spyOn(repository, 'create').mockImplementation(() => mockedDbUser);
      jest.spyOn(repository, 'save').mockImplementation(async () => Promise.resolve(mockedDbUser));

      const res = await service.create(user);
      const expectedResult = {
        id: mockedDbUser.id,
        email: user.email,
      };
      expect(res).toEqual(expectedResult);
    });

    it('should return error when user already exists', async () => {
      const user = {
        email: 'user@test.com',
        password: 'password',
      };
      const mockedDbUser = {
        id: 'uuid',
        email: user.email,
        hashedPassword: 'hashedPassword',
      };
      const findOneBySpy = jest.spyOn(repository, 'findOneBy').mockImplementation(async () => Promise.resolve(mockedDbUser));
      const createSpy = jest.spyOn(repository, 'create').mockImplementation(() => mockedDbUser);
      const saveSpy = jest.spyOn(repository, 'save').mockImplementation(async () => Promise.resolve(mockedDbUser));

      await expect(service.create(user)).rejects.toThrow(UnprocessableEntityException);
      expect(findOneBySpy).toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should find by email', async () => {
      const userEmail = 'user@test.com';
      const mockedDbUser = {
        id: 'uuid',
        email: userEmail,
        hashedPassword: 'hashedPassword',
      };
      jest.spyOn(repository, 'findOneBy').mockImplementation(async () => Promise.resolve(mockedDbUser));

      const res = await service.findOneByEmail(userEmail);
      expect(res).toEqual(mockedDbUser);
    });
  });
});
