import { Module } from '@nestjs/common';
import { ArduinoService } from './arduino.service';
import { ArduinoController } from './arduino.controller';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [QueueModule],
  providers: [ArduinoService],
  controllers: [ArduinoController],
  exports: [ArduinoService],
})
export class ArduinoModule {}
