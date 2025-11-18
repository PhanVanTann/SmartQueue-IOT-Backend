import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from '../queue/schemas/queue.schema';

@Injectable()
export class QueueService {
    constructor(@InjectModel(Queue.name) private queueModel: Model<Queue>) {}

    async createQueue( createQueueDto: any ){
        const lastQueue = await this.queueModel.findOne().sort({ number: -1 }).exec();
        const nextNumber = lastQueue ? lastQueue.number + 1 : 1;

        const newQueue = new this.queueModel({
            number: nextNumber,
            source: createQueueDto.source || 'button',
            status: 'waiting',
        });

        await newQueue.save();
        return { message: 'Queue created successfully', queue: newQueue};
    }
    async updateQueueStatus(id: string, status: string) {
        const updatedQueue = await this.queueModel.findByIdAndUpdate(
            id,
            { status },
            { new: true },
        );
        return { message: 'Queue status updated successfully', queue: updatedQueue};
    }
}
