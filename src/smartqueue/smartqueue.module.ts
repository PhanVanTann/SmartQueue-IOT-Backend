import { Module } from '@nestjs/common';
import { SmartqueueService } from './smartqueue.service';
import { SmartqueueController } from './smartqueue.controller';

@Module({
  providers: [SmartqueueService],
  controllers: [SmartqueueController]
})
export class SmartqueueModule {}
