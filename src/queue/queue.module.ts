import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Queue, QueueSchema } from '../queue/schemas/queue.schema';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Queue.name, schema: QueueSchema}]),
      WebsocketModule
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
