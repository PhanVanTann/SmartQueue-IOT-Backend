import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QueueGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection() {
    console.log('Client connected to WebSocket');
  }

  // Hàm để các service khác gọi
  publishQueueUpdate(data: any) {
    this.server.emit('queue_update', data);
  }
}