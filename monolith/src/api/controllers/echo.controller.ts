import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class EchoController {
  @Get('echo')
  echo(): void {
    return;
  }
}
