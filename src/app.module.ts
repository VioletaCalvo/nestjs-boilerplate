import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import TypeOrmConfig from './typeorm.config';

const isTestEnv = process.env.NODE_ENV === 'test';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: isTestEnv ? '.env.test' : '.env', 
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
         TypeOrmConfig.getOrmConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
