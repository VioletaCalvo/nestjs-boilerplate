import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './shared/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getMain(): string {
    return this.appService.getMain();
  }
}
