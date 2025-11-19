import { Controller, Post, Body } from '@nestjs/common';
import { ArduinoService } from './arduino.service';

@Controller('api')
export class ArduinoController {
  constructor(private readonly arduinoService: ArduinoService) {}

  @Post('button')
  handleButton(@Body() body: { status: string }) {
    console.log('Controller nhận trạng thái nút:', body.status);

    this.arduinoService.handleButtonPress(body.status);

    return { ok: true };
  }
}
