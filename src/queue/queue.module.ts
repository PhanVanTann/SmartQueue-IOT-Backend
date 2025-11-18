import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Queue, QueueSchema } from '../queue/schemas/queue.schema';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Queue.name, schema: QueueSchema}]),
  ],
  controllers: [QueueController],
  providers: [QueueService]
})
export class QueueModule {}
