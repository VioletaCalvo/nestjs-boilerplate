import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from "supertest";
import { Repository } from 'typeorm';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();

    userRepository = moduleFixture.get('UserRepository');
  });

  afterEach(async () => {
    await userRepository.delete({});
    await app.close();
  });

  describe('GET /', () => {
    it('should return the main message', () => {
      return request(server)
        .get('/')
        .expect(200)
        .expect('NestJS Boilerplate with TypeORM, JWT Authentication and validation!');
    });
  });

  describe('POST /users', () => {
    it('should create a user', async () => {
      const user = {
        email: 'user@email.com',
        password: 'password1234',
      };
      const expectedBody = {
        email: user.email,
        id: expect.any(String),
      }
      const res = await request(server).post('/users').send(user).expect(201);
      expect(res.body).toEqual(expectedBody);
    });
  });

  describe('POST /auth/login', () => {
    it('should return a valid token for an existing user', async () => {
      const user = {
        email: 'user@email.com',
        password: 'password1234',
      };

      await request(server).post('/users').send(user).expect(201)
      const res = await request(server).post('/auth/login').send(user).expect(200)
      expect(res.body.access_token).toBeDefined();
    });
  });

  describe('POST /auth/profile', () => {
    it('should get a JWT then successfully make a call', async () => {
      const user = {
        email: 'user@email.com',
        password: 'password1234',
      };
      await request(server).post('/users').send(user).expect(201)
      const loginReq = await request(server).post('/auth/login').send(user).expect(200);
  
      const token = loginReq.body.access_token;
      const res = await request(server)
        .get('/auth/profile')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
      expect(res.body.sub).toBeDefined();
      expect(res.body.email).toEqual(user.email);
    });
  });
});
