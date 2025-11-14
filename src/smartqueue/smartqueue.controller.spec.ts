import { Test, TestingModule } from '@nestjs/testing';
import { SmartqueueController } from './smartqueue.controller';

describe('SmartqueueController', () => {
  let controller: SmartqueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartqueueController],
    }).compile();

    controller = module.get<SmartqueueController>(SmartqueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
