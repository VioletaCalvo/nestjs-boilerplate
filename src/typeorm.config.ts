import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [User],
      synchronize: true,
    };
  }
}
