import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMain(): string {
    return 'NestJS Boilerplate with TypeORM, JWT Authentication and validation!';
  }
}
