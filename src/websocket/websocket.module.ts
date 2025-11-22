import { Module } from '@nestjs/common';
import { QueueGateway } from './queue.gateway';

@Module({
  providers: [QueueGateway], // Khai báo Gateway
  exports: [QueueGateway],   // Export ra để các service khác inject
})
export class WebsocketModule {} 