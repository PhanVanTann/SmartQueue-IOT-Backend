import { Body, Controller, Patch, Post ,Put,Param} from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueStatusDto } from './dto/update-queue.dto';

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
}
