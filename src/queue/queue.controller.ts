import { Body, Controller, Patch, Post ,Put,Param, Get, Delete} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueStatusDto } from './dto/update-queue.dto';
import { CreatenextQueueDto } from './dto/next-queue.dto';

@Controller('queue')
export class QueueController {
    constructor(private readonly queueService: QueueService) {}
    @Post()
    async createQueue(@Body() createQueueDto: CreateQueueDto) {
        return this.queueService.createQueue(createQueueDto);
    }
    @Put(':id')
    async updateQueueStatus(@Param('id') id: string,@Body() updateData: UpdateQueueStatusDto) {
            
        const { status } = updateData;
        return this.queueService.updateQueueStatus(id, status!);
    }
    @Post('/next')
    async callNextQueue() {
        return this.queueService.callNextNumber();
    }
    @Get('/current')
    async getCurrentQueue() {
        return this.queueService.getCurrentQueue();
    }
    @Delete('/clear')
    async clearQueues() {
        return this.queueService.clearQueues();
    }
}
