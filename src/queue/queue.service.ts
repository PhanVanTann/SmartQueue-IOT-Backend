import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from '../queue/schemas/queue.schema';
import { QueueGateway } from '../websocket/queue.gateway';

@Injectable()
export class QueueService {
    constructor(@InjectModel(Queue.name) private queueModel: Model<Queue>, private queueGateway: QueueGateway) {}

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
        const current = await this.queueModel.findOne({ status: 'calling' }).sort({ number: 1 });
        const waitingList = await this.queueModel.find({ status: 'waiting' }).sort({ number: 1 }).lean();
        if (!current) {
            this.queueGateway.publishQueueUpdate({ 
                currentNumber: newQueue.number,
                nextNumbers: [],
                waitingCount: await this.queueModel.countDocuments({ status: 'waiting' }) ,
                waiting: waitingList.map(x => x.number),
            });
            return { message: 'Queue created successfully', queue: newQueue};
        }
        const upcoming = await this.queueModel
            .find({ status: 'waiting' })
            .sort({ number: 1 })
            .limit(5);
        this.queueGateway.publishQueueUpdate({ 
            currentNumber: current.number,
            nextNumbers: upcoming.map(x => x.number),
            waitingCount: await this.queueModel.countDocuments({ status: 'waiting' }) ,
            waiting: waitingList.map(x => x.number),
            number: newQueue.number,
        });
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
        const waitingList = await this.queueModel.find({ status: 'waiting' }).sort({ number: 1 }).lean();
        this.queueGateway.publishQueueUpdate({ 
            currentNumber: next.number,
            nextNumbers: upcoming.map(x => x.number),
            waitingCount: await this.queueModel.countDocuments({ status: 'waiting' }),
            waiting: waitingList.map(x => x.number),
        });
        return {
            currentNumber: next.number,
            nextNumbers: upcoming.map(x => x.number),
            waitingCount: await this.queueModel.countDocuments({ status: 'waiting' }),
            waiting: waitingList.map(x => x.number),
        };
    }
    async getCurrentQueue() {
        const current = await this.queueModel.findOne({ status: 'calling' }).sort({ number: 1 });
        const waitingList = await this.queueModel.find({ status: 'waiting' }).sort({ number: 1 }).lean();

        if (!current) {
            const awiting = await this.queueModel.findOne({ status: 'waiting' }).sort({ number: 1 }).lean();
            if (awiting) {
                return {
                    currentNumber: null,
                    nextNumbers: [awiting.number],
                    waitingCount: await this.queueModel.countDocuments({ status: 'waiting' }),
                    waiting: waitingList.map(x => x.number),
                };
            }
            return {
                currentNumber: null,
                nextNumbers: [],
                waitingCount: 0,
                waiting: [],
            };
        }

        const upcoming = await this.queueModel
            .find({ status: 'waiting' })
            .sort({ number: 1 })
            .limit(5);

        return {
            currentNumber: current.number,
            nextNumbers: upcoming.map(x => x.number),
            waitingCount: await this.queueModel.countDocuments({ status: 'waiting' }),
            waiting: waitingList.map(x => x.number),
        };
    }
    async clearQueues() {
        await this.queueModel.deleteMany({});
        this.queueGateway.publishQueueUpdate({ 
            currentNumber: null,
            nextNumbers: [],
            waitingCount: 0,
            waiting: [],
        });
        return { message: 'All queues cleared successfully' };
    }
}
