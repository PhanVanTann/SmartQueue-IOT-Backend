import { Test, TestingModule } from '@nestjs/testing';
import { SmartqueueService } from './smartqueue.service';

describe('SmartqueueService', () => {
  let service: SmartqueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartqueueService],
    }).compile();

    service = module.get<SmartqueueService>(SmartqueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
