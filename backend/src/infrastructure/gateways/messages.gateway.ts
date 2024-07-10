import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  sendMessageToConversation(conversationId: number, message: any) {
    this.server.to(`conversation_${conversationId}`).emit('newMessage', message);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @MessageBody() conversationId: number,
    @ConnectedSocket() client: Socket
  ) {
    client.join(`conversation_${conversationId}`);
  }
}
