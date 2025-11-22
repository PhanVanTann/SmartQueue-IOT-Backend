import { Injectable, OnModuleInit } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { QueueService,  } from '../queue/queue.service'; // import QueueService

@Injectable()
export class ArduinoService implements OnModuleInit {
  private port: SerialPort;
  private parser: ReadlineParser;

  // Inject QueueService vào ArduinoService
  constructor(private readonly queueService: QueueService) {}

  onModuleInit() {
    // Khởi tạo cổng Serial
    this.port = new SerialPort({
      path: 'COM3', // đổi thành cổng Arduino thực tế của bạn
      baudRate: 9600,
      autoOpen: false,
    }); 

    this.port.open((err) => {
      if (err) {
        return console.error('Không mở được cổng Serial:', err.message);
      }
      console.log('Serial mở thành công!');
    });

    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    // Lắng nghe dữ liệu từ Arduino
    this.parser.on('data', async (data) => {
      console.log('Nhận từ Arduino:', data);

      if (data === 'PRESSED') {
        await this.handleButtonPress('pressed');
      } else if (data === 'RELEASED') {
        await this.handleButtonPress('released');
      }else if (data === 'PRESSED2') {
        await this.handleButtonPress('pressed2');
      }
      else if (data === 'RELEASED2') {
        await this.handleButtonPress('released2');
      }
    });
  }

  // Hàm xử lý trạng thái nút nhấn
async handleButtonPress(status: string) {
  console.log('Service xử lý trạng thái nút:', status);

  if (status === 'pressed') {
    try {
      const result = await this.queueService.createQueue({ source: 'button' });
      console.log('QueueService trả về:', result);
      // result.queue là document mới tạo
    } catch (err) {
      console.error('Lỗi khi tạo queue:', err.message);
    }
  }
  // else if (status === 'released')
  // {
  //   try {
  //     const result = await this.queueService.createQueue({ source: 'button' });
  //     console.log('QueueService trả về:', result);
  //   } catch (err) {
  //     console.error('Lỗi khi tạo queue:', err.message);
  //   }
  // }
  else if (status === 'pressed2') {
    try {
      const result = await this.queueService.callNextNumber();
      console.log('QueueService trả về:', result);
    } catch (err) {
      console.error('Lỗi khi gọi số tiếp theo:', err.message);
    }
  }
  // else if (status === 'released2')
  // {
  //   try {
  //     const result = await this.queueService.callNextNumber();
  //     console.log('QueueService trả về:', result);
  //   } catch (err) {
  //     console.error('Lỗi khi gọi số tiếp theo:', err.message);
  //   }
  // }
  
}

}