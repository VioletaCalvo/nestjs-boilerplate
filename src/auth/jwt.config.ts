import { ConfigService } from '@nestjs/config';

export default class JwtConfig {
  static getJwtConfig(configService: ConfigService) {
    return {
      global: true,
      secret: configService.get('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get('JWT_EXPIRES_AT'),
      },
    };
  }
}
