import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from '../queue/schemas/queue.schema';

@Injectable()
export class QueueService {
    constructor(@InjectModel(Queue.name) private queueModel: Model<Queue>) {}

    async createQueue( createQueueDto: any ){
        let status = 'waiting';
        const calling = await this.queueModel.findOne({ status: 'calling' });
        if (!calling){
            status = 'calling';
        }
        const lastQueue = await this.queueModel.findOne().sort({ number: -1 }).exec();
        const nextNumber = lastQueue ? lastQueue.number + 1 : 1;

        const newQueue = new this.queueModel({
            number: nextNumber,
            source: createQueueDto.source || 'button',
            status: status,
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
    async callNextNumber( ) {
        await this.queueModel.updateOne(
            { status: 'calling' },
            { status: 'done' }
        );

        // 2. Lấy số tiếp theo trong danh sách chờ
        const next = await this.queueModel.findOne({ status: 'waiting' }).sort({ number: 1 });

         if (!next) {
            // Nếu không có số tiếp theo, trả về mặc định
            return {
            currentNumber: null,
            nextNumbers: [],
            waitingCount: 0
            };
        }


        // 3. Cập nhật nó thành "calling"
        next.status = 'calling';
        await next.save();

         const upcoming = await this.queueModel
            .find({ status: 'waiting' })
            .sort({ number: 1 })
            .limit(5);

        return {
            currentNumber: next.number,
            nextNumbers: upcoming.map(x => x.number),
            waitingCount: await this.queueModel.countDocuments({ status: 'waiting' })
        };
    }
    async getCurrentQueue() {
        const current = await this.queueModel.findOne({ status: 'calling' }).sort({ number: 1 });

        if (!current) {
            const awiting = await this.queueModel.findOne({ status: 'waiting' }).sort({ number: 1 }).lean();
            if (awiting) {
                return {
                    currentNumber: null,
                    nextNumbers: [awiting.number],
                    waitingCount: await this.queueModel.countDocuments({ status: 'waiting' })
                };
            }
            return {
                currentNumber: null,
                nextNumbers: [],
                waitingCount: 0
            };
        }

        const upcoming = await this.queueModel
            .find({ status: 'waiting' })
            .sort({ number: 1 })
            .limit(5);

        return {
            currentNumber: current.number,
            nextNumbers: upcoming.map(x => x.number),
            waitingCount: await this.queueModel.countDocuments({ status: 'waiting' })
        };
    }
}
